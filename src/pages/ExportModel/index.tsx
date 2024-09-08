/* eslint-disable */
/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-08 19:54:02
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-09-08 20:10:15
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import React from 'react';
import { TaskItem } from '../TrainingTask';

export interface ExportModelProps {
  taskData: TaskItem | undefined;
}

const ExportModel: React.FC<ExportModelProps> = ({ taskData }) => {
  return <h1>Export Model</h1>;
};

export default ExportModel;
