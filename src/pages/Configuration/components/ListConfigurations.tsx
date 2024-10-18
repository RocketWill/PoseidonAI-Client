/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-24 19:40:43
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-18 13:16:48
 * @FilePath: /PoseidonAI-Client/src/pages/Configuration/components/ListConfigurations.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { deleteTrainingConfig } from '@/services/ant-design-pro/trainingConfig';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import { Card, List, Modal, Typography, message } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { TrainingConfigItem } from '..';
import './ListConfigurations.css';
import UserConfigDisplay from './UserConfigDisplay';

interface ListConfigurationsProps {
  data: TrainingConfigItem[];
  setRefresh: (s: boolean) => void;
}

interface ConfigItem {
  key: string;
  name: string;
  training_framework: string;
  dataset_format: string;
  created_at: string;
  description: string;
  action: string;
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
  const [userConfigDisplayModelOpen, setUserConfigDisplayModelOpen] = useState<boolean>(false);
  const [userConfigDisplayData, setUserConfigDisplayData] = useState<
    TrainingConfigItem | undefined
  >();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const dataSource = formatConfigData(data).sort(
    (a: ConfigItem, b: ConfigItem) =>
      moment(b.created_at).valueOf() - moment(a.created_at).valueOf(),
  );

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
        dataSource={dataSource}
        renderItem={(item: ConfigItem) => (
          <List.Item>
            <Card
              className="config-card"
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              onClick={() => handleDisplayDetails(item.action)}
              cover={
                <div className="preview-image">
                  <Typography.Text style={{ fontWeight: 500 }} className="tag-top-right">
                    {item.training_framework}
                  </Typography.Text>
                  <img alt="preview" width="100%" src="/config-cover.webp" loading="lazy" />
                </div>
              }
              hoverable
              actions={[
                <InfoCircleOutlined key="view" onClick={() => handleDisplayDetails(item.action)} />,
                <DeleteOutlined
                  key="delete"
                  style={{ color: '#EF5A6F' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmDeleteConfig(item.action);
                  }}
                />,
              ]}
            >
              <Card.Meta title={item.name} description={item.description} style={{ height: 60 }} />
              <Typography.Text type="secondary" italic style={{ fontSize: '0.9em', marginTop: 10 }}>
                <FormattedMessage id="pages.dataset.display.uploaded" defaultMessage="上傳於" />{' '}
                {moment(item.created_at).fromNow()}
              </Typography.Text>
            </Card>
          </List.Item>
        )}
      />
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
