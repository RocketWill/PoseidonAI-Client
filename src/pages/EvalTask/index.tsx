import {
  evaluationTask,
  getEvaluationResults,
  getEvaluationStatus,
} from '@/services/ant-design-pro/trainingTask';
import { Col, Collapse, notification, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { TaskItem } from '../TrainingTask';
import TaskDetailsDescription from '../TrainingTask/components/TaskDetailsDescription';
import ActionButtons from './components/ActionButtons';
import ClassifyResultChart from './components/Charts/ClassifyResultChart';
import F1ConfidenceChart from './components/Charts/F1ConfidenceChart';
import PRChart from './components/Charts/PRCurves';
import PrecisionConfidenceChart from './components/Charts/PrecisionConfidenceChart ';
import ReasultDict from './components/Charts/ReasultDict';
import RecallConfidenceChart from './components/Charts/RecallConfidenceChart';
import ModelInferenceForm from './components/ModelInferenceForm';

// 定義 EvalTaskProps 介面，指定 taskData 的類型
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

// 定義表單數值的介面
export interface FormValues {
  iou: number;
  gpu: number;
  batchSize: number;
}

// 定義評估任務的狀態類型
export type EvalStatus =
  | 'IDLE'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'ERROR'
  | 'REVOKED';

export type EvalAction = 'restart' | 'start' | 'idle';

// 初始化表單數值
const initialState: FormValues = {
  iou: 0.3,
  gpu: 0,
  batchSize: 1,
};

const fetchEvalResult = async (
  taskId: string,
  setMetrics: (d: MetricsItem) => void,
  notification: any,
) => {
  try {
    const resp = await getEvaluationResults(taskId);
    setMetrics(resp.results);
  } catch (err) {
    console.error(err);
    notification.error({
      message: '讀取評估文件失敗',
      description: '請稍後重試',
      placement: 'topLeft',
    });
  }
};

const EvalTask: React.FC<EvalTaskProps> = ({ taskData }) => {
  // 使用 useState 管理表單數值和評估任務 ID 的狀態
  const [api, contextHolder] = notification.useNotification();
  const [formValues, setFormValues] = useState<FormValues>(initialState);
  const [isEvaling, setIsEvaling] = useState<boolean>(false);
  const [evalId, setEvalId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricsItem>();
  const [currentAction, setCurrentAction] = useState<EvalAction>('idle');

  // 清理和格式化演算法名稱和框架名稱
  const algoName: string = taskData.task_detail.algorithm.name.replace(/\s+/g, '');
  const frameworkName: string = taskData.task_detail.algorithm.training_framework.name.replace(
    /\s+/g,
    '',
  );
  const detectType: string = taskData.task_detail.algorithm.detect_type.tag_name;

  // 使用 useEffect 進行狀態輪詢
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchEvalStatus = async () => {
      if (evalId) {
        const resp = await getEvaluationStatus(evalId, algoName, frameworkName);
        const state: EvalStatus = resp.results.state;
        console.log(resp.results.state); // 輸出當前狀態

        // 當任務完成或發生錯誤時停止輪詢
        if (state === 'SUCCESS' || state === 'ERROR' || state === 'FAILURE') {
          setMetrics(resp.results.data.results);
          if (intervalId) {
            clearInterval(intervalId); // 停止輪詢
            intervalId = null;
          }
          setIsEvaling(false);
          setCurrentAction('idle');
          api.success({
            message: '模型評估完成',
            placement: 'topLeft',
          });
        }
      }
    };

    // 啟動輪詢
    if (evalId) {
      intervalId = setInterval(fetchEvalStatus, 2000);
    }

    // 清除定時器以避免內存洩漏
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // 清除定時器
      }
    };
  }, [evalId, algoName, frameworkName]);

  useEffect(() => {
    fetchEvalResult(taskData.task_detail._id, setMetrics, api);
  }, []);

  // 處理開始評估的按鈕點擊事件
  const handleStartEval = async (body: FormValues, action: EvalAction) => {
    setIsEvaling(true);
    const taskId: string = taskData.task_detail._id;
    const resp = await evaluationTask(taskId, body);
    setEvalId(resp.results); // 保存 evalId 以啟動輪詢
    setCurrentAction(action);
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
            label: 'Inference and Evaluation settings',
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
