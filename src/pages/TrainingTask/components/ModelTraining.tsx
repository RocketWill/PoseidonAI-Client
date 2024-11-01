import { CaretRightOutlined, StopOutlined, UndoOutlined } from '@ant-design/icons';
import { Affix, Button, Card, Col, Collapse, Row, Skeleton, Space, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useRef, useState } from 'react';

import {
  getTrainingStatus,
  startTraining,
  stopTraining,
} from '@/services/ant-design-pro/trainingTask';
import { LogActionTrainingTask } from '@/utils/LogActions';
import { LogLevel } from '@/utils/LogLevels';
import { useUserActionLogger } from '@/utils/UserActionLoggerContext';
import { FormattedMessage, useIntl } from '@umijs/max';
import { TaskItem, TrainingStatus } from '..';
import DatasetSummary from './DatasetSummary';
import TaskDetailsDescription from './TaskDetailsDescription';

interface ModelTrainingProps {
  taskData: TaskItem | undefined;
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ActionButtonsProps {
  buttonFixTop: boolean | undefined;
}

interface LossDataItem {
  epoch?: number[];
  iteration?: number[];
  train_loss: number[];
  val_loss: number[];
}

const TrainLossChart: React.FC<{ data: LossDataItem }> = ({ data }) => {
  const intl = useIntl();
  const xAxisData = data.epoch || data.iteration || [];
  const totalXPoints = xAxisData.length;

  if (totalXPoints < 1) return <Skeleton active />;

  const end = 100;
  const start = totalXPoints > 50 ? ((totalXPoints - 50) / totalXPoints) * 100 : 0;

  const option = {
    title: {
      text: intl.formatMessage({ id: 'pages.trainingTask.trainLoss', defaultMessage: '訓練損失' }),
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      name: data.epoch
        ? intl.formatMessage({ id: 'pages.trainingTask.epoch', defaultMessage: '迭代' })
        : intl.formatMessage({ id: 'pages.trainingTask.iteration', defaultMessage: '次數' }),
    },
    yAxis: {
      type: 'value',
      name: intl.formatMessage({ id: 'pages.trainingTask.trainLoss', defaultMessage: '訓練損失' }),
      axisLine: {
        lineStyle: {
          color: '#5B8FF9',
        },
      },
    },
    series: [
      {
        name: intl.formatMessage({
          id: 'pages.trainingTask.trainLoss',
          defaultMessage: '訓練損失',
        }),
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
      {
        type: 'inside',
        yAxisIndex: 0,
        zoomOnMouseWheel: true,
        moveOnMouseWheel: true,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

const ValLossChart: React.FC<{ data: LossDataItem }> = ({ data }) => {
  const intl = useIntl();
  const xAxisData = data.epoch || data.iteration || [];
  const totalXPoints = xAxisData.length;

  if (totalXPoints < 1) return <Skeleton active />;

  const end = 100;
  const start = totalXPoints > 50 ? ((totalXPoints - 50) / totalXPoints) * 100 : 0;

  const option = {
    title: {
      text: intl.formatMessage({
        id: 'pages.trainingTask.valLoss',
        defaultMessage: '驗證損失',
      }),
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      name: data.epoch
        ? intl.formatMessage({ id: 'pages.trainingTask.epoch', defaultMessage: '迭代' })
        : intl.formatMessage({ id: 'pages.trainingTask.iteration', defaultMessage: '次數' }),
    },
    yAxis: {
      type: 'value',
      name: intl.formatMessage({ id: 'pages.trainingTask.valLoss', defaultMessage: '驗證損失' }),
      axisLine: {
        lineStyle: {
          color: '#5AD8A6',
        },
      },
    },
    series: [
      {
        name: intl.formatMessage({
          id: 'pages.trainingTask.valLoss',
          defaultMessage: '驗證損失',
        }),
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
      {
        type: 'inside',
        yAxisIndex: 0,
        zoomOnMouseWheel: true,
        moveOnMouseWheel: true,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

const ModelTraining: React.FC<ModelTrainingProps> = ({ taskData, setRefreshFlag }) => {
  const intl = useIntl();
  const [lossData, setLossData] = useState<LossDataItem | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>('IDLE');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [restartBtnLoading, setRestartBtnLoading] = useState<boolean>(false);
  const [startBtnLoading, setStartBtnLoading] = useState<boolean>(false);
  const [stopBtnLoading, setStopBtnLoading] = useState<boolean>(false);
  const [buttonFixTop, setButtonFixTop] = useState<boolean | undefined>(false);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const _id = taskData?.task_detail._id;

  const logger = useUserActionLogger();

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

        logger.logAction(
          LogLevel.DEBUG,
          LogActionTrainingTask.MODEL_TRAINING_PROGRESS_FETCH,
          `Fetching training progress for Task ${taskId}, Status: ${state}`,
        );

        if (state === 'FAILURE') {
          message.error(
            intl.formatMessage({
              id: 'pages.trainingTask.errorTraining',
              defaultMessage: '訓練遇到錯誤，請稍後重試。',
            }) + progressRes.results.data.error_detail,
          );
          setIsTraining(false);
          logger.logAction(
            LogLevel.ERROR,
            LogActionTrainingTask.TASKLIST_DELETE_FAILURE,
            `Training failed for Task ${taskId}`,
          );
        }
        if (state === 'SUCCESS') {
          message.success(
            intl.formatMessage({
              id: 'pages.trainingTask.successTraining',
              defaultMessage: '訓練完成',
            }),
          );
          setIsTraining(false);
          logger.logAction(
            LogLevel.INFO,
            LogActionTrainingTask.MODEL_TRAINING_SUCCESS,
            `Training succeeded for Task ${taskId}`,
          );
        }
        if (state === 'SUCCESS' || state === 'FAILURE' || state === 'REVOKED') {
          setRefreshFlag((prev) => !prev);
          if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
            setIsTraining(false);
          }
        } else {
          if (progressRes.results && progressRes.results.data && progressRes.results.data.results) {
            setLossData(progressRes.results.data.results);
          }
        }
      } catch (error) {
        console.error(error);
        setIsTraining(false);
        logger.logAction(
          LogLevel.ERROR,
          LogActionTrainingTask.MODEL_TRAINING_ERROR,
          `Error occurred while fetching training progress for Task ${taskId}`,
        );
      }
    };

    intervalId.current = setInterval(fetchTaskProgress, 2000);
  };

  const handleStartTraining = async (isRestart: boolean = false) => {
    if (!taskData) return;

    if (isRestart) {
      setRestartBtnLoading(true);
    } else {
      setStartBtnLoading(true);
    }

    const algoName = taskData?.task_detail?.algorithm.name.replace(/\s+/g, '');
    const frameworkName = taskData?.task_detail?.algorithm.training_framework.name;
    const saveKey = taskData?.task_detail?.save_key;

    try {
      setIsTraining(true);
      const resp = await startTraining(taskData.task_detail._id);
      if (resp['code'] === 200) {
        if (_id) startFetchingProgress(_id, algoName, frameworkName, saveKey);
        logger.logAction(
          LogLevel.INFO,
          isRestart
            ? LogActionTrainingTask.MODEL_TRAINING_RESTART
            : LogActionTrainingTask.MODEL_TRAINING_START,
          `Training ${isRestart ? 'restarted' : 'started'} for Task ${_id}`,
        );
      } else {
        setIsTraining(false);
        logger.logAction(
          LogLevel.ERROR,
          LogActionTrainingTask.MODEL_TRAINING_ERROR,
          `Failed to start training for Task ${_id}`,
        );
      }
    } catch (error) {
      console.error(error);
      setIsTraining(false);
      logger.logAction(
        LogLevel.ERROR,
        LogActionTrainingTask.MODEL_TRAINING_ERROR,
        `Error occurred while starting training for Task ${_id}`,
      );
    } finally {
      setTimeout(() => {
        if (isRestart) {
          setRestartBtnLoading(false);
        } else {
          setStartBtnLoading(false);
        }
      }, 3000);
    }
  };

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

  const handleStopTraining = async () => {
    if (!taskData) return;

    setStopBtnLoading(true);

    const algoName = taskData?.task_detail.algorithm.name.replace(/\s+/g, '');
    const frameworkName = taskData?.task_detail.algorithm.training_framework.name;

    try {
      const resp = await stopTraining(taskData.task_detail._id, algoName, frameworkName);
      if (resp['code'] === 200) {
        setTimeout(() => {
          message.success(resp['msg']);
          setIsTraining(false);
          logger.logAction(
            LogLevel.INFO,
            LogActionTrainingTask.MODEL_TRAINING_STOP,
            `Training stopped for Task ${taskData.task_detail._id}`,
          );
        }, 3000);
      }
    } catch (err) {
      message.error(
        intl.formatMessage({
          id: 'pages.trainingTask.error',
          defaultMessage: '遇到錯誤，',
        }) + err,
      );
      setIsTraining(false);
      logger.logAction(
        LogLevel.ERROR,
        LogActionTrainingTask.MODEL_TRAINING_ERROR,
        `Error occurred while stopping training for Task ${taskData.task_detail._id}`,
      );
    } finally {
      setTimeout(() => {
        setStopBtnLoading(false);
      }, 5000);
    }
  };

  const ActionButtons: React.FC<ActionButtonsProps> = ({ buttonFixTop }) => {
    const actionsButtons = (
      <Space size="small">
        <Button
          loading={startBtnLoading}
          type="primary"
          size="large"
          icon={<CaretRightOutlined />}
          onClick={() => handleStartTraining(false)}
          shape="round"
          disabled={handleDisableStart()}
        >
          <FormattedMessage id="pages.trainingTask.start" defaultMessage="開始訓練" />
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
          <FormattedMessage id="pages.trainingTask.stop" defaultMessage="終止訓練" />
        </Button>
        <Button
          loading={restartBtnLoading}
          size="large"
          icon={<UndoOutlined />}
          onClick={() => handleStartTraining(true)}
          shape="round"
          disabled={handleDisableRestart()}
        >
          <FormattedMessage id="pages.trainingTask.restart" defaultMessage="重新訓練" />
        </Button>
      </Space>
    );

    return buttonFixTop ? (
      <Card size="small" bordered={false} style={{ boxShadow: 'none' }}>
        {actionsButtons}
      </Card>
    ) : (
      actionsButtons
    );
  };

  return (
    <>
      <Affix offsetTop={50} onChange={(v: boolean | undefined) => setButtonFixTop(v)}>
        <Space size="small" style={{ marginBottom: 15 }}>
          <ActionButtons buttonFixTop={buttonFixTop} />
        </Space>
      </Affix>
      <TaskDetailsDescription
        taskData={taskData}
        status={isTraining ? trainingStatus : undefined}
      />
      <div style={{ marginTop: 15 }} />
      <Collapse
        size="large"
        items={[
          {
            key: '1',
            label: intl.formatMessage({
              id: 'pages.trainingTask.datasetSummary',
              defaultMessage: '資料集摘要',
            }),
            children: <DatasetSummary taskData={taskData} />,
          },
        ]}
        defaultActiveKey={['1']}
      />
      <div style={{ marginTop: 15 }} />
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
