/* eslint-disable */
/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-08 19:54:02
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-09-15 15:32:04
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import React from 'react';
import { TaskItem } from '../TrainingTask';
import ExportModelForm from './components/ExportModelForm';
import Tutorials from './components/tutorials/Tutorials';

export interface ExportModelProps {
  taskData: TaskItem | undefined;
}

const ExportModel: React.FC<ExportModelProps> = ({ taskData }) => {
  return (
    <>
      <ExportModelForm taskData={taskData} style={{ maxWidth: 900 }} />
      <Tutorials style={{ marginTop: 20, maxWidth: 900 }} />
    </>
  );
};

export default ExportModel;
