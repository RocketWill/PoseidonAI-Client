/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 15:16:17
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-06 16:59:04
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/TaskDetails.tsx
 */

import { getUserTask } from '@/services/ant-design-pro/trainingTask';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TaskItem } from '..';
import TaskDetailsDescription from './TaskDetailsDescription';

const TaskDetails: React.FC = () => {
  const [taskData, setTaskData] = useState<TaskItem | undefined>(undefined);
  const { taskId } = useParams();
  // if (!taskId) return;

  const fetchTask = async () => {
    try {
      const resp = await getUserTask(taskId as string);
      setTaskData(resp.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (taskId) fetchTask();
  }, []);

  return (
    <PageContainer>
      <TaskDetailsDescription taskData={taskData} />
    </PageContainer>
  );
};

export default TaskDetails;
