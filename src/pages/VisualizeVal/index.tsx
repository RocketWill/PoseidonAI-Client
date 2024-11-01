import {
  getVisualizationResults,
  getVisualizationStatus,
  visualizationTask,
} from '@/services/ant-design-pro/trainingTask';
import { LogActionVisTask } from '@/utils/LogActions';
import { LogLevel } from '@/utils/LogLevels';
import { useUserActionLogger } from '@/utils/UserActionLoggerContext';
import { FormattedMessage, useIntl } from '@umijs/max';
import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { TaskItem } from '../TrainingTask';
import TaskDetailsDescription from '../TrainingTask/components/TaskDetailsDescription';
import ActionButtons from './components/ActionButtons';
import ModelVisualizeForm from './components/ModelVisualizeForm';
import PredCards from './components/PredCards';

interface ViszualizeValProps {
  taskData: TaskItem;
}

export interface FormValues {
  iou: number;
  conf: number;
}

export interface DetectItem {
  conf?: number[] | any;
  cls: number[] | any;
  points: number[][] | any;
}

export interface PredItem {
  dt: DetectItem;
  gt: DetectItem;
  filename: string;
}

export interface VisualizationItem {
  class_names: { id: number; name: string }[];
  preds: PredItem[];
}

export type VisStatus =
  | 'IDLE'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'ERROR'
  | 'REVOKED';
export type VisAction = 'restart' | 'start' | 'idle';

const initialState: FormValues = {
  iou: 0.7,
  conf: 0.5,
};

const fetchEvalResult = async (
  taskId: string,
  setVisualization: (d: VisualizationItem) => void,
  notification: any,
  logger: any,
) => {
  try {
    const resp = await getVisualizationResults(taskId);
    setVisualization(resp.results);
    logger.logAction(
      LogLevel.DEBUG,
      LogActionVisTask.VIS_TASK_FETCH_RESULT,
      `Visualization results fetched for task ${taskId}`,
    );
  } catch (err) {
    console.error(err);
    logger.logAction(
      LogLevel.ERROR,
      LogActionVisTask.VIS_TASK_ERROR,
      `Error fetching visualization results for task ${taskId}`,
    );
    notification.error({
      message: (
        <FormattedMessage id="pages.visTask.errorFetch" defaultMessage="讀取可視化文件失敗" />
      ),
      description: (
        <FormattedMessage id="pages.visTask.tryAgainLater" defaultMessage="請稍後重試" />
      ),
      placement: 'topLeft',
    });
  }
};

const ViszualizeVal: React.FC<ViszualizeValProps> = ({ taskData }) => {
  const intl = useIntl();
  const [api, contextHolder] = notification.useNotification();
  const [formValues, setFormValues] = useState<FormValues>(initialState);
  const [isVising, setIsVising] = useState<boolean>(false);
  const [visualization, setVisualization] = useState<VisualizationItem>();
  const [visId, setVisId] = useState<string>();
  const [currentAction, setCurrentAction] = useState<VisAction>('idle');
  const address = `http://localhost:5000/static/val_visualization/${taskData.task_detail.user_id}/${taskData.task_detail.save_key}`;
  const logger = useUserActionLogger();

  const algoName: string = taskData.task_detail.algorithm.name.replace(/\s+/g, '');
  const frameworkName: string = taskData.task_detail.algorithm.training_framework.name.replace(
    /\s+/g,
    '',
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchEvalStatus = async () => {
      if (visId) {
        const resp = await getVisualizationStatus(visId, algoName, frameworkName);
        const state: VisStatus = resp.results.state;
        logger.logAction(
          LogLevel.DEBUG,
          LogActionVisTask.VIS_TASK_PROGRESS_FETCH,
          `Visualization progress: ${state} for visId ${visId}`,
        );

        if (state === 'SUCCESS' || state === 'ERROR' || state === 'FAILURE') {
          setVisualization(resp.results.data.results);
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          setIsVising(false);
          setCurrentAction('idle');

          if (state === 'SUCCESS') {
            api.success({
              message: intl.formatMessage({
                id: 'pages.visTask.visualizationComplete',
                defaultMessage: '模型驗證集可視化完成',
              }),
              placement: 'topLeft',
            });
            logger.logAction(
              LogLevel.INFO,
              LogActionVisTask.VIS_TASK_SUCCESS,
              `Visualization successful for visId ${visId}`,
            );
          } else {
            logger.logAction(
              LogLevel.ERROR,
              LogActionVisTask.VIS_TASK_FAILURE,
              `Visualization failed for visId ${visId}`,
            );
          }
        }
      }
    };

    if (visId) {
      intervalId = setInterval(fetchEvalStatus, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [visId, algoName, frameworkName]);

  useEffect(() => {
    fetchEvalResult(taskData.task_detail._id, setVisualization, api, logger);
  }, []);

  const handleStartVis = async (body: FormValues, action: VisAction) => {
    setIsVising(true);
    const taskId: string = taskData.task_detail._id;
    const resp = await visualizationTask(taskId, body);
    setVisId(resp.results);
    setCurrentAction(action);
    logger.logAction(
      LogLevel.INFO,
      action === 'restart' ? LogActionVisTask.VIS_TASK_RESTART : LogActionVisTask.VIS_TASK_START,
      `Visualization ${action} for task ${taskId}`,
    );
  };

  return (
    <>
      {contextHolder}
      <ActionButtons
        status={visualization ? 'SUCCESS' : 'IDLE'}
        formValues={formValues}
        handleStartVis={handleStartVis}
        isVising={isVising}
        currentAction={currentAction}
      />
      <TaskDetailsDescription taskData={taskData} status={undefined} />
      <ModelVisualizeForm
        formValues={formValues}
        setFormValues={setFormValues}
        style={{ marginTop: 15 }}
        detectType={taskData.task_detail.algorithm.detect_type}
      />
      {visualization && (
        <PredCards data={visualization} address={address} style={{ marginTop: 15 }} />
      )}
    </>
  );
};

export default ViszualizeVal;
