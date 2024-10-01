/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 16:39:18
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-01 18:11:49
 * @FilePath: /PoseidonAI-Client/src/pages/CreateTask/components/AlgorithmSelector.tsx
 */
import { Badge, Card, Space, Tag, theme, Typography } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';
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
  if (!data.length) return null;

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
          <Space direction="vertical" size={3}>
            <Space direction="horizontal">
              <Badge
                status="default"
                text={
                  <FormattedMessage
                    id="pages.createTask.algorithmFramework"
                    defaultMessage="演算法框架"
                  />
                }
              />
              <Tag>{item.training_framework.display_name}</Tag>
            </Space>
            <Space direction="horizontal">
              <Badge
                status="default"
                text={
                  <FormattedMessage id="pages.createTask.detectType" defaultMessage="檢測類型" />
                }
              />
              <Tag>{item.detect_type.tag_name.toUpperCase()}</Tag>
            </Space>
            <Space direction="horizontal">
              <Badge
                status="default"
                text={
                  <FormattedMessage
                    id="pages.createTask.datasetFormat"
                    defaultMessage="資料集格式"
                  />
                }
              />
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
