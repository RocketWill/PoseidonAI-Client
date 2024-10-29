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
import { DatasetItem, DatasetStatisticsItem } from '..'; // 引入專案內部的類型
import DisplayImage from './DisplayImage'; // 引入內部組件 DisplayImage
import HorizontalBarChart from './HorizontalBarCharts'; // 引入內部組件 HorizontalBarChart
import LabelPieCharts from './LabelPieCharts'; // 引入內部組件 LabelPieCharts

import { LogActionDataset } from '@/utils/LogActions'; // 引入日志操作
import { LogLevel } from '@/utils/LogLevels'; // 引入日志级别
import { useUserActionLogger } from '@/utils/UserActionLoggerContext'; // 引入日志钩子

// 定义 DatasetDetailsProps 的接口，描述组件的 props 结构
interface DatasetDetailsProps {
  dataset: DatasetItem | undefined; // 数据集信息，可为未定义
}

// 异步函数：获取已视觉化的文件
const fetchVisualizedFiles = async (
  datasetId: string,
  setVisualizedFiles: (d: string[]) => void,
  logAction: (level: LogLevel, action: LogActionDataset, details?: Record<string, any>) => void,
) => {
  try {
    const resp = await checkVisDatasetDirExist(datasetId);
    const visualizedFiles = resp.results.files;
    setVisualizedFiles(visualizedFiles);
    logAction(LogLevel.INFO, LogActionDataset.DATASET_FETCH_VISUALIZED_FILES, {
      datasetId,
      visualizedFiles,
    });
  } catch (error: any) {
    logAction(LogLevel.ERROR, LogActionDataset.DATASET_FETCH_VISUALIZED_FILES_FAILURE, {
      datasetId,
      error: error.message || 'Unknown error',
    });
    console.error('Error fetching visualized files:', error);
  }
};

// 处理视觉化数据集的图片显示
const handleDisplayVisDatasetChildren = (
  dataset: DatasetItem,
  visualizedFiles: string[],
  handleDisplayImage: (imageLink: string, title: string) => void,
  logAction: (level: LogLevel, action: LogActionDataset, details?: Record<string, any>) => void,
) => {
  const imageList = (imageFile: string, i: number) => {
    const userId = dataset.user_id;
    if (visualizedFiles.includes(imageFile)) {
      const link = `http://localhost:8000/static/dataset_visualization/${userId}/${dataset.save_key}/${imageFile}`;
      return (
        <Badge
          key={`${i}-${imageFile}`}
          status="success"
          text={
            <a
              onClick={() => {
                handleDisplayImage(link, imageFile);
                logAction(LogLevel.DEBUG, LogActionDataset.DATASET_DISPLAY_IMAGE, {
                  datasetId: dataset._id,
                  imageFile,
                });
              }}
            >
              {imageFile}
            </a>
          }
        />
      );
    }
    return <Badge key={`${i}-${imageFile}`} status="default" text={imageFile} />;
  };

  // 返回一个左对齐且可换行的弹性容器
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

// 处理显示视觉化数据集标签
const handleDisplayVisDatasetLabel = (
  datasetId: string,
  imageFiles: string[],
  visualizedFiles: string[],
  handleVisDataset: (datasetId: string) => void,
  visDatasetLoading: boolean,
  logAction: (level: LogLevel, action: LogActionDataset, details?: Record<string, any>) => void,
) => {
  if (!visualizedFiles.length) {
    return (
      <Button
        size="small"
        style={{ marginLeft: 15 }}
        loading={visDatasetLoading}
        onClick={() => {
          handleVisDataset(datasetId);
          logAction(LogLevel.INFO, LogActionDataset.DATASET_START_VISUALIZATION, { datasetId });
        }}
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

// 获取数据集详细信息
const getDatasetDetails = (
  dataset: DatasetItem,
  visualizedFiles: string[],
  handleDisplayImage: (imageLink: string, title: string) => void,
  handleVisDataset: (datasetId: string) => void,
  taskProgress: string,
  visDatasetLoading: boolean,
  showAllClasses: boolean,
  setShowAllClasses: (b: boolean) => void,
  logAction: (level: LogLevel, action: LogActionDataset, details?: Record<string, any>) => void,
) => {
  const items = [
    {
      key: 1,
      label: <FormattedMessage id="pages.dataset.display.createdAt" defaultMessage="創建日期" />,
      children: moment(dataset.created_at).format('YYYY-MM-DD HH:mm'),
    },
    {
      key: 2,
      label: <FormattedMessage id="pages.dataset.display.description" defaultMessage="描述" />,
      children: dataset.description,
    },
    {
      key: 3,
      label: (
        <FormattedMessage id="pages.dataset.display.validImages" defaultMessage="帶標注圖片數量" />
      ),
      children: dataset.valid_images_num,
    },
    {
      key: 4,
      label: <FormattedMessage id="pages.dataset.display.classNames" defaultMessage="類別" />,
      children: (
        <>
          {dataset.class_names
            .slice(0, showAllClasses ? dataset.class_names.length : 5) // 根据状态显示5个或全部
            .map((className: string, i: number) => (
              <Tag color="blue" key={`${i}-${className}`}>
                {className}
              </Tag>
            ))}
          {dataset.class_names.length > 5 && (
            <Tag
              onClick={() => {
                setShowAllClasses(!showAllClasses);
              }}
            >
              <a>{showAllClasses ? 'Show less' : `+${dataset.class_names.length - 5}`}</a>
            </Tag>
          )}
        </>
      ),
    },
    {
      key: 5,
      label: (
        <>
          <FormattedMessage id="pages.dataset.display.imageList" defaultMessage="圖片列表" />
          {handleDisplayVisDatasetLabel(
            dataset._id,
            dataset.image_files,
            visualizedFiles,
            handleVisDataset,
            visDatasetLoading,
            logAction, // 传递 logAction
          )}
        </>
      ),
      children: handleDisplayVisDatasetChildren(
        dataset,
        visualizedFiles,
        handleDisplayImage,
        logAction,
      ),
      span: 12,
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

// 获取数据集统计信息详细信息
const getDatasetStatisticsDetails = (
  datasetStatistics: DatasetStatisticsItem | undefined,
  logAction: (level: LogLevel, action: LogActionDataset, details?: Record<string, any>) => void,
) => {
  const items = [
    {
      key: 1,
      label: (
        <FormattedMessage
          id="pages.dataset.display.annotatedDataStatistics"
          defaultMessage="標注資料統計"
        />
      ),
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

// 定义 DatasetDetails 组件
const DatasetDetails: React.FC<DatasetDetailsProps> = ({ dataset }) => {
  const [visualizedFiles, setVisualizedFiles] = useState<string[]>([]); // 已视觉化的文件
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false); // 图片模态框开启状态
  const [imageModalTitle, setImageModalTitle] = useState<string>(''); // 图片模态框标题
  const [selectedImage, setSelectedImage] = useState<string>(''); // 选中的图片
  const [visDatasetLoading, setVisDatasetLoading] = useState<boolean>(false); // 视觉化加载状态
  const [taskProgress, setTaskProgress] = useState<string>(''); // 任务进度
  const [showAllClasses, setShowAllClasses] = useState<boolean>(false); // 控制类别显示的状态

  const { logAction } = useUserActionLogger(); // 获取日志记录函数

  if (!dataset) return null;

  // 处理显示图片
  const handleDisplayImage = (imageLink: string, title: string) => {
    setImageModalTitle(title);
    setSelectedImage(imageLink);
    setImageModalOpen(true);
    logAction(LogLevel.DEBUG, LogActionDataset.DATASET_DISPLAY_IMAGE, {
      datasetId: dataset._id,
      imageLink,
      title,
    });
  };

  // 处理视觉化任务
  const handleVisDataset = async (datasetId: string) => {
    console.log('Starting visualization task...');
    logAction(LogLevel.INFO, LogActionDataset.DATASET_START_VISUALIZATION, { datasetId });
    setVisDatasetLoading(true);
    try {
      const resp = await visDataset(datasetId);
      const taskId = resp.results;

      const fetchTaskProgress = async () => {
        try {
          const progressRes = await getVisDatasetStatus(taskId);
          console.log('Task progress:', progressRes);
          setTaskProgress(progressRes.results);
          logAction(LogLevel.DEBUG, LogActionDataset.DATASET_VISUALIZATION_PROGRESS, {
            datasetId,
            taskId,
            progress: progressRes.results,
          });
          if (progressRes.results === 'SUCCESS') {
            clearInterval(intervalId);
            setVisDatasetLoading(false);
            logAction(LogLevel.INFO, LogActionDataset.DATASET_VISUALIZATION_SUCCESS, {
              datasetId,
              taskId,
            });
            fetchVisualizedFiles(datasetId, setVisualizedFiles, logAction); // 刷新视觉化文件列表
          } else if (progressRes.results === 'FAILURE') {
            clearInterval(intervalId);
            setVisDatasetLoading(false);
            logAction(LogLevel.ERROR, LogActionDataset.DATASET_VISUALIZATION_FAILURE, {
              datasetId,
              taskId,
              error: 'Visualization task failed',
            });
          } else {
            fetchVisualizedFiles(datasetId, setVisualizedFiles, logAction);
            console.log('Task still in progress');
          }
        } catch (error: any) {
          clearInterval(intervalId);
          setVisDatasetLoading(false);
          logAction(LogLevel.ERROR, LogActionDataset.DATASET_VISUALIZATION_FAILURE, {
            datasetId,
            taskId,
            error: error.message || 'Unknown error',
          });
          console.error('Error fetching task progress:', error);
        }
      };

      const intervalId = setInterval(fetchTaskProgress, 2000);
    } catch (error: any) {
      setVisDatasetLoading(false);
      logAction(LogLevel.ERROR, LogActionDataset.DATASET_VISUALIZATION_FAILURE, {
        datasetId,
        error: error.message || 'Unknown error',
      });
      console.error('Error starting visualization task:', error);
    }
  };

  useEffect(() => {
    fetchVisualizedFiles(dataset._id, setVisualizedFiles, logAction);
  }, [dataset._id]);

  return (
    <>
      <Typography.Text strong>{dataset.name}</Typography.Text>
      <Descriptions
        layout="vertical"
        bordered
        column={2}
        items={getDatasetStatisticsDetails(dataset.statistics, logAction)}
        style={{
          marginTop: 15,
        }}
      />

      <Descriptions
        layout="vertical"
        bordered
        column={3}
        items={getDatasetDetails(
          dataset,
          visualizedFiles,
          handleDisplayImage,
          handleVisDataset,
          taskProgress,
          visDatasetLoading,
          showAllClasses,
          setShowAllClasses,
          logAction, // 传递 logAction
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
