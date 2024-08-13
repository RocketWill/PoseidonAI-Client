/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 15:16:17
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-13 15:51:03
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/DatasetSummary.tsx
 */

import { Card, Col, Row, Space, Typography } from 'antd'; // 引入 Ant Design 的組件
import React from 'react'; // 首先引入 React

// 引入專案內部的類型和組件
import { SummaryItem, TaskItem } from '..';
import CategoryStatisticsChart from './CategoryStatisticsChart';
import DatasetInstancePieChart from './DatasetInstancePieChart';
import StatisticsTable from './StatisticsTable';

// 定義 DatasetSummaryProps 的接口，描述組件的 props 結構
interface DatasetSummaryProps {
  taskData: TaskItem | undefined; // 任務數據，可為未定義
}

// 主 DatasetSummary 組件
const DatasetSummary: React.FC<DatasetSummaryProps> = ({ taskData }) => {
  // 如果沒有提供 taskData，則不渲染組件
  if (!taskData) return null;

  return (
    <>
      <Card size="small">
        {/* 水平排列餅圖和統計表格 */}
        <Space direction="horizontal">
          <DatasetInstancePieChart dataList={taskData.task_detail.summary as SummaryItem[]} />
          <StatisticsTable dataList={taskData.task_detail.summary as SummaryItem[]} />
        </Space>
      </Card>
      <Row gutter={16} style={{ marginTop: 15 }}>
        <Col span={12}>
          <Card size="small">
            <Typography.Text strong>Image Distribution</Typography.Text>
            <CategoryStatisticsChart
              dataList={taskData.task_detail.summary as SummaryItem[]}
              viewType="images"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card size="small">
            <Typography.Text strong>Instance Distribution</Typography.Text>
            <CategoryStatisticsChart
              dataList={taskData.task_detail.summary as SummaryItem[]}
              viewType="instances"
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DatasetSummary;
