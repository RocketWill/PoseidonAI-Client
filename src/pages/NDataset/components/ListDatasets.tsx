/* eslint-disable */
/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-31 15:41:18
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-14 13:09:15
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/ListDatasets.tsx
 */

import { FormattedMessage } from '@umijs/max';
import { List, message, Modal } from 'antd';
import React, { useState } from 'react';

import { deleteDataset } from '@/services/ant-design-pro/dataset';
import { DatasetItem } from '..';
import DatasetDetails from './DatasetDetails';
import DatasetListItem from './DatasetListItem';

interface ListDatasetsProps {
  datasetData: DatasetItem[];
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

// 按創建日期將資料集排序
const sortDatasets = (datasets: DatasetItem[]) =>
  datasets.sort((a, b) => {
    const now = new Date().getTime();
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();

    return Math.abs(timeA - now) - Math.abs(timeB - now);
  });

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

  return (
    <>
      <List
        itemLayout="vertical"
        size="small"
        bordered={false}
        grid={{
          gutter: 4,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        style={{
          marginTop: 15,
          maxWidth: 1500,
        }}
        dataSource={sortDatasets(datasetData)}
        renderItem={(item: DatasetItem) => (
          <DatasetListItem
            item={item}
            handleEditDataset={handleEditDataset}
            setDeleteModalOpen={setDeleteModalOpen}
            setSelectedDatasetData={setSelectedDatasetData}
          />
        )}
      />
      <Modal
        style={{ minWidth: 1000 }}
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
        onCancel={() => setDeleteModalOpen(false)}
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
