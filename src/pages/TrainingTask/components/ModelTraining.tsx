import {
  getTrainingStatus,
  startTraining,
  stopTraining,
} from '@/services/ant-design-pro/trainingTask';
import { CaretRightOutlined, StopOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Skeleton, Space, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useRef, useState } from 'react';
import { TaskItem, TrainingStatus } from '..';
import TaskDetailsDescription from './TaskDetailsDescription';

// 定義組件的屬性類型
interface ModelTrainingProps {
  taskData: TaskItem | undefined;
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

// 定義損失數據的類型
interface LossDataItem {
  epoch?: number[];
  iteration?: number[];
  train_loss: number[];
  val_loss: number[];
}

// 訓練損失圖表組件
const TrainLossChart: React.FC<{ data: LossDataItem }> = ({ data }) => {
  const xAxisData = data.epoch || data.iteration || [];
  const totalXPoints = xAxisData.length;

  if (totalXPoints < 1) return <Skeleton active />;

  const end = 100;
  const start = totalXPoints > 50 ? ((totalXPoints - 50) / totalXPoints) * 100 : 0;

  const option = {
    title: {
      text: 'Training Loss',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      name: data.epoch ? 'Epoch' : 'Iteration',
    },
    yAxis: {
      type: 'value',
      name: 'Train Loss',
      axisLine: {
        lineStyle: {
          color: '#5B8FF9',
        },
      },
    },
    series: [
      {
        name: 'Train Loss',
        type: 'line',
        data: data.train_loss,
        lineStyle: {
          width: 2,
          color: '#5B8FF9',
        },
      },
    ],
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        start,
        end,
        handleSize: '100%',
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

const ValLossChart: React.FC<{ data: LossDataItem }> = ({ data }) => {
  const xAxisData = data.epoch || data.iteration || [];
  const totalXPoints = xAxisData.length;

  if (totalXPoints < 1) return <Skeleton active />;

  const end = 100;
  const start = totalXPoints > 50 ? ((totalXPoints - 50) / totalXPoints) * 100 : 0;

  const option = {
    title: {
      text: 'Validation Loss',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      name: data.epoch ? 'Epoch' : 'Iteration',
    },
    yAxis: {
      type: 'value',
      name: 'Validation Loss',
      axisLine: {
        lineStyle: {
          color: '#5AD8A6',
        },
      },
    },
    series: [
      {
        name: 'Validation Loss',
        type: 'line',
        data: data.val_loss,
        lineStyle: {
          width: 2,
          color: '#5AD8A6',
        },
      },
    ],
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        start,
        end,
        handleSize: '100%',
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

const ModelTraining: React.FC<ModelTrainingProps> = ({ taskData, setRefreshFlag }) => {
  const [lossData, setLossData] = useState<LossDataItem | null>(null); // 訓練和驗證損失數據
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>('IDLE'); // 訓練狀態
  const [isTraining, setIsTraining] = useState<boolean>(false); // 訓練進行中標記
  const [restartBtnLoading, setRestartBtnLoading] = useState<boolean>(false); // 重啟按鈕加載狀態
  const [startBtnLoading, setStartBtnLoading] = useState<boolean>(false); // 開始按鈕加載狀態
  const [stopBtnLoading, setStopBtnLoading] = useState<boolean>(false); // 停止按鈕加載狀態
  const intervalId = useRef<NodeJS.Timeout | null>(null); // 用於儲存定時器 ID
  const _id = taskData?.task_detail._id;

  // 開始獲取訓練進度
  const startFetchingProgress = (
    taskId: string,
    algoName: string,
    frameworkName: string,
    saveKey: string,
  ) => {
    const fetchTaskProgress = async () => {
      try {
        const progressRes = await getTrainingStatus(taskId, algoName, frameworkName, saveKey);
        const state = progressRes.results.state;
        setTrainingStatus(state);
        if (state === 'FAILURE') {
          message.error(
            '訓練遇到狀況，建議重新整理頁面後再嘗試。' + progressRes.results.data.error_detail,
          );
          setIsTraining(false); // 訓練失敗時停止訓練
        }
        if (state === 'SUCCESS') {
          message.success('訓練完成');
          setIsTraining(false); // 訓練成功時停止訓練
        }
        if (state === 'SUCCESS' || state === 'FAILURE' || state === 'REVOKED') {
          setRefreshFlag((prev) => !prev); // 刷新頁面（更新狀態Tag）
          if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
            setIsTraining(false); // 訓練終止時停止訓練
          }
        } else {
          if (progressRes.results && progressRes.results.data && progressRes.results.data.results) {
            setLossData(progressRes.results.data.results);
          }
        }
      } catch (error) {
        console.error(error);
        setIsTraining(false); // 捕獲到錯誤時停止訓練
      }
    };

    intervalId.current = setInterval(fetchTaskProgress, 2000);
  };

  // 處理開始訓練
  const handleStartTraining = async (isRestart: boolean = false) => {
    if (!taskData) return;

    // 設置按鈕加載狀態
    if (isRestart) {
      setRestartBtnLoading(true);
    } else {
      setStartBtnLoading(true);
    }

    const algoName = taskData?.task_detail?.algorithm.name.replace(/\s+/g, '');
    const frameworkName = taskData?.task_detail?.algorithm.training_framework.name;
    const saveKey = taskData?.task_detail?.save_key;

    try {
      setIsTraining(true); // 開始訓練時設置狀態
      const resp = await startTraining(taskData.task_detail._id);
      if (resp['code'] === 200) {
        // const taskId = resp['results'];
        if (_id) startFetchingProgress(_id, algoName, frameworkName, saveKey);
      } else {
        setIsTraining(false); // 訓練未能啟動時停止訓練
      }
    } catch (error) {
      console.error(error);
      setIsTraining(false); // 捕獲到錯誤時停止訓練
    } finally {
      // 延遲重置按鈕加載狀態
      setTimeout(() => {
        if (isRestart) {
          setRestartBtnLoading(false);
        } else {
          setStartBtnLoading(false);
        }
      }, 3000); // 3秒的延遲
    }
  };

  // 初始化時根據任務狀態設置訓練進度
  useEffect(() => {
    setTrainingStatus(taskData?.task_detail.status as TrainingStatus);
    if (taskData?.task_state?.data?.results) {
      setLossData(taskData.task_state.data.results);
      if (taskData.task_state.state === 'PROCESSING') {
        const algoName = taskData?.task_detail.algorithm.name.replace(/\s+/g, '');
        const frameworkName = taskData?.task_detail.algorithm.training_framework.name;
        const saveKey = taskData?.task_detail.save_key;
        startFetchingProgress(taskData.task_detail._id, algoName, frameworkName, saveKey);
      }
    }
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [taskData]);

  // 訓練狀態改變時刷新頁面
  useEffect(() => {
    if (!isTraining) {
      setRefreshFlag((prev) => !prev);
    }
  }, [isTraining]);

  const handleDisableRestart = () =>
    !(
      trainingStatus === 'ERROR' ||
      trainingStatus === 'FAILURE' ||
      trainingStatus === 'SUCCESS' ||
      trainingStatus === 'REVOKED'
    );

  const handleDisableStart = () => !(trainingStatus === 'IDLE');

  const handleDisableStop = () => !(trainingStatus === 'PROCESSING');

  // 處理停止訓練
  const handleStopTraining = async () => {
    if (!taskData) return;

    setStopBtnLoading(true); // 開始操作時設置加載狀態

    const algoName = taskData?.task_detail.algorithm.name.replace(/\s+/g, '');
    const frameworkName = taskData?.task_detail.algorithm.training_framework.name;

    try {
      const resp = await stopTraining(taskData.task_detail._id, algoName, frameworkName);
      if (resp['code'] === 200) {
        setTimeout(() => {
          message.success(resp['msg']);
          setIsTraining(false);
        }, 3000); // 3秒的延遲
      }
    } catch (err) {
      message.error('遇到錯誤，' + err);
      setIsTraining(false); // 捕獲到錯誤時停止訓練
    } finally {
      setTimeout(() => {
        setStopBtnLoading(false); // 操作完成後重置加載狀態
      }, 5000); // 5秒的延遲
    }
  };

  return (
    <>
      <TaskDetailsDescription
        taskData={taskData}
        status={isTraining ? trainingStatus : undefined}
      />
      <Space style={{ marginTop: 15, marginBottom: 15 }}>
        <Button
          loading={restartBtnLoading}
          size="large"
          icon={<UndoOutlined />}
          onClick={() => handleStartTraining(true)} // 傳遞 true 表示這是 restart 操作
          shape="round"
          disabled={handleDisableRestart()}
        >
          Restart
        </Button>
        <Button
          loading={startBtnLoading}
          type="primary"
          size="large"
          icon={<CaretRightOutlined />}
          onClick={() => handleStartTraining(false)} // 傳遞 false 表示這是 start 操作
          shape="round"
          disabled={handleDisableStart()}
        >
          Start
        </Button>
        <Button
          loading={stopBtnLoading}
          danger
          size="large"
          icon={<StopOutlined />}
          shape="round"
          disabled={handleDisableStop()}
          onClick={handleStopTraining}
        >
          Stop
        </Button>
      </Space>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          {lossData &&
            trainingStatus !== 'FAILURE' &&
            trainingStatus !== 'REVOKED' &&
            trainingStatus !== 'ERROR' && (
              <Card>
                <TrainLossChart data={lossData} />
              </Card>
            )}
        </Col>
        <Col xs={24} md={12}>
          {lossData &&
            trainingStatus !== 'FAILURE' &&
            trainingStatus !== 'REVOKED' &&
            trainingStatus !== 'ERROR' && (
              <Card>
                <ValLossChart data={lossData} />
              </Card>
            )}
        </Col>
      </Row>
    </>
  );
};

export default ModelTraining;
