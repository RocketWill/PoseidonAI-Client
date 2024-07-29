/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 16:39:18
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-29 17:16:34
 * @FilePath: /PoseidonAI-Client/src/pages/ModelTraining/components/GpuStatus.tsx
 */
import { Liquid } from '@ant-design/plots';
import React from 'react';

import { Card, Space, Typography } from 'antd';
const { Text } = Typography;

// [{'name': 'NVIDIA GeForce RTX 4060 Laptop GPU', 'gpu_utilization': '6 %', 'memory_utilization': '16 %', 'temperature': '47 C'}]

const GpuState: React.FC = () => {
  const config = {
    percent: 0.16,
    width: 200,
    height: 200,
    style: {
      outlineBorder: 4,
      outlineDistance: 8,
      waveLength: 108,
    },
  };
  return (
    <Card style={{ maxWidth: 600 }}>
      <Space direction="horizontal">
        <Liquid {...config} />
        <Space direction="vertical">
          <Text>Name: NVIDIA GeForce RTX 4060 Laptop GPU</Text>
          <Text>memory_utilization: 16 %</Text>
          <Text>GPU Utilization: 6%</Text>
          <Text>Temperature: 47</Text>
        </Space>
      </Space>
    </Card>
  );
};

export default GpuState;
