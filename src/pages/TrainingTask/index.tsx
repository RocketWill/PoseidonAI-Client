/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 08:56:13
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-06 16:14:08
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/index.tsx
 */
import { listUserTasks } from '@/services/ant-design-pro/trainingTask';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { AlgorithmItem } from '../CreateTask';
import TaskList from './components/TaskList';

export interface TaskItem {
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

const fetchTasks = async (setTaskData: (d: TaskItem[]) => void): Promise<void> => {
  try {
    const resp = await listUserTasks();
    setTaskData(resp.results);
  } catch (error) {
    console.error(error);
  }
};

const TrainingTask: React.FC = () => {
  const [tasksData, setTasksData] = useState<TaskItem[]>([]);

  useEffect(() => {
    fetchTasks(setTasksData);
  }, []);

  return (
    <PageContainer>
      <TaskList tasksData={tasksData} />
    </PageContainer>
  );
};

export default TrainingTask;
