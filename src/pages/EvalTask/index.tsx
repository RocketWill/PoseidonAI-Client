import {
  evaluationTask,
  getEvaluationResults,
  getEvaluationStatus,
} from '@/services/ant-design-pro/trainingTask';
import { LogActionEvalTask } from '@/utils/LogActions';
import { LogLevel } from '@/utils/LogLevels';
import { useUserActionLogger } from '@/utils/UserActionLoggerContext';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Col, Collapse, notification, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { TaskItem } from '../TrainingTask';
import TaskDetailsDescription from '../TrainingTask/components/TaskDetailsDescription';
import ActionButtons from './components/ActionButtons';
import ClassifyResultChart from './components/Charts/ClassifyResultChart';
import F1ConfidenceChart from './components/Charts/F1ConfidenceChart';
import PRChart from './components/Charts/PRCurves';
import PrecisionConfidenceChart from './components/Charts/PrecisionConfidenceChart';
import ReasultDict from './components/Charts/ReasultDict';
import RecallConfidenceChart from './components/Charts/RecallConfidenceChart';
import ModelInferenceForm from './components/ModelInferenceForm';

interface EvalTaskProps {
  taskData: TaskItem;
}

export interface NameItem {
  id: number;
  name: string;
}

export interface MetricsItem {
  names: NameItem[];
  confidence: number[];
  f1: {
    f1_scores: number[][];
    f1_mean: number[];
  };
  precision: {
    precision: number[][];
    precision_mean: number[];
  };
  recall: {
    recall: number[][];
    recall_mean: number[];
  };
  pr: {
    recall: number[];
    precision: number[][];
    precision_mean: number[];
  };
  result_dict: {
    precision: number;
    recall: number;
  };
  parameters: {
    iou_thres: number;
    gpu_id: number;
    batch_size: number;
  };
}

export interface FormValues {
  iou: number;
  gpu: number;
  batchSize: number;
}

export type EvalStatus =
  | 'IDLE'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'ERROR'
  | 'REVOKED';
export type EvalAction = 'restart' | 'start' | 'idle';

const initialState: FormValues = {
  iou: 0.3,
  gpu: 0,
  batchSize: 1,
};

const fetchEvalResult = async (
  taskId: string,
  setMetrics: (d: MetricsItem) => void,
  notification: any,
  logger: any,
) => {
  try {
    const resp = await getEvaluationResults(taskId);
    setMetrics(resp.results);
    logger.logAction(
      LogLevel.DEBUG,
      LogActionEvalTask.EVAL_TASK_FETCH_RESULT,
      `Evaluation results fetched for task ${taskId}`,
    );
  } catch (err) {
    console.error(err);
    logger.logAction(
      LogLevel.ERROR,
      LogActionEvalTask.EVAL_TASK_ERROR,
      `Error fetching evaluation results for task ${taskId}`,
    );
    notification.error({
      message: (
        <FormattedMessage id="pages.evalTask.errorFetch" defaultMessage="讀取評估文件失敗" />
      ),
      description: (
        <FormattedMessage id="pages.evalTask.tryAgainLater" defaultMessage="請稍後重試" />
      ),
      placement: 'topLeft',
    });
  }
};

const EvalTask: React.FC<EvalTaskProps> = ({ taskData }) => {
  const intl = useIntl();
  const [api, contextHolder] = notification.useNotification();
  const [formValues, setFormValues] = useState<FormValues>(initialState);
  const [isEvaling, setIsEvaling] = useState<boolean>(false);
  const [evalId, setEvalId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricsItem>();
  const [currentAction, setCurrentAction] = useState<EvalAction>('idle');
  const logger = useUserActionLogger();

  const algoName: string = taskData.task_detail.algorithm.name.replace(/\s+/g, '');
  const frameworkName: string = taskData.task_detail.algorithm.training_framework.name.replace(
    /\s+/g,
    '',
  );
  const detectType: string = taskData.task_detail.algorithm.detect_type.tag_name;

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchEvalStatus = async () => {
      if (evalId) {
        const resp = await getEvaluationStatus(evalId, algoName, frameworkName);
        const state: EvalStatus = resp.results.state;
        logger.logAction(
          LogLevel.DEBUG,
          LogActionEvalTask.EVAL_TASK_PROGRESS_FETCH,
          `Evaluation progress: ${state} for evalId ${evalId}`,
        );

        if (state === 'SUCCESS' || state === 'ERROR' || state === 'FAILURE') {
          setMetrics(resp.results.data.results);
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          setIsEvaling(false);
          setCurrentAction('idle');

          if (state === 'SUCCESS') {
            api.success({
              message: intl.formatMessage({
                id: 'pages.evalTask.evalComplete',
                defaultMessage: '模型評估完成',
              }),
              placement: 'topLeft',
            });
            logger.logAction(
              LogLevel.INFO,
              LogActionEvalTask.EVAL_TASK_SUCCESS,
              `Evaluation successful for evalId ${evalId}`,
            );
          } else {
            logger.logAction(
              LogLevel.ERROR,
              LogActionEvalTask.EVAL_TASK_FAILURE,
              `Evaluation failed for evalId ${evalId}`,
            );
          }
        }
      }
    };

    if (evalId) {
      intervalId = setInterval(fetchEvalStatus, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [evalId, algoName, frameworkName]);

  useEffect(() => {
    fetchEvalResult(taskData.task_detail._id, setMetrics, api, logger);
  }, []);

  const handleStartEval = async (body: FormValues, action: EvalAction) => {
    setIsEvaling(true);
    const taskId: string = taskData.task_detail._id;
    const resp = await evaluationTask(taskId, body);
    setEvalId(resp.results);
    setCurrentAction(action);
    logger.logAction(
      LogLevel.INFO,
      action === 'restart'
        ? LogActionEvalTask.EVAL_TASK_RESTART
        : LogActionEvalTask.EVAL_TASK_START,
      `Evaluation ${action} for task ${taskId}`,
    );
  };

  return (
    <>
      {contextHolder}
      <ActionButtons
        status={metrics ? 'SUCCESS' : 'IDLE'}
        formValues={formValues}
        handleStartEval={handleStartEval}
        isEvaling={isEvaling}
        currentAction={currentAction}
      />
      {metrics && <ReasultDict metrics={metrics} style={{ marginBottom: 15 }} />}
      <TaskDetailsDescription taskData={taskData} status={undefined} />
      <Collapse
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: intl.formatMessage({
              id: 'pages.evalTask.inferenceAndEvalSettings',
              defaultMessage: '推論與評估設置',
            }),
            children: (
              <ModelInferenceForm
                formValues={formValues}
                setFormValues={setFormValues}
                detectType={taskData.task_detail.algorithm.detect_type}
              />
            ),
          },
        ]}
        style={{ marginTop: 15 }}
      />

      {metrics && detectType !== 'classify' && (
        <>
          <Row gutter={16} style={{ marginTop: 15, minWidth: 1000 }}>
            <Col span={12}>
              <PRChart metrics={metrics} />
            </Col>
            <Col span={12}>
              <F1ConfidenceChart metrics={metrics} />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 15, minWidth: 1000 }}>
            <Col span={12}>
              <PrecisionConfidenceChart metrics={metrics} />
            </Col>
            <Col span={12}>
              <RecallConfidenceChart metrics={metrics} />
            </Col>
          </Row>
        </>
      )}
      {metrics && detectType === 'classify' && (
        <Row gutter={16} style={{ marginTop: 15, minWidth: 1000 }}>
          <Col span={24}>
            <ClassifyResultChart metrics={metrics} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default EvalTask;
