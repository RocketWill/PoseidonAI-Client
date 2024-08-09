/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 16:56:25
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-09 15:59:18
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/TaskList.tsx
 */

import { PlusCircleOutlined } from '@ant-design/icons';
import { Card, Col, List, Row, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { history } from 'umi';

import './TaskList.css'; // Import custom CSS

// Import types and constants
import { TaskDetail, TrainingStatus, TrainingStatusTagMap } from '..';

const { Text } = Typography;

// Define the props type for TaskList
interface TaskListProps {
  tasksData: TaskDetail[];
}

// Helper function to generate preview image URL
const getPreviewImage = (item: TaskDetail): string => {
  const address = 'http://127.0.0.1:5000/static/project_preview';
  return `${address}/${item.user_id}/${item.save_key}/preview.jpg`;
};

// Handler for showing task detail
const handleShowTaskDetail = (_id: string): void => {
  history.push(`/project/training-task/${_id}`);
};

// Main TaskList component
const TaskList: React.FC<TaskListProps> = ({ tasksData }) => (
  <List
    style={{ maxWidth: 1500 }}
    grid={{ gutter: 16, column: 3 }}
    dataSource={tasksData}
    renderItem={(item: TaskDetail) => (
      <List.Item>
        <Card
          className="task-card"
          title={
            <Space direction="horizontal">
              {item.name}
              {TrainingStatusTagMap[item.status as TrainingStatus]}
            </Space>
          }
          extra={<PlusCircleOutlined onClick={() => handleShowTaskDetail(item._id)} />}
          cover={
            <div className="preview-image">
              <img alt="preview" src={getPreviewImage(item)} loading="lazy" />
            </div>
          }
          onClick={() => handleShowTaskDetail(item._id)}
          style={{ cursor: 'pointer' }}
        >
          <Space direction="vertical" size="middle" className="task-card-content">
            <Space>
              <Tag color="blue">{item.algorithm.name}</Tag>
              <Tag color="green">{item.algorithm.training_framework.name}</Tag>
            </Space>
            <Row gutter={16}>
              <Col span={24}>
                <Text strong>{item.model_name}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">GPU {item.gpu_id}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">
                  {`Train/Val Images ${item.train_val_num[0]}/${item.train_val_num[1]}`}
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">{`Epochs (Iterations) ${item.epoch}`}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">
                  Created at {moment(item.created_at).format('YYYY-MM-DD HH:mm')}
                </Text>
              </Col>
            </Row>
          </Space>
        </Card>
      </List.Item>
    )}
  />
);

export default TaskList;
