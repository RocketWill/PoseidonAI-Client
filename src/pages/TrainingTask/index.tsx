/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 08:56:13
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-09 16:07:04
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/index.tsx
 */
import { listUserTasks } from '@/services/ant-design-pro/trainingTask';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { AlgorithmItem } from '../CreateTask';
import TaskList from './components/TaskList';

// 定義訓練狀態類型
export type TrainingStatus =
  | 'IDLE'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'ERROR'
  | 'REVOKED';

// 定義任務狀態的接口
export interface TaskState {
  state: TrainingStatus;
  data: {
    error_detail: string | null;
    results: any;
    status: TrainingStatus;
  };
}

// 定義任務詳情的接口
export interface TaskDetail {
  _id: string;
  name: string;
  description: string;
  algorithm_id: string;
  user_id: string;
  dataset_id: string;
  training_configuration_id: string;
  epoch: number;
  gpu_id: number;
  model_name: string;
  train_val_num: [number, number];
  val_ratio: number;
  created_at: string;
  algorithm: AlgorithmItem;
  status: string;
  save_key: string;
}

// 定義任務項目的接口
export interface TaskItem {
  task_state: TaskState | null;
  task_detail: TaskDetail;
}

// 訓練狀態與對應的標籤映射
export const TrainingStatusTagMap: Record<TrainingStatus, JSX.Element> = {
  IDLE: <Tag color="default">IDLE</Tag>,
  PENDING: <Tag color="default">PENDING</Tag>,
  PROCESSING: (
    <Tag color="processing" icon={<SyncOutlined spin />}>
      PROCESSING
    </Tag>
  ),
  SUCCESS: (
    <Tag icon={<CheckCircleOutlined />} color="success">
      SUCCESS
    </Tag>
  ),
  FAILURE: (
    <Tag icon={<CloseCircleOutlined />} color="error">
      FAILURE
    </Tag>
  ),
  ERROR: (
    <Tag icon={<CloseCircleOutlined />} color="error">
      ERROR
    </Tag>
  ),
  REVOKED: (
    <Tag icon={<MinusCircleOutlined />} color="volcano">
      REVOKED
    </Tag>
  ),
};

// 獲取任務列表數據的異步函數
const fetchTasks = async (setTaskData: (d: TaskDetail[]) => void): Promise<void> => {
  try {
    const resp = await listUserTasks();
    setTaskData(resp.results);
  } catch (error) {
    console.error(error);
  }
};

// 主 TrainingTask 組件
const TrainingTask: React.FC = () => {
  const [tasksData, setTasksData] = useState<TaskDetail[]>([]); // 用於存儲任務數據

  // 使用 useEffect 在組件掛載時獲取任務列表
  useEffect(() => {
    fetchTasks(setTasksData);
  }, []);

  return (
    <PageContainer>
      <TaskList tasksData={tasksData} /> {/* 渲染任務列表 */}
    </PageContainer>
  );
};

export default TrainingTask;
