/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 15:16:17
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-13 15:44:47
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/TaskDetailsDescription.tsx
 */

// 首先引入 React，然後引入其他外部庫和組件
import moment from 'moment'; // 用於日期格式化
import React from 'react';

import { Card, Descriptions, Space, Tag } from 'antd'; // Ant Design 的組件

// 引入專案內部的類型和常量
import { TaskItem, TrainingStatus, TrainingStatusTagMap } from '..';

// 定義 TaskDetailsDescriptionProps 的接口，描述組件的 props 結構
interface TaskDetailsDescriptionProps {
  taskData: TaskItem | undefined; // 任務數據，可為未定義
  status: TrainingStatus | undefined; // 訓練狀態，可為未定義
}

// 主 TaskDetailsDescription 組件
const TaskDetailsDescription: React.FC<TaskDetailsDescriptionProps> = ({ taskData, status }) => {
  // 根據傳入的 status 和 taskData 中的狀態確定要顯示的狀態
  const showStatus: TrainingStatus = status || (taskData?.task_detail?.status as TrainingStatus);

  return (
    <Card size="small">
      {/* 使用 Space 組件來水平排列元素 */}
      <Space direction="horizontal">
        {/* 顯示任務詳情的描述列表 */}
        <Descriptions title={taskData?.task_detail?.name} column={4} size="small">
          {/* 顯示任務描述 */}
          <Descriptions.Item label="Description">
            {taskData?.task_detail?.description}
          </Descriptions.Item>
          {/* 顯示任務狀態 */}
          <Descriptions.Item label="Status">{TrainingStatusTagMap[showStatus]}</Descriptions.Item>
          {/* 顯示模型名稱 */}
          <Descriptions.Item label="Model Name">
            {taskData?.task_detail?.model_name}
          </Descriptions.Item>
          {/* 顯示 GPU ID */}
          <Descriptions.Item label="GPU ID">{taskData?.task_detail?.gpu_id}</Descriptions.Item>
          {/* 顯示訓練圖片數量 */}
          <Descriptions.Item label="Training Images">
            {taskData?.task_detail?.train_val_num[0]}
          </Descriptions.Item>
          {/* 顯示驗證圖片數量 */}
          <Descriptions.Item label="Validation Images">
            {taskData?.task_detail?.train_val_num[1]}
          </Descriptions.Item>
          {/* 顯示迭代次數 */}
          <Descriptions.Item label="Epochs (Iterations)">
            {taskData?.task_detail?.epoch}
          </Descriptions.Item>
          {/* 顯示創建時間，使用 moment 格式化日期 */}
          <Descriptions.Item label="Created At">
            {moment(taskData?.task_detail?.created_at).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
          {/* 顯示使用的算法 */}
          <Descriptions.Item label="Algorithm">
            <Tag color="blue">{taskData?.task_detail?.algorithm.name}</Tag>
          </Descriptions.Item>
          {/* 顯示使用的框架 */}
          <Descriptions.Item label="Framework">
            <Tag color="green">{taskData?.task_detail?.algorithm.training_framework.name}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
};

export default TaskDetailsDescription;
