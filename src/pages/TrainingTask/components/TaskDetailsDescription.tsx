/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 15:16:17
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-06 16:54:10
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/TaskDetailsDescription.tsx
 */

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Space, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { createBrowserHistory } from 'umi';
import { TaskItem } from '..';

const history = createBrowserHistory();

interface TaskDetailsDescriptionProps {
  taskData: TaskItem | undefined;
}

const TaskDetailsDescription: React.FC<TaskDetailsDescriptionProps> = ({ taskData }) => {
  return (
    <Card size="small">
      <Space direction="horizontal">
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
          Back
        </Button>
        <Descriptions title={taskData?.name} column={4} size="small">
          <Descriptions.Item label="Description">{taskData?.description}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="orange">{taskData?.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Model Name">{taskData?.model_name}</Descriptions.Item>
          <Descriptions.Item label="GPU ID">{taskData?.gpu_id}</Descriptions.Item>
          <Descriptions.Item label="Training Images">
            {taskData?.train_val_num[0]}
          </Descriptions.Item>
          <Descriptions.Item label="Validation Images">
            {taskData?.train_val_num[1]}
          </Descriptions.Item>
          <Descriptions.Item label="Epochs (Iterations)">{taskData?.epoch}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {moment(taskData?.created_at).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Algorithm">
            <Tag color="blue">{taskData?.algorithm.name}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Framework">
            <Tag color="green">{taskData?.algorithm.training_framework.name}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
};

export default TaskDetailsDescription;
