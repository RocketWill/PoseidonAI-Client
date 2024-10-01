/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-28 10:29:50
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-01 18:11:14
 * @FilePath: /PoseidonAI-Client/src/pages/Configuration/components/UserConfigDisplay.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { FormattedMessage } from '@umijs/max';
import { Card, Descriptions, Divider, Tag, Typography } from 'antd';
import moment from 'moment';
import { TrainingConfigItem } from '..';

const { Text } = Typography;

interface UserConfigDisplayProps {
  config: TrainingConfigItem | undefined | any;
}

const UserConfigDisplay = ({ config }: UserConfigDisplayProps) => {
  const { args_data, created_at, description, training_framework } = config;

  return (
    <Card style={{ margin: 20 }}>
      <Descriptions
        title={
          <FormattedMessage id="pages.trainingConfig.basicInformation" defaultMessage="基本資訊" />
        }
        bordered
        column={2}
        size="small"
      >
        <Descriptions.Item
          label={
            <FormattedMessage id="pages.trainingConfig.creaedDate" defaultMessage="創建日期" />
          }
        >
          {moment(created_at).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <FormattedMessage id="pages.trainingConfig.frameworkName" defaultMessage="演算法框架" />
          }
        >
          <Tag color="cyan">{training_framework.display_name}</Tag>
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <FormattedMessage id="pages.trainingConfig.datasetFormat" defaultMessage="資料集格式" />
          }
        >
          <Tag color="geekblue">{training_framework.dataset_format.name}</Tag>
        </Descriptions.Item>
        <Descriptions.Item
          label={<FormattedMessage id="pages.trainingConfig.description" defaultMessage="描述" />}
        >
          {description}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions
        title={
          <FormattedMessage id="pages.trainingConfig.trainingArgs" defaultMessage="訓練參數" />
        }
        bordered
        column={1}
        size="small"
      >
        {Object.entries(args_data).map(([key, value]: [string, any]) => (
          <Descriptions.Item label={key} key={key} labelStyle={{ width: '250px' }}>
            <Text code>{Array.isArray(value) ? JSON.stringify(value) : value.toString()}</Text>
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
};

export default UserConfigDisplay;
