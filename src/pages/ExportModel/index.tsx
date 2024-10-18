/* eslint-disable */
/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-08 19:54:02
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-16 09:39:26
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import React from 'react';
import { TaskItem } from '../TrainingTask';
import ExportModelForm from './components/ExportModelForm';
import ClsNetTutorials from './components/tutorials/EFCClsNet/ClsNetTutorials';
import DetNetTutorials from './components/tutorials/EFCDetNet/DetNetTutorials';
import SetNetTutorials from './components/tutorials/EFCSegNet/SegNetTutorials';

export interface ExportModelProps {
  taskData: TaskItem | undefined;
}

const ExportModel: React.FC<ExportModelProps> = ({ taskData }) => {
  const detectTypeName: string = taskData?.task_detail.algorithm.detect_type.tag_name || '';
  let tutorialsComponent;
  switch (detectTypeName) {
    case 'classify':
      tutorialsComponent = <ClsNetTutorials style={{ marginTop: 20, maxWidth: 900 }} />;
      break;
    case 'detect':
      tutorialsComponent = <DetNetTutorials style={{ marginTop: 20, maxWidth: 900 }} />;
      break;
    case 'segment':
      tutorialsComponent = <SetNetTutorials style={{ marginTop: 20, maxWidth: 900 }} />;
      break;
    default:
      tutorialsComponent = <DetNetTutorials style={{ marginTop: 20, maxWidth: 900 }} />;
  }

  return (
    <>
      <ExportModelForm taskData={taskData} style={{ maxWidth: 900 }} />
      {tutorialsComponent}
    </>
  );
};

export default ExportModel;
