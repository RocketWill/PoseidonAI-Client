/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 15:16:17
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-15 10:25:37
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/TaskDetails.tsx
 */
import EvalTask from '@/pages/EvalTask';
import { getUserTask } from '@/services/ant-design-pro/trainingTask'; // 引入服務方法用於獲取任務數據
import { ArrowLeftOutlined } from '@ant-design/icons'; // 引入 Ant Design 的圖標
import { PageContainer } from '@ant-design/pro-components'; // 引入 Ant Design Pro 的頁面容器組件
import { Button, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'; // 引入 React 和 Hook
import { useParams } from 'react-router-dom'; // 引入用於獲取 URL 參數的 Hook
import { createBrowserHistory } from 'umi'; // 引入 umi 用來創建瀏覽器歷史
import { TaskItem } from '..'; // 引入項目內部的類型
import ModelTraining from './ModelTraining'; // 引入 ModelTraining 組件

const history = createBrowserHistory();

// TaskDetails 組件
const TaskDetails: React.FC = () => {
  // 定義狀態用於存儲任務數據
  const [taskData, setTaskData] = useState<TaskItem | undefined>(undefined);
  // 定義狀態用於控制刷新標誌
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  // 從 URL 中提取 taskId
  const { taskId } = useParams();

  const evalMode = taskData?.task_detail.status === 'SUCCESS' ? false : true;

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
    <PageContainer
      subTitle={
        <Button type="default" icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
          Back
        </Button>
      }
    >
      {/* 渲染 ModelTraining 組件並傳遞任務數據和刷新標誌的 set 函數 */}
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: '模型訓練',
            key: '1',
            children: <ModelTraining taskData={taskData} setRefreshFlag={setRefreshFlag} />,
          },
          {
            label: evalMode ? <Tooltip title="請先完成模型訓練">模型評估</Tooltip> : '模型評估',
            key: '2',
            children: <EvalTask taskData={taskData} />,
            disabled: evalMode,
          },
        ]}
      />
    </PageContainer>
  );
};

export default TaskDetails;
