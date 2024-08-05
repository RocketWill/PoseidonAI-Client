/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 16:39:18
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-31 14:38:51
 * @FilePath: /PoseidonAI-Client/src/pages/ModelTraining/components/GPUSelector.tsx
 */
import { Liquid } from '@ant-design/plots';
import { Card, Col, Row, Space, theme, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface GPUSelectorProps {
  onChange: (id: number) => void;
  activeId: number;
}

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
  {
    id: 2,
    name: 'NVIDIA GeForce RTX 3090',
    gpu_utilization: '12%',
    memory_utilization: '80%',
    temperature: '27°C',
    power_usage: '100W',
    fan_speed: '2000 RPM',
  },
];

const genConfig = (percent: number) => {
  return {
    tooltip: false,
    title: false,
    percent,
    width: 130,
    height: 130,
    style: {
      margin: '0 auto',
      outlineBorder: 3,
      outlineDistance: 2,
      waveLength: 50,
      fill: percent > 0.65 ? '#FF6969' : '#478CCF',
      textFill: percent > 0.55 ? '#FFFFFF' : '#5b5b5b',
      outlineStroke: percent > 0.65 ? '#FF6969' : '#478CCF',
    },
  };
};

const GPUSelector: React.FC<GPUSelectorProps> = ({ onChange, activeId }) => {
  const { useToken } = theme;
  const { token } = useToken();

  const getGpuSelections = (gpuData: any) =>
    gpuData.map((gpu: any) => {
      const percent = parseFloat(gpu.memory_utilization) / 100;
      const config = genConfig(percent);
      return (
        <Card
          title={gpu.name}
          key={gpu.id}
          className="gpu-card"
          style={{
            borderColor: activeId === gpu.id ? token.colorPrimary : token.colorBorder,
            borderStyle: 'solid',
            borderWidth: activeId === gpu.id ? '2px' : '1px',
            backgroundColor: token.colorBgContainer,
            borderRadius: '8px',
            color: token.colorTextSecondary,
            cursor: 'pointer',
            minWidth: 380,
          }}
          size="small"
          onClick={() => onChange(gpu.id)}
        >
          <Row gutter={[10, 20]} align="middle">
            <Col span={10}>
              <Liquid {...config} />
            </Col>
            <Col span={12}>
              <Space
                direction="vertical"
                size={3}
                style={{ display: 'flex', justifyContent: 'center', height: '100%' }}
              >
                <Text>
                  <strong>GPU Utilization:</strong> {gpu.gpu_utilization}
                </Text>
                <Text>
                  <strong>Memory Utilization:</strong> {gpu.memory_utilization}
                </Text>
                <Text>
                  <strong>Temperature:</strong> {gpu.temperature}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>
      );
    });

  return <div className="gpu-card-container">{getGpuSelections(gpuData)}</div>;
};

export default GPUSelector;
