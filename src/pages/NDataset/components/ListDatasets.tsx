/* eslint-disable */
/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-31 15:41:18
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-31 17:11:15
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/ListDatasets.tsx
 */

import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import { Button, Table, Tag } from 'antd';
import React from 'react';

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
    title: <FormattedMessage id="pages.dataset.display.datasetFormat" defaultMessage="資料格式" />,
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
    render: (datasetId: string) => (
      <>
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          // onClick={() => handleEditDataset(datasetId)}
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

const ListDatasets: React.FC = () => {
  return <Table dataSource={showDatasets} columns={columns} />;
};

export default ListDatasets;
