/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-07 09:25:27
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-08 08:56:02
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/DetectTypes.tsx
 */
// DetectTypes.tsx
import { Card, List, theme, Typography } from 'antd';
import React, { useState } from 'react';
import { DetectTypeItem } from '..';

interface DetectTypesProps {
  data: DetectTypeItem[];
  onChange: (detectType: [string, string]) => void; // 接收的类型
}

const DetectTypes: React.FC<DetectTypesProps> = ({ data, onChange }) => {
  const { useToken } = theme;
  const { token } = useToken();
  const [activeId, setActiveId] = useState<string | undefined>();

  const handleSelectType = (item: DetectTypeItem) => {
    setActiveId(item._id);
    onChange([item._id, item.tag_name]); // 调用 onChange 更新检测类型
  };

  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      style={{ minHeight: 300 }}
      renderItem={(item) => {
        let imageSrc = '/classify.png';
        if (item.tag_name === 'detect') {
          imageSrc = '/detect.png';
        }
        if (item.tag_name === 'segment') {
          imageSrc = '/segment.png';
        }
        return (
          <List.Item>
            <Card
              size="small"
              hoverable
              cover={<img src={imageSrc} alt={item.tag_name} />}
              onClick={() => handleSelectType(item)}
              style={{
                borderColor: activeId === item._id ? token.colorPrimary : token.colorBorder,
                borderStyle: 'solid',
                borderWidth: activeId === item._id ? '2px' : '1px',
                backgroundColor: token.colorBgContainer,
                borderRadius: '8px',
                color: token.colorTextSecondary,
                cursor: 'pointer',
              }}
            >
              <Typography.Text strong style={{ display: 'flex', justifyContent: 'center' }}>
                {item.tag_name.replace(/^./, item.tag_name[0].toUpperCase())}
              </Typography.Text>
            </Card>
          </List.Item>
        );
      }}
    />
  );
};

export default DetectTypes;
