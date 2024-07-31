/* eslint-disable */
/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-31 15:41:18
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-07-31 20:46:32
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/DatasetDetails.tsx
 */

import { checkVisDatasetDirExist } from '@/services/ant-design-pro/dataset';
import { CheckOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import { Badge, Button, Descriptions, Space, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DatasetFormatItem, DatasetItem } from '..';

interface DatasetDetailsProps {
  dataset: DatasetItem | undefined;
}

const fetchVisualizedFiles = async (
  datasetId: string,
  setVisualizedFiles: (d: string[]) => void,
) => {
  const resp = await checkVisDatasetDirExist(datasetId);
  const visualizedFiles = resp.results.files;
  setVisualizedFiles(visualizedFiles);
};

const handleDisplayVisDatasetChildren = (dataset: DatasetItem, visualizedFiles: string[]) => {
  const imageList = (imageFile: string, i: number) => {
    const userId = dataset.user_id;
    if (visualizedFiles.includes(imageFile)) {
      const link = `http://localhost:8000/static/dataset_visualization/${userId}/${dataset.save_key}/${imageFile}`;
      return (
        <Badge
          key={`${i}-${imageFile}`}
          status="success"
          text={<a>{imageFile}</a>}
          // onClick={() => handleDisplayImage(link, imageFile)}
        />
      );
    }
    return <Badge key={`${i}-${imageFile}`} status="default" text={imageFile} />;
  };

  return (
    <Space direction="vertical">
      {dataset.image_files.map((imageFile: string, i: number) => imageList(imageFile, i))}
    </Space>
  );
};

const handleDisplayVisDatasetLabel = (
  datasetId: string,
  imageFiles: string[],
  visualizedFiles: string[],
) => {
  if (!visualizedFiles.length) {
    return (
      <Button
        size="small"
        style={{ marginLeft: 15 }}
        // loading={visDatasetLoading}
        // onClick={() => handleVisDataset(datasetId)}
      >
        <FormattedMessage
          id="pages.dataset.display.visualizeAnnotations"
          defaultMessage="視覺化標注"
        />
      </Button>
    );
  } else if (imageFiles.length !== visualizedFiles.length) {
    return (
      <Tag color="orange" style={{ marginLeft: 15 }}>
        <Loading3QuartersOutlined />
        <span />
        <FormattedMessage id="pages.dataset.display.visualized" defaultMessage="部分已視覺化" />
      </Tag>
    );
  } else {
    return (
      <Tag color="green" style={{ marginLeft: 15 }}>
        <CheckOutlined />
        <span />
        <FormattedMessage id="pages.dataset.display.visualized" defaultMessage="視覺化" />
      </Tag>
    );
  }
};

const getDatasetDetails = (dataset: DatasetItem, visualizedFiles: string[]) => {
  const items = [
    {
      key: 1,
      label: <FormattedMessage id="pages.dataset.display.createdAt" defaultMessage="創建日期" />,
      children: moment(dataset.created_at).format('YYYY-MM-DD HH:mm'),
    },
    {
      key: 2,
      label: (
        <FormattedMessage id="pages.dataset.display.datasetFormat" defaultMessage="資料格式" />
      ),
      children: (
        <>
          {dataset.dataset_format.map((format: DatasetFormatItem, i: number) => (
            <Tag key={`${i}-${format}`}>{format.name.toUpperCase()}</Tag>
          ))}
        </>
      ),
    },
    {
      key: 3,
      label: <FormattedMessage id="pages.dataset.display.description" defaultMessage="描述" />,
      children: dataset.description,
    },
    {
      key: 4,
      label: (
        <FormattedMessage id="pages.dataset.display.validImages" defaultMessage="帶標注圖片數量" />
      ),
      children: dataset.valid_images_num,
    },
    {
      key: 5,
      span: { xs: 1, sm: 1, md: 1, lg: 1, xl: 2, xxl: 2 },
      label: (
        <>
          <FormattedMessage id="pages.dataset.display.imageList" defaultMessage="圖片列表" />
          {handleDisplayVisDatasetLabel(dataset._id, dataset.image_files, visualizedFiles)}
        </>
      ),
      children: handleDisplayVisDatasetChildren(dataset, visualizedFiles),
    },
    {
      key: 6,
      label: <FormattedMessage id="pages.dataset.display.labelFile" defaultMessage="標注文件" />,
      children: <p>{dataset.label_file}</p>,
    },
    {
      key: 7,
      label: <FormattedMessage id="pages.dataset.display.detectTypes" defaultMessage="檢測類型" />,
      children: <Tag>{dataset.detect_type.tag_name.toUpperCase()}</Tag>,
    },
  ];
  return items;
};

const DatasetDetails: React.FC<DatasetDetailsProps> = ({ dataset }) => {
  const [visualizedFiles, setVisualizedFiles] = useState<string[]>([]);
  if (!dataset) return;

  useEffect(() => {
    fetchVisualizedFiles(dataset._id, setVisualizedFiles);
  }, []);

  return (
    <Descriptions
      title={dataset.name}
      layout="vertical"
      bordered
      items={getDatasetDetails(dataset, visualizedFiles)}
    />
  );
};

export default DatasetDetails;
