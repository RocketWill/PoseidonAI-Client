/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 16:56:25
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-18 13:47:35
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/TaskList.tsx
 */

import { deleteUserTask } from '@/services/ant-design-pro/trainingTask';
import { DeleteOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import { Button, Card, Col, Empty, List, Modal, Row, Space, Tag, Typography, message } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { history } from 'umi';

import './TaskList.css'; // Import custom CSS

// Import types and constants
import { TaskDetail, TrainingStatus, TrainingStatusTagMap } from '..';

const { Text } = Typography;

// Define the props type for TaskList
interface TaskListProps {
  tasksData: TaskDetail[];
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
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

const EmptyList: React.FC = () => (
  <Empty description={<Typography.Text>暫無訓練任務</Typography.Text>}>
    <Button type="primary" onClick={() => history.push('/project/create-task')}>
      創建
    </Button>
  </Empty>
);
// Main TaskList component
const TaskList: React.FC<TaskListProps> = ({ tasksData, setRefreshFlag }) => {
  const [deleteModelOpen, setDeleteModelOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  if (!tasksData.length) return <EmptyList />;

  const sortedTasks = tasksData.sort((a, b) => {
    const now = new Date().getTime();
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();

    // 比较两个时间与当前时间的差值，绝对值越小的越接近当前时间
    return Math.abs(timeA - now) - Math.abs(timeB - now);
  });

  const handleDeleteProject = async (_id: string | undefined) => {
    if (!_id) {
      setDeleteModelOpen(false);
      return;
    }
    const result = await deleteUserTask(_id);
    if (result.code === 200) {
      message.success('刪除成功');
    } else {
      message.error('刪除失敗' + result.msg);
    }
    setDeleteModelOpen(false);
    setRefreshFlag((prev) => !prev);
  };

  return (
    <>
      <List
        itemLayout="vertical"
        size="small"
        bordered={false}
        grid={{
          gutter: 4,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        style={{
          marginTop: 15,
          maxWidth: 1500,
        }}
        dataSource={sortedTasks}
        renderItem={(item: TaskDetail) => (
          <List.Item>
            <Card
              size="small"
              className="task-card"
              cover={
                <div className="preview-image">
                  <img alt="preview" src={getPreviewImage(item)} loading="lazy" />
                </div>
              }
              onClick={() => handleShowTaskDetail(item._id)}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              hoverable
              actions={[
                <DeleteOutlined
                  key="delete"
                  style={{ color: '#EF5A6F' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(item._id);
                    setDeleteModelOpen(true);
                  }}
                />,
              ]}
            >
              <Card.Meta title={item.name} description={item.description} style={{ height: 60 }} />
              <Space direction="vertical" size="middle" className="task-card-content">
                <Space size={2}>
                  <Tag color="blue">{item.algorithm.name}</Tag>
                  <Tag color="purple">{item.algorithm.training_framework.display_name}</Tag>
                  {TrainingStatusTagMap[item.status as TrainingStatus]}
                </Space>
                <Row gutter={16}>
                  <Col span={24}>
                    <Text strong>{item.model_name}</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">GPU {item.gpu_id}</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">{`Epochs (Iterations) ${item.epoch}`}</Text>
                  </Col>
                  <Col span={24}>
                    <Text type="secondary">
                      {`Train/Val Images ${item.train_val_num[0]}/${item.train_val_num[1]}`}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary" italic style={{ fontSize: '0.9em' }}>
                      <FormattedMessage
                        id="pages.dataset.display.uploaded"
                        defaultMessage="上傳於"
                      />{' '}
                      {moment(item.created_at).fromNow()}
                    </Text>
                  </Col>
                </Row>
              </Space>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        style={{ minWidth: 200 }}
        title="刪除訓練專案"
        open={deleteModelOpen}
        onOk={() => handleDeleteProject(selectedId)}
        onCancel={() => setDeleteModelOpen(false)}
      >
        刪除該訓練專案將永久移除所有相關內容，包括權重、圖像和評估結果，且無法恢復。請確認是否繼續執行此操作
      </Modal>
    </>
  );
};

export default TaskList;
