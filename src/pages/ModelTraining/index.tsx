/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 16:22:28
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-29 16:40:15
 * @FilePath: /PoseidonAI-Client/src/pages/ModelTraining/index.tsx
 */
import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import GpuState from './components/GpuStatus';

const ModelTraining: React.FC = () => {
  return (
    <PageContainer>
      Model Training
      <GpuState />
    </PageContainer>
  );
};

export default ModelTraining;
