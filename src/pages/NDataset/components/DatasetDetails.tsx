/* eslint-disable */
import { CheckOutlined, Loading3QuartersOutlined } from '@ant-design/icons'; // 引入 Ant Design 的圖標
import { FormattedMessage } from '@umijs/max'; // 引入 FormattedMessage 用於多語言支持
import { Badge, Button, Col, Descriptions, Modal, Row, Tag, Tooltip, Typography } from 'antd'; // 引入 Ant Design 的組件
import moment from 'moment'; // 引入 moment 來處理日期格式化
import React, { useEffect, useState } from 'react'; // 首先引入 React 和相關 Hook

import {
  checkVisDatasetDirExist,
  getVisDatasetStatus,
  visDataset,
} from '@/services/ant-design-pro/dataset'; // 引入服務函數
import { getColor } from '@/utils/tools'; // 引入工具函數
import { DatasetFormatItem, DatasetItem, DatasetStatisticsItem } from '..'; // 引入專案內部的類型
import DisplayImage from './DisplayImage'; // 引入內部組件 DisplayImage
import HorizontalBarChart from './HorizontalBarCharts'; // 引入內部組件 HorizontalBarChart
import LabelPieCharts from './LabelPieCharts'; // 引入內部組件 LabelPieCharts

// 定義 DatasetDetailsProps 的接口，描述組件的 props 結構
interface DatasetDetailsProps {
  dataset: DatasetItem | undefined; // 數據集信息，可為未定義
}

// 異步函數：獲取已視覺化的文件
const fetchVisualizedFiles = async (
  datasetId: string,
  setVisualizedFiles: (d: string[]) => void,
) => {
  const resp = await checkVisDatasetDirExist(datasetId);
  const visualizedFiles = resp.results.files;
  setVisualizedFiles(visualizedFiles);
};

// 處理視覺化數據集的圖片顯示
const handleDisplayVisDatasetChildren = (
  dataset: DatasetItem,
  visualizedFiles: string[],
  handleDisplayImage: (imageLink: string, title: string) => void,
) => {
  const imageList = (imageFile: string, i: number) => {
    const userId = dataset.user_id;
    if (visualizedFiles.includes(imageFile)) {
      const link = `http://localhost:8000/static/dataset_visualization/${userId}/${dataset.save_key}/${imageFile}`;
      return (
        <Badge
          key={`${i}-${imageFile}`}
          status="success"
          text={<a onClick={() => handleDisplayImage(link, imageFile)}>{imageFile}</a>}
        />
      );
    }
    return <Badge key={`${i}-${imageFile}`} status="default" text={imageFile} />;
  };

  // 返回一個左對齊且可換行的彈性容器
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'flex-start' }}>
      {dataset.image_files.map((imageFile, i) => (
        <Tooltip key={imageFile} title={imageFile}>
          <div
            style={{
              maxWidth: '200px',
              flexBasis: '200px',
              flexGrow: 0,
              whiteSpace: 'nowrap', // 防止文本换行
              overflow: 'hidden', // 超出部分隐藏
              textOverflow: 'ellipsis', // 使用省略号显示被隐藏的部分
            }}
          >
            {imageList(imageFile, i)}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

// 處理顯示視覺化數據集標籤
const handleDisplayVisDatasetLabel = (
  datasetId: string,
  imageFiles: string[],
  visualizedFiles: string[],
  handleVisDataset: (datasetId: string) => void,
  visDatasetLoading: boolean,
) => {
  if (!visualizedFiles.length) {
    return (
      <Button
        size="small"
        style={{ marginLeft: 15 }}
        loading={visDatasetLoading}
        onClick={() => handleVisDataset(datasetId)}
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

// 獲取數據集詳細信息
const getDatasetDetails = (
  dataset: DatasetItem,
  visualizedFiles: string[],
  handleDisplayImage: (imageLink: string, title: string) => void,
  handleVisDataset: (datasetId: string) => void,
  taskProgress: string,
  visDatasetLoading: boolean,
) => {
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
      label: <FormattedMessage id="pages.dataset.display.classNames" defaultMessage="類別" />,
      children: (
        <>
          {dataset.class_names.map((className: string, i: number) => (
            <Tag color={getColor(i)} key={`${i}-${className}`}>
              {className}
            </Tag>
          ))}
        </>
      ),
    },
    {
      key: 6,
      label: (
        <>
          <FormattedMessage id="pages.dataset.display.imageList" defaultMessage="圖片列表" />
          {handleDisplayVisDatasetLabel(
            dataset._id,
            dataset.image_files,
            visualizedFiles,
            handleVisDataset,
            visDatasetLoading,
          )}
        </>
      ),
      children: handleDisplayVisDatasetChildren(dataset, visualizedFiles, handleDisplayImage),
      span: 5,
    },
    {
      key: 7,
      label: <FormattedMessage id="pages.dataset.display.labelFile" defaultMessage="標注文件" />,
      children: <p>{dataset.label_file}</p>,
    },
    {
      key: 8,
      label: <FormattedMessage id="pages.dataset.display.detectTypes" defaultMessage="檢測類型" />,
      children: <Tag>{dataset.detect_type.tag_name.toUpperCase()}</Tag>,
    },
  ];
  return items;
};

// 獲取數據集統計信息詳細信息
const getDatasetStatisticsDetails = (datasetStatistics: DatasetStatisticsItem | undefined) => {
  const items = [
    {
      key: 1,
      label: '標注統計',
      children: (
        <Row gutter={12}>
          <Col span={12}>
            <LabelPieCharts data={datasetStatistics?.category_counts} />
          </Col>
          <Col span={12}>
            <HorizontalBarChart
              totalImages={datasetStatistics?.total_images}
              labeledInstances={datasetStatistics?.total_instances}
            />
          </Col>
        </Row>
      ),
    },
  ];
  return items;
};

// 主 DatasetDetails 組件
const DatasetDetails: React.FC<DatasetDetailsProps> = ({ dataset }) => {
  const [visualizedFiles, setVisualizedFiles] = useState<string[]>([]); // 已視覺化的文件
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false); // 圖片模態框開啟狀態
  const [imageModalTitle, setImageModalTitle] = useState<string>(''); // 圖片模態框標題
  const [selectedImage, setSelectedImage] = useState<string>(''); // 選中的圖片
  const [visDatasetLoading, setVisDatasetLoading] = useState<boolean>(false); // 視覺化加載狀態
  const [taskProgress, setTaskProgress] = useState<string>(''); // 任務進度

  if (!dataset) return null;

  const handleDisplayImage = (imageLink: string, title: string) => {
    setImageModalTitle(title);
    setSelectedImage(imageLink);
    setImageModalOpen(true);
  };

  const handleVisDataset = async (datasetId: string) => {
    console.log('Starting visualization task...');
    setVisDatasetLoading(true);
    const resp = await visDataset(datasetId);
    const taskId = resp.results;

    const fetchTaskProgress = async () => {
      const progressRes = await getVisDatasetStatus(taskId);
      console.log('Task progress:', progressRes);
      setTaskProgress(progressRes.results);
      if (progressRes.results === 'SUCCESS' || progressRes.results === 'FAILURE') {
        clearInterval(intervalId);
        setVisDatasetLoading(false);
        console.log('Task completed');
        fetchVisualizedFiles(datasetId, setVisualizedFiles); // 刷新視覺化文件列表
      } else {
        fetchVisualizedFiles(datasetId, setVisualizedFiles);
        console.log('Task still in progress');
      }
    };

    const intervalId = setInterval(fetchTaskProgress, 2000);
  };

  useEffect(() => {
    fetchVisualizedFiles(dataset._id, setVisualizedFiles);
  }, [dataset._id]);

  return (
    <>
      <Typography.Text strong>{dataset.name}</Typography.Text>
      <Descriptions
        layout="vertical"
        bordered
        column={2}
        items={getDatasetStatisticsDetails(dataset.statistics)}
        style={{
          marginTop: 15,
        }}
      />

      <Descriptions
        layout="vertical"
        bordered
        column={5}
        items={getDatasetDetails(
          dataset,
          visualizedFiles,
          handleDisplayImage,
          handleVisDataset,
          taskProgress,
          visDatasetLoading,
        )}
        style={{
          marginTop: 15,
        }}
      />
      <Modal
        style={{ minWidth: 600 }}
        title={imageModalTitle}
        footer={null}
        onCancel={() => {
          setImageModalOpen(false);
          setImageModalTitle('');
        }}
        open={imageModalOpen}
      >
        <DisplayImage imageSrc={selectedImage} />
      </Modal>
    </>
  );
};

export default DatasetDetails;
