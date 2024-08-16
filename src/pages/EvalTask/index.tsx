/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 08:56:13
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-15 16:39:48
 * @FilePath: /PoseidonAI-Client/src/pages/EvalTask/index.tsx
 */
import React, { useState } from 'react';
import { TaskItem } from '../TrainingTask';
import TaskDetailsDescription from '../TrainingTask/components/TaskDetailsDescription';
import ActionButtons from './components/ActionButtons';
import ModelInferenceForm from './components/ModelInferenceForm';

interface EvalTaskProps {
  taskData: TaskItem;
}

export interface FormValues {
  iou: number;
  gpu: number;
  batchSize: number;
}

export type EvalStatus =
  | 'IDLE'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'ERROR'
  | 'REVOKED';

const initialState: FormValues = {
  iou: 0.3,
  gpu: 0,
  batchSize: 1,
};

const EvalTask: React.FC<EvalTaskProps> = ({ taskData }) => {
  const [formValues, setFormValues] = useState<FormValues>(initialState);

  return (
    <>
      <ActionButtons status={undefined} formValues={formValues} />
      <TaskDetailsDescription taskData={taskData} status={undefined} />
      <ModelInferenceForm
        styles={{ marginTop: 15 }}
        formValues={formValues}
        setFormValues={setFormValues}
      />
    </>
  );
};

export default EvalTask;
