/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 16:22:28
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-07-29 20:30:31
 * @FilePath: /PoseidonAI-Client/src/pages/ModelTraining/index.tsx
 */
import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import GpuState from './components/GpuStatus';

const ModelTraining: React.FC = () => {
  return (
    <PageContainer>
      <GpuState />
    </PageContainer>
  );
};

export default ModelTraining;
