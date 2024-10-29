/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-18 15:25:20
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-29 14:07:36
 * @FilePath: /PoseidonAI-Client/src/pages/Account/Center.tsx
 */
import { PageContainer } from '@ant-design/pro-components';
import { Card, Select, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
// import { useModel } from '@umijs/max';
import { getUserLogs } from '@/services/ant-design-pro/userLogs';
import { useUserActionLogger } from '@/utils/UserActionLoggerContext'; // 日志钩子

const { Option } = Select;
const { Text } = Typography;

interface LogViewerProps {
  data: any[];
}

const LogViewer: React.FC<LogViewerProps> = ({ data }) => {
  const [filteredLevels, setFilteredLevels] = useState<string[]>([]); // 多选过滤级别

  // 处理级别选择变更
  const handleLevelChange = (value: string[]) => {
    setFilteredLevels(value);
  };

  const filteredLogs = (
    filteredLevels.length > 0 ? data.filter((log) => filteredLevels.includes(log.level)) : data
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // 按时间排序，最近的在上面

  // 定义表格列
  const columns = [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={level === 'ERROR' ? 'red' : level === 'INFO' ? 'blue' : 'green'}>{level}</Tag>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(), // 转换为当前时区时间
    },
  ];

  return (
    <div>
      <Text strong style={{ marginRight: 10 }}>
        Filter by Log Level:
      </Text>
      <Select
        mode="multiple"
        allowClear
        placeholder="Select log levels"
        style={{ width: 300, marginBottom: 20 }}
        onChange={handleLevelChange}
      >
        <Option value="INFO">INFO</Option>
        <Option value="ERROR">ERROR</Option>
        <Option value="DEBUG">DEBUG</Option>
      </Select>

      <Table
        size="small"
        columns={columns}
        dataSource={filteredLogs}
        rowKey="id"
        pagination={{ pageSize: 50 }}
      />
    </div>
  );
};

const AccountCenter: React.FC = () => {
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};
  const [logs, setLogs] = useState<any[]>([]);
  const { sendLogs } = useUserActionLogger();

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
      <Card title="操作日志">
        <LogViewer data={logs} />
      </Card>
    </PageContainer>
  );
};

export default AccountCenter;
