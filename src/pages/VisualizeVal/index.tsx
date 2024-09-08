/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-08-24 13:58:39
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-09-08 17:33:24
 * @FilePath: /PoseidonAI-Client/src/pages/VisualizeVal/index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import {
  getVisualizationResults,
  getVisualizationStatus,
  visualizationTask,
} from '@/services/ant-design-pro/trainingTask';
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
  conf?: number[];
  cls: number[];
  points: number[][];
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

// 定義評估任務的狀態類型
export type VisStatus =
  | 'IDLE'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'ERROR'
  | 'REVOKED';

export type VisAction = 'restart' | 'start' | 'idle';

// 初始化表單數值
const initialState: FormValues = {
  iou: 0.7,
  conf: 0.5,
};

const fetchEvalResult = async (
  taskId: string,
  setVisualization: (d: VisualizationItem) => void,
  notification: any,
) => {
  try {
    const resp = await getVisualizationResults(taskId);
    setVisualization(resp.results);
  } catch (err) {
    console.error(err);
    notification.error({
      message: '讀取評估文件失敗',
      description: '請稍後重試',
      placement: 'topLeft',
    });
  }
};

const ViszualizeVal: React.FC<ViszualizeValProps> = ({ taskData }) => {
  const [api, contextHolder] = notification.useNotification();
  const [formValues, setFormValues] = useState<FormValues>(initialState);
  const [isVising, setIsVising] = useState<boolean>(false);
  const [visualization, setVisualization] = useState<VisualizationItem>();
  const [visId, setVisId] = useState<string>();
  const [currentAction, setCurrentAction] = useState<VisAction>('idle');
  const address = `http://localhost:5000/static/val_visualization/${taskData.task_detail.user_id}/${taskData.task_detail.save_key}`;

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
      if (visId) {
        const resp = await getVisualizationStatus(visId, algoName, frameworkName);
        const state: VisStatus = resp.results.state;
        console.log(resp.results); // 輸出當前狀態

        // 當任務完成或發生錯誤時停止輪詢
        if (state === 'SUCCESS' || state === 'ERROR' || state === 'FAILURE') {
          setVisualization(resp.results.data.results);
          if (intervalId) {
            clearInterval(intervalId); // 停止輪詢
            intervalId = null;
          }
          setIsVising(false);
          setCurrentAction('idle');
          api.success({
            message: '模型驗證集可視化完成',
            placement: 'topLeft',
          });
        }
      }
    };

    // 啟動輪詢
    if (visId) {
      intervalId = setInterval(fetchEvalStatus, 2000);
    }

    // 清除定時器以避免內存洩漏
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // 清除定時器
      }
    };
  }, [visId, algoName, frameworkName]);

  useEffect(() => {
    fetchEvalResult(taskData.task_detail._id, setVisualization, api);
  }, []);

  const handleStartVis = async (body: FormValues, action: VisAction) => {
    console.log(body);
    setIsVising(true);
    const taskId: string = taskData.task_detail._id;
    const resp = await visualizationTask(taskId, body);
    setVisId(resp.results); // 保存 evalId 以啟動輪詢
    setCurrentAction(action);
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
      />
      {visualization && (
        <PredCards data={visualization} address={address} style={{ marginTop: 15 }} />
      )}
    </>
  );
};

export default ViszualizeVal;
