/* eslint-disable */
/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-31 15:41:18
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-07-31 20:40:49
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/ListDatasets.tsx
 */

import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import { Button, Card, Modal, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { DatasetFormatItem, DatasetItem } from '..';
import DatasetDetails from './DatasetDetails';

interface ListDatasetsProps {
  datasetData: DatasetItem[];
}

const formatDataset = (datasetData: DatasetItem[]) =>
  datasetData.map((dataset: DatasetItem, i: number) => ({
    key: `${i}`,
    name: dataset.name,
    type: dataset.detect_type.name,
    datasetFormat: dataset.dataset_format.map((item: DatasetFormatItem) => item.name),
    createdAt: moment(dataset.created_at).format('YYYY-MM-DD HH:mm'),
    validImagesNum: dataset.valid_images_num,
    description: dataset.description,
    action: dataset,
  }));

const ListDatasets: React.FC<ListDatasetsProps> = ({ datasetData }) => {
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [selectedDatasetData, setSelectedDatasetData] = useState<DatasetItem | undefined>();

  const handleEditDataset = (dataset: DatasetItem) => {
    setSelectedDatasetData(dataset);
    setDetailModalOpen(true);
  };

  const columns = [
    {
      title: <FormattedMessage id="pages.dataset.display.name" defaultMessage="名稱" />,
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: <FormattedMessage id="pages.dataset.display.detectTypes" defaultMessage="檢測類型" />,
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => <Tag>{type.toUpperCase()}</Tag>,
    },
    {
      title: (
        <FormattedMessage id="pages.dataset.display.datasetFormat" defaultMessage="資料格式" />
      ),
      dataIndex: 'datasetFormat',
      key: 'datasetFormat',
      width: 200,
      render: (formats: string[]) => (
        <>
          {formats.map((format: string, i: number) => (
            <Tag key={`${format}-${i}`}>{format.toUpperCase()}</Tag>
          ))}
        </>
      ),
    },
    {
      title: (
        <FormattedMessage id="pages.dataset.display.validImages" defaultMessage="帶標注圖片數量" />
      ),
      dataIndex: 'validImagesNum',
      key: 'validImagesNum',
      width: 120,
    },
    {
      title: <FormattedMessage id="pages.dataset.display.createdAt" defaultMessage="創建日期" />,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
    },
    {
      title: <FormattedMessage id="pages.dataset.display.description" defaultMessage="描述" />,
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: <FormattedMessage id="pages.dataset.display.action" defaultMessage="操作" />,
      key: 'action',
      dataIndex: 'action',
      width: 120,
      render: (dataset: DatasetItem) => (
        <>
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => handleEditDataset(dataset)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            // onClick={() => {
            //   deleteDatasetIdRef.current = datasetId;
            //   setDeleteModalOpen(true);
            // }}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Card
        style={{
          padding: '16px 19px',
          minWidth: '500px',
          flex: 1,
          borderRadius: '8px',
          marginTop: 15,
        }}
      >
        <Table dataSource={formatDataset(datasetData)} columns={columns} />
      </Card>
      <Modal
        style={{ minWidth: 800 }}
        footer={null}
        title={
          <FormattedMessage id="pages.dataset.display.datasetDetail" defaultMessage="資料集詳情" />
        }
        open={detailModalOpen}
        onOk={() => setDetailModalOpen(false)}
        onCancel={() => setDetailModalOpen(false)}
      >
        <DatasetDetails dataset={selectedDatasetData} />
      </Modal>
    </>
  );
};

export default ListDatasets;
