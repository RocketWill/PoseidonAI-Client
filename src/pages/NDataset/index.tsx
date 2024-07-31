/* eslint-disable */
/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-31 15:34:59
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-31 17:11:07
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/index.tsx
 */
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

import { listDataset } from '@/services/ant-design-pro/dataset';
import { listDatasetFormats } from '@/services/ant-design-pro/datasetFormat';
import { listDetectTypes } from '@/services/ant-design-pro/detectType';

export interface DatasetItem {
  _id: string;
  name: string;
  detect_type_id: string;
  detect_type: DetectTypeItem;
  created_at: string;
  valid_images_num: number;
  description: string;
  dataset_format_ids: string[];
  dataset_format: DatasetFormatItem[];
  image_files: string[];
  label_file: string;
}

export interface DetectTypeItem {
  _id: string;
  name: string;
  tag_name: string;
  description: string;
  created_at: string;
}

export interface DatasetFormatItem {
  _id: string;
  name: string;
  description: string;
  created_at: string;
}

const fetchData = async (
  setDetectTypeData: (data: DetectTypeItem[]) => void,
  setDatasetFormatData: (data: DatasetFormatItem[]) => void,
  setDatasetData: (data: DatasetItem[]) => void,
): Promise<void> => {
  const detectTypesResp = await listDetectTypes();
  const datasetFormatsResp = await listDatasetFormats();
  const datasetResp = await listDataset();
  const detectTypeData = detectTypesResp.results;
  const datasetFormatData = datasetFormatsResp.results;
  const datasetData = datasetResp.results;
  setDetectTypeData(detectTypeData);
  setDatasetFormatData(datasetFormatData);
  setDatasetData(datasetData);
};

const NDataset: React.FC = () => {
  const [detectTypeData, setDetectTypeData] = useState<DetectTypeItem[]>([]);
  const [datasetFormatData, setDatasetFormatData] = useState<DatasetFormatItem[]>([]);
  const [datasetData, setDatasetData] = useState<DatasetItem[]>([]);
  console.log(detectTypeData, datasetFormatData, datasetData);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <FormattedMessage id="pages.dataset.table.createdDataset" defaultMessage="已創建的資料集" />
      ),
      children: <>1</>,
    },
    {
      key: '2',
      label: (
        <FormattedMessage id="pages.dataset.table.createDataset" defaultMessage="建立新的資料集" />
      ),
      children: <>2</>,
    },
  ];

  useEffect(() => {
    fetchData(setDetectTypeData, setDatasetFormatData, setDatasetData);
  }, []);

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1" items={items} />
    </PageContainer>
  );
};

export default NDataset;
