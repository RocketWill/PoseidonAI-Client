import { Card, Col, List, Row, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { history } from 'umi';
import { TaskItem } from '..';
import './TaskList.css'; // 引入自定义的 CSS 文件

const { Text } = Typography;

interface TaskListProps {
  tasksData: TaskItem[];
}

const getPreviewImage = (item: TaskItem) => {
  const address = 'http://127.0.0.1:5000/static/project_preview';
  const imageLink = `${address}/${item.user_id}/${item.save_key}/preview.jpg`;
  return imageLink;
};

const handleShowTaskDetail = (_id: string) => {
  history.push('/project/training-task/' + _id);
};

const TaskList: React.FC<TaskListProps> = ({ tasksData }) => {
  return (
    <List
      style={{ maxWidth: 1500 }}
      grid={{ gutter: 16, column: 3 }}
      dataSource={tasksData}
      renderItem={(item: TaskItem) => (
        <List.Item>
          <Card
            className="task-card"
            title={
              <Space direction="horizontal">
                {item.name}
                <Tag color="orange">{item.status}</Tag>
              </Space>
            }
            extra={<a onClick={() => handleShowTaskDetail(item._id)}>more</a>}
            cover={
              <div className="preview-image">
                <img alt="preview" src={getPreviewImage(item)} />
              </div>
            }
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
};

export default TaskList;
