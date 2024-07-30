/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-24 19:40:43
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-30 14:57:15
 * @FilePath: /PoseidonAI-Client/src/pages/Configuration/index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import {
  listTrainingFrameworks,
  listUserTrainingConfigs,
} from '@/services/ant-design-pro/trainingConfig';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import CreateConfiguration from './components/CreateConfiguration';
import ListConfigurations from './components/ListConfigurations';

export interface DatasetFormatItem {
  _id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface TrainingFrameworkItem {
  _id: string;
  name: string;
  created_at: string;
  description: string;
  dataset_format_id: string;
  dataset_format: DatasetFormatItem;
}

export interface TrainingConfigItem {
  _id: string;
  name: string;
  user_id: string;
  created_at: string;
  description: string;
  save_key: string;
  training_framework_id: string;
  training_framework: TrainingFrameworkItem;
  args_data: any;
}

const Configuration: React.FC = () => {
  const [configData, setConfigData] = useState<TrainingConfigItem[]>([]);
  const [frameworkData, setFrameworkData] = useState<TrainingFrameworkItem[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <FormattedMessage
          id="pages.trainingConfig.index.createdConfigs"
          defaultMessage="已創建的配置"
        />
      ),
      children: <ListConfigurations data={configData} setRefresh={setRefresh} />,
    },
    {
      key: '2',
      label: (
        <FormattedMessage
          id="pages.trainingConfig.index.createNewConfigs"
          defaultMessage="建立新的配置"
        />
      ),
      children: <CreateConfiguration data={frameworkData} setRefresh={setRefresh} />,
    },
  ];

  useEffect(() => {
    const fetchTrainingConfigkData = async () => {
      try {
        const data = await listUserTrainingConfigs();
        setConfigData(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const fetchTrainingFrameworkData = async () => {
      try {
        const data = await listTrainingFrameworks();
        setFrameworkData(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTrainingConfigkData();
    fetchTrainingFrameworkData();
  }, [refresh]);

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1" items={items} />
    </PageContainer>
  );
};

export default Configuration;
