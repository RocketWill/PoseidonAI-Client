/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-20 08:55:03
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-31 11:45:58
 * @FilePath: /PoseidonAI-Client/src/pages/EvalTask/components/ActionButtons.tsx
 */
import { CaretRightOutlined, UndoOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import { Affix, Button, Card, Space } from 'antd';
import React, { CSSProperties, useState } from 'react';
import { EvalAction, EvalStatus, FormValues } from '..';

interface ActionButtonCpmponentProps {
  buttonFixTop: boolean | undefined;
  status: EvalStatus | undefined;
  formValues: FormValues;
  handleStartEval: (body: FormValues, action: EvalAction) => void;
  isEvaling: boolean;
  currentAction: EvalAction;
}

interface ActionButtonsProps {
  style?: CSSProperties;
  status: EvalStatus | undefined;
  formValues: FormValues;
  handleStartEval: (body: FormValues, action: EvalAction) => void;
  isEvaling: boolean;
  currentAction: EvalAction;
}

const handleDisableButton = (
  type: 'start' | 'restart',
  status: EvalStatus | undefined,
): boolean => {
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
  handleStartEval,
  isEvaling,
  currentAction,
}) => {
  const actionsButtons = (
    <Space size="small">
      <Button
        loading={currentAction === 'start' && isEvaling === true ? true : false}
        type="primary"
        size="large"
        icon={<CaretRightOutlined />}
        onClick={() => handleStartEval(formValues, 'start')}
        shape="round"
        disabled={handleDisableButton('start', status)}
      >
        <FormattedMessage id="pages.evalTask.start" defaultMessage="Start Evaluation" />
      </Button>
      <Button
        loading={currentAction === 'restart' && isEvaling === true ? true : false}
        size="large"
        icon={<UndoOutlined />}
        onClick={() => handleStartEval(formValues, 'restart')}
        shape="round"
        disabled={handleDisableButton('restart', status)}
      >
        <FormattedMessage id="pages.evalTask.restart" defaultMessage="Restart Evaluation" />
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
  handleStartEval,
  isEvaling,
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
          handleStartEval={handleStartEval}
          isEvaling={isEvaling}
          currentAction={currentAction}
        />
      </Space>
    </Affix>
  );
};

export default ActionButtons;
