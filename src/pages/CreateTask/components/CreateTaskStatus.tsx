/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-05 14:36:12
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-05 16:03:34
 * @FilePath: /PoseidonAI-Client/src/pages/CreateTask/components/CreateTaskStatus.tsx
 */
import { Modal, Progress, Typography } from 'antd';
import React from 'react';
import { CreateTaskStateItem } from '..';

interface CreateTaskStatusProps {
  state: CreateTaskStateItem | undefined;
}

const { Text } = Typography;

const CreateTaskStatus: React.FC<CreateTaskStatusProps> = ({ state }) => {
  if (!state) return;
  const open = state !== undefined;
  return (
    <Modal
      open={open}
      footer={null}
      title={
        <div>
          <Text>{`${state.description} `}</Text>
          <Text type="secondary">{`(${state.current}/${state.total})`}</Text>
        </div>
      }
    >
      <Progress
        style={{ marginTop: 20 }}
        percent={Math.ceil((state.current / state.total) * 100)}
        percentPosition={{ align: 'center', type: 'inner' }}
        size={[400, 20]}
      />
    </Modal>
  );
};

export default CreateTaskStatus;
