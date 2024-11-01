/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-18 15:25:20
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-11-01 13:26:01
 * @FilePath: /PoseidonAI-Client/src/pages/Account/Center.tsx
 */
import { getUserLogs } from '@/services/ant-design-pro/userLogs';
import { useUserActionLogger } from '@/utils/UserActionLoggerContext';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Badge, Card, Select, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;
const { Text } = Typography;

interface LogViewerProps {
  data: any[];
}

const LogViewer: React.FC<LogViewerProps> = ({ data }) => {
  const [filteredLevels, setFilteredLevels] = useState<string[]>([]);
  const intl = useIntl();

  const handleLevelChange = (value: string[]) => {
    setFilteredLevels(value);
  };

  const filteredLogs = (
    filteredLevels.length > 0 ? data.filter((log) => filteredLevels.includes(log.level)) : data
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.account.center.level', defaultMessage: '級別' }),
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag
          color={
            level === 'FATAL'
              ? 'purple'
              : level === 'ERROR'
              ? 'red'
              : level === 'INFO'
              ? 'blue'
              : 'green'
          }
        >
          {level}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.account.center.action', defaultMessage: '操作' }),
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: intl.formatMessage({ id: 'pages.account.center.message', defaultMessage: '訊息' }),
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: intl.formatMessage({
        id: 'pages.account.center.timestamp',
        defaultMessage: '時間戳',
      }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
  ];

  return (
    <div>
      <Text strong style={{ marginRight: 10 }}>
        <FormattedMessage
          id="pages.account.center.filterByLevel"
          defaultMessage="按日誌級別篩選："
        />
      </Text>
      <Select
        mode="multiple"
        allowClear
        placeholder={intl.formatMessage({
          id: 'pages.account.center.selectPlaceholder',
          defaultMessage: '選擇日誌級別',
        })}
        style={{ width: 300, marginBottom: 20 }}
        onChange={handleLevelChange}
      >
        <Option value="FATAL">
          <Badge color="purple" style={{ marginRight: 8 }} />
          {intl.formatMessage({ id: 'pages.account.center.level.FATAL', defaultMessage: 'FATAL' })}
        </Option>
        <Option value="ERROR">
          <Badge color="red" style={{ marginRight: 8 }} />
          {intl.formatMessage({ id: 'pages.account.center.level.ERROR', defaultMessage: 'ERROR' })}
        </Option>
        <Option value="INFO">
          <Badge color="blue" style={{ marginRight: 8 }} />
          {intl.formatMessage({ id: 'pages.account.center.level.INFO', defaultMessage: 'INFO' })}
        </Option>
        <Option value="DEBUG">
          <Badge color="green" style={{ marginRight: 8 }} />
          {intl.formatMessage({ id: 'pages.account.center.level.DEBUG', defaultMessage: 'DEBUG' })}
        </Option>
      </Select>

      <Table size="small" columns={columns} dataSource={filteredLogs} rowKey="id" />
    </div>
  );
};

const AccountCenter: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const { sendLogs } = useUserActionLogger();
  const intl = useIntl();

  const fetchData = async () => {
    const resp = await getUserLogs();
    setLogs(resp.results);
    console.log(resp);
  };

  useEffect(() => {
    sendLogs();
    fetchData();
  }, []);

  return (
    <PageContainer>
      <Card
        title={intl.formatMessage({
          id: 'pages.account.center.cardTitle',
          defaultMessage: '操作日誌',
        })}
        style={{ maxWidth: 1000 }}
      >
        <LogViewer data={logs} />
      </Card>
    </PageContainer>
  );
};

export default AccountCenter;
