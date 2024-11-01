/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 15:16:17
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-11-01 14:00:12
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/TaskDetailsDescription.tsx
 */

import { useIntl } from '@umijs/max';
import { Card, Descriptions, Space, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { TaskItem, TrainingStatus, TrainingStatusTagMap } from '..';

interface TaskDetailsDescriptionProps {
  taskData: TaskItem | undefined;
  status: TrainingStatus | undefined;
}

const TaskDetailsDescription: React.FC<TaskDetailsDescriptionProps> = ({ taskData, status }) => {
  const intl = useIntl();
  const showStatus: TrainingStatus = status || (taskData?.task_detail?.status as TrainingStatus);

  return (
    <Card size="small">
      <Space direction="horizontal">
        <Descriptions title={taskData?.task_detail?.name} column={4} size="small">
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.trainTask.details.description',
              defaultMessage: '描述',
            })}
          >
            {taskData?.task_detail?.description}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.trainTask.details.status',
              defaultMessage: '狀態',
            })}
          >
            {TrainingStatusTagMap[showStatus]}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.trainTask.details.modelName',
              defaultMessage: '模型名稱',
            })}
          >
            {taskData?.task_detail?.model_name}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.trainTask.details.gpuId',
              defaultMessage: 'GPU ID',
            })}
          >
            {taskData?.task_detail?.gpu_id}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.trainTask.details.trainingImages',
              defaultMessage: '訓練圖片數量',
            })}
          >
            {taskData?.task_detail?.train_val_num[0]}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.trainTask.details.validationImages',
              defaultMessage: '驗證圖片數量',
            })}
          >
            {taskData?.task_detail?.train_val_num[1]}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.trainTask.details.epochs',
              defaultMessage: 'Epoch/迭代次數',
            })}
          >
            {taskData?.task_detail?.epoch}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.trainTask.details.createdAt',
              defaultMessage: '創建時間',
            })}
          >
            {moment(taskData?.task_detail?.created_at).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.trainTask.details.algorithm',
              defaultMessage: '演算法',
            })}
          >
            <Tag color="blue">{taskData?.task_detail?.algorithm.name}</Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.trainTask.details.framework',
              defaultMessage: 'Poseidon 框架',
            })}
          >
            <Tag color="green">
              {taskData?.task_detail?.algorithm.training_framework.display_name}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
};

export default TaskDetailsDescription;
