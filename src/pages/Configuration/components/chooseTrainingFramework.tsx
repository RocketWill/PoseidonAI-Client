/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-25 09:46:30
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-01 17:55:50
 * @FilePath: /PoseidonAI-Client/src/pages/Configuration/components/chooseTrainingFramework.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { FormattedMessage } from '@umijs/max';
import { Badge, Button, Card, List, Space, Tag, theme, Typography } from 'antd';
import React, { useState } from 'react';
import { TrainingFrameworkItem } from '..';

interface ChooseTrainingFrameworkProps {
  trainingFrameworks: TrainingFrameworkItem[];
  setFrameWorkId: (id: string) => void;
}

const { Title, Text, Paragraph } = Typography;

const ChooseTrainingFramework: React.FC<ChooseTrainingFrameworkProps> = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  const { trainingFrameworks } = props;
  const [frameworkId, setFrameWorkId] = useState<string>('');
  const handleChooseFramework = (frameworkId: string) => {
    setFrameWorkId(frameworkId);
    props.setFrameWorkId(frameworkId);
  };

  return (
    <Card
      style={{
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
        backgroundColor: token.colorBgContainer,
        borderRadius: '8px',
        color: token.colorTextSecondary,
      }}
    >
      <Title level={4}>
        <FormattedMessage
          id="pages.trainingConfig.chooseTrainingFramework.chooseFramework"
          defaultMessage="選擇演算法框架"
        />
      </Title>
      {trainingFrameworks.length > 0 && (
        <List
          grid={{
            gutter: 24,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 3,
          }}
          dataSource={trainingFrameworks}
          renderItem={(item: TrainingFrameworkItem) => (
            <List.Item>
              <Card
                size="small"
                title={item.display_name}
                style={{
                  backgroundColor: token.colorBgContainer,
                  borderRadius: '8px',
                  color: token.colorTextSecondary,
                  borderColor: item._id === frameworkId ? token.colorPrimary : token.colorBorder,
                  borderStyle: 'solid',
                  borderWidth: item._id === frameworkId ? '2px' : '1px',
                }}
                onClick={() => handleChooseFramework(item._id)}
              >
                <Space direction="horizontal">
                  <Badge
                    status="success"
                    text={
                      <FormattedMessage
                        id="pages.trainingConfig.datasetFormat"
                        defaultMessage="資料集格式"
                      />
                    }
                  />
                  <Tag>{item.dataset_format.name}</Tag>
                </Space>
                <Paragraph style={{ marginTop: 10 }}>
                  <Text type="secondary">{item.description}</Text>
                </Paragraph>
                <Button onClick={() => handleChooseFramework(item._id)}>
                  <FormattedMessage
                    id="pages.trainingConfig.chooseTrainingFramework.choose"
                    defaultMessage="選擇"
                  />
                </Button>
              </Card>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default ChooseTrainingFramework;
