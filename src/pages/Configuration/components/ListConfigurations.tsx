/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-24 19:40:43
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-07-28 15:00:43
 * @FilePath: /PoseidonAI-Client/src/pages/Configuration/components/ListConfigurations.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { deleteTrainingConfig } from '@/services/ant-design-pro/trainingConfig';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import { Button, Card, Modal, Table, Tag, message, theme } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { TrainingConfigItem } from '..';
import UserConfigDisplay from './UserConfigDisplay';

interface ListConfigurationsProps {
  data: TrainingConfigItem[];
  setRefresh: (s: boolean) => void;
}

const formatConfigData = (datas: TrainingConfigItem[]) => {
  return datas.map((data: TrainingConfigItem) => {
    return {
      key: data._id,
      name: data.name,
      training_framework: data.training_framework.display_name,
      dataset_format: data.training_framework.dataset_format.name,
      created_at: moment(data.created_at).format('YYYY-MM-DD HH:mm'),
      description: data.description,
      action: data._id,
    };
  });
};

const ListConfigurations: React.FC<ListConfigurationsProps> = ({ data, setRefresh }) => {
  const { useToken } = theme;
  const { token } = useToken();
  const [userConfigDisplayModelOpen, setUserConfigDisplayModelOpen] = useState<boolean>(false);
  const [userConfigDisplayData, setUserConfigDisplayData] = useState<
    TrainingConfigItem | undefined
  >();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');

  const handleDisplayDetails = (_id: string) => {
    const foundItem = data?.find((item) => item._id === _id);
    setUserConfigDisplayData(foundItem);
    setUserConfigDisplayModelOpen(true);
  };

  const handleConfirmDeleteConfig = (_id: string) => {
    // deleteTrainingConfig(_id);
    setSelectedConfigId(_id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfig = async (_id: string) => {
    setRefresh(false);
    try {
      const resp = await deleteTrainingConfig(_id);
      if (resp.code === 200) {
        message.success(
          <FormattedMessage id="pages.trainingConfig.deleteSuccess" defaultMessage="刪除成功" />,
        );
      } else {
        message.error(
          <FormattedMessage id="pages.trainingConfig.deleteError" defaultMessage="刪除失敗" /> +
            resp.msg,
        );
      }
    } catch (e: any) {
      message.error(
        <FormattedMessage id="pages.trainingConfig.deleteError" defaultMessage="刪除失敗" /> +
          e.message,
      );
    } finally {
      setSelectedConfigId('');
      setDeleteModalOpen(false);
    }
    setRefresh(true);
  };

  const columns = [
    {
      title: <FormattedMessage id="pages.trainingConfig.configName" defaultMessage="名稱" />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: (
        <FormattedMessage id="pages.trainingConfig.frameworkName" defaultMessage="演算法框架" />
      ),
      dataIndex: 'training_framework',
      key: 'training_framework',
      render: (frameworkName: string) => <Tag color="cyan">{frameworkName}</Tag>,
    },
    {
      title: (
        <FormattedMessage id="pages.trainingConfig.datasetFormat" defaultMessage="資料集格式" />
      ),
      dataIndex: 'dataset_format',
      key: 'dataset_format',
      render: (formatName: string) => <Tag color="geekblue">{formatName}</Tag>,
    },
    {
      title: <FormattedMessage id="pages.trainingConfig.description" defaultMessage="描述" />,
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: <FormattedMessage id="pages.trainingConfig.creaedDate" defaultMessage="創建日期" />,
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: <FormattedMessage id="pages.trainingConfig.actions" defaultMessage="操作" />,
      dataIndex: 'action',
      key: 'action',
      render: (_id: string) => (
        <>
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => handleDisplayDetails(_id)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleConfirmDeleteConfig(_id)}
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
          minWidth: '220px',
          flex: 1,
          backgroundColor: token.colorBgContainer,
          borderRadius: '8px',
          color: token.colorTextSecondary,
        }}
      >
        {data && <Table dataSource={formatConfigData(data)} columns={columns} />}
      </Card>
      <Modal
        style={{ minWidth: 900 }}
        title={
          <FormattedMessage
            id="pages.trainingConfig.detailedConfigInformation"
            defaultMessage="詳細配置資訊"
          />
        }
        footer={null}
        open={userConfigDisplayModelOpen}
        onOk={() => setUserConfigDisplayModelOpen(false)}
        onCancel={() => setUserConfigDisplayModelOpen(false)}
      >
        <UserConfigDisplay config={userConfigDisplayData} />
      </Modal>
      <Modal
        style={{ minWidth: 200 }}
        title={
          <FormattedMessage id="pages.trainingConfig.deleteConfig" defaultMessage="刪除配置" />
        }
        open={deleteModalOpen}
        onOk={() => handleDeleteConfig(selectedConfigId)}
        onCancel={() => {
          setDeleteModalOpen(false);
        }}
      >
        <FormattedMessage
          id="pages.trainingConfig.confirmDeleteConfig"
          defaultMessage="確定要刪除該訓練配置嗎？此操作將無法還原"
        />
      </Modal>
    </>
  );
};

export default ListConfigurations;
