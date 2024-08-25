/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-20 08:55:03
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-08-25 16:17:58
 * @FilePath: /PoseidonAI-Client/src/pages/VisualizeVal/components/ActionButtons.tsx
 */
import { CaretRightOutlined, UndoOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import { Affix, Button, Card, Space } from 'antd';
import React, { CSSProperties, useState } from 'react';
import { FormValues, VisAction, VisStatus } from '..';

interface ActionButtonCpmponentProps {
  buttonFixTop: boolean | undefined;
  status: VisStatus | undefined;
  formValues: FormValues;
  handleStartVis: (body: FormValues, action: VisAction) => void;
  isVising: boolean;
  currentAction: VisAction;
}

interface ActionButtonsProps {
  style?: CSSProperties;
  status: VisStatus | undefined;
  formValues: FormValues;
  handleStartVis: (body: FormValues, action: VisAction) => void;
  isVising: boolean;
  currentAction: VisAction;
}

const handleDisableButton = (type: 'start' | 'restart', status: VisStatus | undefined): boolean => {
  if (type === 'start') {
    return !(status === undefined || status === 'IDLE');
  }
  return !(
    status === 'ERROR' ||
    status === 'FAILURE' ||
    status === 'REVOKED' ||
    status === 'SUCCESS'
  );
};

const ActionButtonCpmponent: React.FC<ActionButtonCpmponentProps> = ({
  buttonFixTop,
  status,
  formValues,
  handleStartVis,
  isVising,
  currentAction,
}) => {
  const actionsButtons = (
    <Space size="small">
      <Button
        loading={currentAction === 'start' && isVising === true ? true : false}
        type="primary"
        size="large"
        icon={<CaretRightOutlined />}
        onClick={() => handleStartVis(formValues, 'start')} // 傳遞 false 表示這是 start 操作
        shape="round"
        disabled={handleDisableButton('start', status)}
      >
        <FormattedMessage id="pages.trainingTask.start" defaultMessage="Start" />
      </Button>
      <Button
        loading={currentAction === 'restart' && isVising === true ? true : false}
        size="large"
        icon={<UndoOutlined />}
        onClick={() => handleStartVis(formValues, 'restart')} // 傳遞 true 表示這是 restart 操作
        shape="round"
        disabled={handleDisableButton('restart', status)}
      >
        <FormattedMessage id="pages.trainingTask.restart" defaultMessage="Restart" />
      </Button>
    </Space>
  );

  return buttonFixTop ? (
    <Card size="small" bordered={false} style={{ boxShadow: 'none' }}>
      {actionsButtons}
    </Card>
  ) : (
    actionsButtons
  );
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  style,
  status,
  formValues,
  handleStartVis,
  isVising,
  currentAction,
}) => {
  const [buttonFixTop, setButtonFixTop] = useState<boolean | undefined>(false);

  return (
    <Affix style={style} offsetTop={50} onChange={(v: boolean | undefined) => setButtonFixTop(v)}>
      <Space size="small" style={{ marginBottom: 15 }}>
        <ActionButtonCpmponent
          buttonFixTop={buttonFixTop}
          status={status}
          formValues={formValues}
          handleStartVis={handleStartVis}
          isVising={isVising}
          currentAction={currentAction}
        />
      </Space>
    </Affix>
  );
};

export default ActionButtons;
