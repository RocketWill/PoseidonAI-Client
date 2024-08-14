import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, List, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { DatasetFormatItem, DatasetItem } from '..';
import './DatasetListItem.css';

interface DatasetListItemProps {
  item: DatasetItem;
  setSelectedDatasetData: (d: DatasetItem) => void;
  setDeleteModalOpen: (d: boolean) => void;
  handleEditDataset: (d: DatasetItem) => void;
}

const DatasetListItem: React.FC<DatasetListItemProps> = ({
  item,
  handleEditDataset,
  setSelectedDatasetData,
  setDeleteModalOpen,
}) => {
  const time = moment(item.created_at);
  const address = 'http://127.0.0.1:5000/static/dataset_preview';
  const previewImageUrl = `${address}/${item.user_id}/${item.save_key}/preview.jpg`;
  const defaultImageUrl = `${address}/default.webp`;

  const relativeTime = time.fromNow();

  return (
    <List.Item>
      <Card
        className="task-card"
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        cover={
          <div className="preview-image">
            <Tag color="#1F316F" style={{ fontWeight: 500 }} className="tag-top-right">
              {item.detect_type.name.toUpperCase()}
            </Tag>
            <img
              alt="preview"
              width="100%"
              src={previewImageUrl}
              onError={(e) => {
                e.currentTarget.src = defaultImageUrl;
              }}
              loading="lazy"
            />
          </div>
        }
        actions={[
          <EyeOutlined key="view" onClick={() => handleEditDataset(item)} />,
          <DeleteOutlined
            key="delete"
            style={{ color: '#EF5A6F' }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDatasetData(item);
              setDeleteModalOpen(true);
            }}
          />,
        ]}
        hoverable
        onClick={() => handleEditDataset(item)}
      >
        <Card.Meta title={item.name} description={item.description} style={{ height: 60 }} />
        <Space direction="vertical">
          <Space size={0} style={{ marginTop: 15 }}>
            <Tag color="blue" bordered={false}>
              <span style={{ fontWeight: 500 }}>{item.class_names.length}</span>{' '}
              {item.class_names.length === 1 ? 'class' : 'classes'}
            </Tag>
            <Tag color="blue" bordered={false}>
              <span style={{ fontWeight: 500 }}>{item.image_files.length}</span>{' '}
              {item.image_files.length === 1 ? 'image' : 'images'}
            </Tag>
            {item.dataset_format.map((format: DatasetFormatItem) => (
              <Tag key={format._id} bordered={false} color="blue">
                {format.name}
              </Tag>
            ))}
          </Space>
          <Typography.Text type="secondary" italic style={{ fontSize: '0.9em' }}>
            更新於 {relativeTime}
          </Typography.Text>
        </Space>
      </Card>
    </List.Item>
  );
};

export default DatasetListItem;
