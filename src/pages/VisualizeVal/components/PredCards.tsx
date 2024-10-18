import { Image as AntdImage, Card, List, Spin } from 'antd';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { DetectItem, VisualizationItem } from '..';

interface PredCardsProps {
  data: VisualizationItem;
  address: string;
  style?: CSSProperties;
}

type Annotation = number[]; // [x0, y0, x1, y1, ...] 数组类型

interface ImageWithMergedAnnotationsProps {
  imageUrl: string;
  annotations1: DetectItem;
  annotations2: DetectItem;
  classNames: { id: number; name: string }[];
}

const COLORS = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#FF33A6',
  '#FF8333',
  '#33FFD4',
  '#D433FF',
  '#FFC733',
  '#75FF33',
  '#FF3357',
  '#3375FF',
  '#FF33D4',
  '#33FF75',
  '#D4FF33',
];

const getColorForClass = (clsId: number) => {
  return COLORS[clsId % COLORS.length];
};

const drawClassificationLabel = (
  ctx: CanvasRenderingContext2D,
  classId: number,
  className: string,
  color: string,
  x: number,
  y: number,
) => {
  // 设置字体和测量文本宽度
  ctx.font = '20px Arial';
  const textWidth = ctx.measureText(className).width;
  const textHeight = 24; // 大约的高度，可以根据实际情况调整

  // 绘制黑色背景框
  ctx.fillStyle = 'black';
  ctx.fillRect(x - 5, y - textHeight, textWidth + 10, textHeight);

  // 绘制文本
  ctx.fillStyle = color;
  ctx.fillText(className, x, y - 5);
};

const drawShapeWithLabel = (
  ctx: CanvasRenderingContext2D,
  points: Annotation | null,
  classId: number,
  className: string,
  color: string,
  isClassification: boolean = false,
) => {
  if (isClassification) {
    // 如果是分类任务，直接在左上角显示类别名称
    drawClassificationLabel(ctx, classId, className, color, 10, 30);
    return;
  }

  if (!points || points.length === 0) return;

  // 绘制边框
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

  // 绘制边框颜色
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();

  // 在左上角绘制黑底白字的类名标签
  ctx.fillStyle = 'black';
  ctx.fillRect(points[0], points[1] - 20, ctx.measureText(className).width + 10, 20);

  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(className, points[0] + 5, points[1] - 5);
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

const mergeImagesWithLabels = async (
  imageUrl: string,
  annotations1: DetectItem,
  annotations2: DetectItem,
  classNames: { id: number; name: string }[],
  setMergedImageUrl: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  try {
    const [image1, image2] = await Promise.all([loadImage(imageUrl), loadImage(imageUrl)]);

    const targetWidth = 800;
    const scaleFactor = targetWidth / image1.width;
    const targetHeight = image1.height * scaleFactor;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth * 2;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(image1, 0, 0, targetWidth, targetHeight);

    if (annotations1.points === -1) {
      // 处理分类任务：显示分类标签
      const className = classNames.find((c) => c.id === annotations1.cls)?.name || 'Unknown';
      const color = getColorForClass(annotations1.cls);
      drawShapeWithLabel(ctx, null, annotations1.cls, className, color, true);
    } else {
      // 处理检测任务：显示检测框
      annotations1.points.forEach((points) => {
        const scaledPoints = points.map((coord, index) =>
          index % 2 === 0 ? coord * scaleFactor : coord * scaleFactor,
        );
        const className = classNames.find((c) => c.id === annotations1.cls[0])?.name || 'Unknown';
        const color = getColorForClass(annotations1.cls[0]);
        drawShapeWithLabel(ctx, scaledPoints, annotations1.cls[0], className, color);
      });
    }

    ctx.translate(targetWidth, 0);
    ctx.drawImage(image2, 0, 0, targetWidth, targetHeight);

    if (annotations2.points === -1) {
      const className = classNames.find((c) => c.id === annotations2.cls)?.name || 'Unknown';
      const color = getColorForClass(annotations2.cls);
      drawShapeWithLabel(ctx, null, annotations2.cls, className, color, true);
    } else {
      annotations2.points.forEach((points) => {
        const scaledPoints = points.map((coord, index) =>
          index % 2 === 0 ? coord * scaleFactor : coord * scaleFactor,
        );
        const className = classNames.find((c) => c.id === annotations2.cls[0])?.name || 'Unknown';
        const color = getColorForClass(annotations2.cls[0]);
        drawShapeWithLabel(ctx, scaledPoints, annotations2.cls[0], className, color);
      });
    }

    ctx.translate(-targetWidth, 0);
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
  classNames,
}) => {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    mergeImagesWithLabels(imageUrl, annotations1, annotations2, classNames, setMergedImageUrl);
  }, [imageUrl, annotations1, annotations2, classNames]);

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
    const predictionAnnotations = pred.dt;
    const labelAnnotations = pred.gt;

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
          classNames={data.class_names}
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
