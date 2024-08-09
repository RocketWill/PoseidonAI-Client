/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 15:16:17
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-09 16:02:44
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/TaskDetails.tsx
 */

import { getUserTask } from '@/services/ant-design-pro/trainingTask'; // 引入服務方法用於獲取任務數據
import { PageContainer } from '@ant-design/pro-components'; // 引入 Ant Design Pro 的頁面容器組件
import React, { useEffect, useState } from 'react'; // 引入 React 和 Hook
import { useParams } from 'react-router-dom'; // 引入用於獲取 URL 參數的 Hook
import { TaskItem } from '..'; // 引入項目內部的類型
import ModelTraining from './ModelTraining'; // 引入 ModelTraining 組件

// TaskDetails 組件
const TaskDetails: React.FC = () => {
  // 定義狀態用於存儲任務數據
  const [taskData, setTaskData] = useState<TaskItem | undefined>(undefined);
  // 定義狀態用於控制刷新標誌
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  // 從 URL 中提取 taskId
  const { taskId } = useParams();

  // 獲取任務數據的異步函數
  const fetchTask = async () => {
    try {
      // 呼叫 API 獲取任務數據
      const resp = await getUserTask(taskId as string);
      // 更新狀態
      setTaskData(resp.results);
    } catch (error) {
      // 異常處理，打印錯誤信息
      console.error(error);
    }
  };

  // 使用 useEffect 來監控 refreshFlag 和 taskId 的變化
  useEffect(() => {
    if (taskId) fetchTask(); // taskId 存在時調用 fetchTask
  }, [refreshFlag]); // 當 refreshFlag 改變時重新獲取數據

  return (
    <PageContainer>
      {/* 渲染 ModelTraining 組件並傳遞任務數據和刷新標誌的 set 函數 */}
      <ModelTraining taskData={taskData} setRefreshFlag={setRefreshFlag} />
    </PageContainer>
  );
};

export default TaskDetails;
