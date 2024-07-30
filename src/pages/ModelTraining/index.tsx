/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 16:22:28
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-30 17:07:18
 * @FilePath: /PoseidonAI-Client/src/pages/ModelTraining/index.tsx
 */
import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import TrainingConfigForm from './components/TrainingConfigForm';

import { TrainingFrameworkItem } from '../Configuration';

export interface DetectTypeItem {
  _id: string;
  name: string;
  tag_name: string;
  description: string;
}

export interface AlgorithmItem {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  detect_type: DetectTypeItem;
  training_framework: TrainingFrameworkItem;
}

const ModelTraining: React.FC = () => {
  return (
    <PageContainer>
      <TrainingConfigForm />
    </PageContainer>
  );
};

export default ModelTraining;
