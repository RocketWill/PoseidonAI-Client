import { evaluationTask, getEvaluationStatus } from '@/services/ant-design-pro/trainingTask';
import React, { useEffect, useState } from 'react';
import { TaskItem } from '../TrainingTask';
import TaskDetailsDescription from '../TrainingTask/components/TaskDetailsDescription';
import ActionButtons from './components/ActionButtons';
import ModelInferenceForm from './components/ModelInferenceForm';

// 定義 EvalTaskProps 介面，指定 taskData 的類型
interface EvalTaskProps {
  taskData: TaskItem;
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

// 初始化表單數值
const initialState: FormValues = {
  iou: 0.3,
  gpu: 0,
  batchSize: 1,
};

const EvalTask: React.FC<EvalTaskProps> = ({ taskData }) => {
  // 使用 useState 管理表單數值和評估任務 ID 的狀態
  const [formValues, setFormValues] = useState<FormValues>(initialState);
  const [evalId, setEvalId] = useState<string | null>(null);

  // 清理和格式化演算法名稱和框架名稱
  const algoName: string = taskData.task_detail.algorithm.name.replace(/\s+/g, '');
  const frameworkName: string = taskData.task_detail.algorithm.training_framework.name.replace(
    /\s+/g,
    '',
  );

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
          if (intervalId) {
            clearInterval(intervalId); // 停止輪詢
            intervalId = null;
          }
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

  // 處理開始評估的按鈕點擊事件
  const handleStartEval = async (body: FormValues) => {
    const taskId: string = taskData.task_detail._id;
    const resp = await evaluationTask(taskId, body);
    setEvalId(resp.results); // 保存 evalId 以啟動輪詢
  };

  return (
    <>
      <ActionButtons status={undefined} formValues={formValues} handleStartEval={handleStartEval} />
      <TaskDetailsDescription taskData={taskData} status={undefined} />
      <ModelInferenceForm
        styles={{ marginTop: 15 }}
        formValues={formValues}
        setFormValues={setFormValues}
      />
    </>
  );
};

export default EvalTask;
