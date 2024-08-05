/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 16:39:18
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-30 17:04:45
 * @FilePath: /PoseidonAI-Client/src/pages/ModelTraining/components/AlgorithmSelector.tsx
 */
import { Badge, Card, Space, Tag, theme, Typography } from 'antd';
import React from 'react';
import { AlgorithmItem } from '..';

const { useToken } = theme;
const { Text, Paragraph } = Typography;

interface AlgorithmSelectorProps {
  data: AlgorithmItem[];
  onChange: (id: string) => void;
  activeId: string;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ data, onChange, activeId }) => {
  const { token } = useToken();
  if (!data.length) return;

  const handleSelect = (id: string | any) => {
    onChange(id);
  };

  return (
    <div className="gpu-card-container">
      {data.map((item: AlgorithmItem) => (
        <Card
          key={item._id}
          title={item.name}
          size="small"
          style={{
            minWidth: 350,
            borderColor: activeId === item._id ? token.colorPrimary : token.colorBorder,
            borderStyle: 'solid',
            borderWidth: activeId === item._id ? '2px' : '1px',
            backgroundColor: token.colorBgContainer,
            borderRadius: '8px',
            color: token.colorTextSecondary,
          }}
          onClick={() => handleSelect(item._id)}
        >
          {/* {algo.description} */}
          <Space direction="vertical" size={3}>
            <Space direction="horizontal">
              <Badge status="default" text="演算法框架" />
              <Tag>{item.training_framework.name}</Tag>
            </Space>
            <Space direction="horizontal">
              <Badge status="default" text="檢測類型" />
              <Tag>{item.detect_type.tag_name.toUpperCase()}</Tag>
            </Space>
            <Space direction="horizontal">
              <Badge status="default" text="資料集格式" />
              <Tag>{item.training_framework.dataset_format.name}</Tag>
            </Space>
            <Paragraph style={{ marginTop: 10 }}>
              <Text type="secondary">{item.description}</Text>
            </Paragraph>
          </Space>
        </Card>
      ))}
    </div>
  );
};

export default AlgorithmSelector;
