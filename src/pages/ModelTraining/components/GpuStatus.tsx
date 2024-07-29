/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 16:39:18
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-07-29 21:23:55
 * @FilePath: /PoseidonAI-Client/src/pages/ModelTraining/components/GpuStatus.tsx
 */
import { Liquid } from '@ant-design/plots';
import { Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const gpuData = [
  {
    id: 0,
    name: 'NVIDIA GeForce RTX 4060 Laptop GPU',
    gpu_utilization: '6%',
    memory_utilization: '16%',
    temperature: '47°C',
    power_usage: '75W',
    fan_speed: '1500 RPM',
  },
  {
    id: 1,
    name: 'NVIDIA GeForce RTX 4090',
    gpu_utilization: '12%',
    memory_utilization: '30%',
    temperature: '52°C',
    power_usage: '100W',
    fan_speed: '2000 RPM',
  },
];

const GpuState: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {gpuData.map((gpu) => {
        const config = {
          tooltip: false,
          title: false,
          mouseenter: false,
          percent: parseFloat(gpu.memory_utilization) / 100,
          width: 150,
          height: 150,
          style: {
            margin: '0 auto',
            outlineBorder: 4,
            outlineDistance: 8,
            waveLength: 128,
          },
        };
        return (
          <Card key={gpu.id} style={{ width: 400, borderRadius: '8px' }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text>{gpu.name}</Text>
              </Col>
              <Col span={12}>
                <Liquid {...config} />
              </Col>
              <Col span={12}>
                <Space direction="vertical">
                  <Text>
                    <strong>GPU Utilization:</strong> {gpu.gpu_utilization}
                  </Text>
                  <Text>
                    <strong>Memory Utilization:</strong> {gpu.memory_utilization}
                  </Text>
                  <Text>
                    <strong>Temperature:</strong> {gpu.temperature}
                  </Text>
                  <Text>
                    <strong>Power Usage:</strong> {gpu.power_usage}
                  </Text>
                  <Text>
                    <strong>Fan Speed:</strong> {gpu.fan_speed}
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>
        );
      })}
    </div>
  );
};

export default GpuState;
