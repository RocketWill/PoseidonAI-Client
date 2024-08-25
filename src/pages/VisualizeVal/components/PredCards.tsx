/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-08-25 17:21:13
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-08-25 20:25:35
 * @FilePath: /PoseidonAI-Client/src/pages/VisualizeVal/components/PredCards.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { Image as AntdImage, Card, List, Spin } from 'antd';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { VisualizationItem } from '..';

interface PredCardsProps {
  data: VisualizationItem;
  address: string;
  style?: CSSProperties;
}

type Annotation = number[]; // [x0, y0, x1, y1, ...] 数组类型

interface ImageWithMergedAnnotationsProps {
  imageUrl: string;
  annotations1: Annotation[];
  annotations2: Annotation[];
}

const drawShape = (ctx: CanvasRenderingContext2D, points: Annotation, color: string = 'red') => {
  ctx.beginPath();
  if (points.length === 4) {
    // 绘制矩形
    ctx.rect(points[0], points[1], points[2] - points[0], points[3] - points[1]);
  } else {
    // 绘制多边形
    ctx.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) {
      ctx.lineTo(points[i], points[i + 1]);
    }
    ctx.closePath();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

const mergeImages = async (
  imageUrl: string,
  annotations1: Annotation[],
  annotations2: Annotation[],
  setMergedImageUrl: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  try {
    // 加载两张图片
    const [image1, image2] = await Promise.all([loadImage(imageUrl), loadImage(imageUrl)]);

    // 确保图片宽度为800px，高度按比例缩放
    const targetWidth = 800;
    const scaleFactor = targetWidth / image1.width;
    const targetHeight = image1.height * scaleFactor;

    // 创建画布并设置宽度为两个图像的宽度之和
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth * 2;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 绘制第一张图片
    ctx.drawImage(image1, 0, 0, targetWidth, targetHeight);

    // 在第一张图片旁边绘制第二张图片
    ctx.drawImage(image2, targetWidth, 0, targetWidth, targetHeight);

    // 在第一张图片上绘制预测标注
    annotations1.forEach((points) => {
      const scaledPoints = points.map((point, index) =>
        index % 2 === 0 ? point * scaleFactor : point * scaleFactor,
      );
      drawShape(ctx, scaledPoints, '#E49BFF');
    });

    // 为第二张图片平移画布
    ctx.translate(targetWidth, 0);

    // 在第二张图片上绘制标注结果
    annotations2.forEach((points) => {
      const scaledPoints = points.map((point, index) =>
        index % 2 === 0 ? point * scaleFactor : point * scaleFactor,
      );
      drawShape(ctx, scaledPoints, '#F6FB7A');
    });

    // 重置平移
    ctx.translate(-targetWidth, 0);

    // 将画布转换为 Object URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setMergedImageUrl(url);
      }
    });
  } catch (error) {
    console.error('Error loading images:', error);
  }
};

const ImageWithMergedAnnotations: React.FC<ImageWithMergedAnnotationsProps> = ({
  imageUrl,
  annotations1,
  annotations2,
}) => {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    mergeImages(imageUrl, annotations1, annotations2, setMergedImageUrl);
  }, [imageUrl, annotations1, annotations2]);

  return mergedImageUrl ? (
    <AntdImage
      src={mergedImageUrl}
      alt="Merged Image"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  ) : (
    <Spin size="large" />
  );
};

const LazyImageWithMergedAnnotations: React.FC<ImageWithMergedAnnotationsProps> = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1, // 控制图片什么时候开始加载
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={elementRef} style={{ minHeight: '100px', marginBottom: 0 }}>
      {isVisible ? (
        <ImageWithMergedAnnotations {...props} />
      ) : (
        <Spin size="large" style={{ width: '100%' }} />
      )}
    </div>
  );
};

const PredCards: React.FC<PredCardsProps> = ({ data, address, style }) => {
  const items = data.preds.map((pred) => {
    const imageUrl = `${address}/${pred.filename}`;
    const predictionAnnotations = pred.dt.points;
    const labelAnnotations = pred.gt.points;

    return (
      <Card
        key={pred.filename}
        style={{
          height: '150px',
          overflow: 'hidden',
          paddingBottom: '10px', // 保留底部10px的padding
        }}
        bodyStyle={{
          padding: '0', // 确保没有额外的内边距
          height: 150,
        }}
        size="small"
      >
        <LazyImageWithMergedAnnotations
          imageUrl={imageUrl}
          annotations1={predictionAnnotations}
          annotations2={labelAnnotations}
        />
      </Card>
    );
  });

  return (
    <div style={style}>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        dataSource={items}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </div>
  );
};

export default PredCards;
