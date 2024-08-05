/* eslint-disable */
/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-31 15:41:18
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-05 10:05:44
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/ListDatasets.tsx
 */
import { deleteDataset } from '@/services/ant-design-pro/dataset';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import { Button, Card, Modal, Table, Tag, message } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { DatasetFormatItem, DatasetItem } from '..';
import DatasetDetails from './DatasetDetails';

interface ListDatasetsProps {
  datasetData: DatasetItem[];
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const formatDataset = (datasetData: DatasetItem[]) =>
  datasetData.map((dataset: DatasetItem, i: number) => ({
    key: `${i}`,
    name: dataset.name,
    type: dataset.detect_type.name,
    classNames: dataset.class_names,
    datasetFormat: dataset.dataset_format.map((item: DatasetFormatItem) => item.name),
    createdAt: moment(dataset.created_at).format('YYYY-MM-DD HH:mm'),
    validImagesNum: dataset.valid_images_num,
    description: dataset.description,
    action: dataset,
  }));

const ListDatasets: React.FC<ListDatasetsProps> = ({ datasetData, setRefreshFlag }) => {
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedDatasetData, setSelectedDatasetData] = useState<DatasetItem | undefined>();

  const handleEditDataset = (dataset: DatasetItem) => {
    setSelectedDatasetData(dataset);
    setDetailModalOpen(true);
  };

  const handleDeleteDataset = async (datasetId: string | undefined) => {
    if (!datasetId) return;
    const result = await deleteDataset(datasetId);
    if (result.code === 200) {
      message.success(
        <FormattedMessage id="pages.dataset.display.deleteSuccess" defaultMessage="刪除成功" />,
      );
    } else {
      message.error(
        `${(
          <FormattedMessage id="pages.dataset.display.deleteFail" defaultMessage="刪除失敗" />
        )}: ${result.msg}`,
      );
    }
    setDeleteModalOpen(false);
    setRefreshFlag((prev) => !prev);
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
      title: <FormattedMessage id="pages.dataset.display.classNames" defaultMessage="類別" />,
      dataIndex: 'classNames',
      key: 'classNames',
      width: 150,
      render: (classNames: string[]) => (
        <>
          {classNames.map((className: string) => (
            <Tag key={className}>{className}</Tag>
          ))}
        </>
      ),
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
            onClick={() => {
              setSelectedDatasetData(dataset);
              setDeleteModalOpen(true);
            }}
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
      <Modal
        style={{ minWidth: 200 }}
        title={
          <FormattedMessage id="pages.dataset.display.deleteDataset" defaultMessage="刪除資料集" />
        }
        open={deleteModalOpen}
        onOk={() => handleDeleteDataset(selectedDatasetData?._id)}
        onCancel={() => {
          setDeleteModalOpen(false);
        }}
      >
        <FormattedMessage
          id="pages.dataset.display.confirmDeleteDataset"
          defaultMessage="確定要刪除該資料集嗎？此操作將無法還原"
        />
      </Modal>
    </>
  );
};

export default ListDatasets;
