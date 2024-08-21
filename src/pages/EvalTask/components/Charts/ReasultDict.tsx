/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-21 09:31:51
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-21 17:01:43
 * @FilePath: /PoseidonAI-Client/src/pages/EvalTask/components/Charts/ReasultDict.tsx
 */
import { Card, Col, Progress, Row, Space, Statistic, Typography } from 'antd';
import React, { CSSProperties } from 'react';
import { MetricsItem } from '../..';

interface ReasultDictProps {
  metrics: MetricsItem;
  style?: CSSProperties;
}

const conicColors = {
  '0%': '#0575E6', // 石蓝色（低精度）
  '100%': '#00F260', // 浅绿松石色（高精度）
};

const calculateF1 = (precision: number, recall: number) => {
  if (precision === 0 || recall === 0) {
    return 0;
  }
  return (2 * (precision * recall)) / (precision + recall);
};

const ReasultDict: React.FC<ReasultDictProps> = ({ metrics, style }) => {
  const { result_dict, parameters } = metrics;
  const { precision, recall } = result_dict;
  const { iou_thres, batch_size } = parameters;

  return (
    <Card style={{ width: '100%', ...style }}>
      <Row gutter={8}>
        <Col span={6}>
          <Space direction="vertical" size={0}>
            <Typography.Text strong>Parameters</Typography.Text>
            <Typography.Text type="secondary">{`IoU Threshold ${iou_thres}`}</Typography.Text>
            <Typography.Text type="secondary">{`Batch size ${batch_size}`}</Typography.Text>
          </Space>
        </Col>
        <Col span={6}>
          <Space direction="horizontal">
            <Statistic title="Precision" value={precision * 100} precision={2} suffix="%" />
            <span style={{ marginLeft: 10 }} />
            <Progress
              strokeLinecap="butt"
              type="circle"
              percent={precision * 100}
              size="small"
              showInfo={false}
              strokeColor={conicColors}
            />
          </Space>
        </Col>
        <Col span={6}>
          <Space direction="horizontal">
            <Statistic title="Recall" value={recall * 100} precision={2} suffix="%" />
            <span style={{ marginLeft: 10 }} />
            <Progress
              strokeLinecap="butt"
              type="circle"
              percent={recall * 100}
              size="small"
              showInfo={false}
              strokeColor={conicColors}
            />
          </Space>
        </Col>
        <Col span={6}>
          <Space direction="horizontal">
            <Statistic
              title="F1 Score"
              value={calculateF1(precision, recall) * 100}
              precision={2}
              suffix="%"
            />
            <span style={{ marginLeft: 10 }} />
            <Progress
              strokeLinecap="butt"
              type="circle"
              percent={calculateF1(precision, recall) * 100}
              size="small"
              showInfo={false}
              strokeColor={conicColors}
            />
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default ReasultDict;
