import { CaretRightOutlined, UndoOutlined } from '@ant-design/icons';
import { Affix, Button, Card, Space } from 'antd';
import React, { CSSProperties, useState } from 'react';
import { EvalStatus, FormValues } from '..';

interface ActionButtonCpmponentProps {
  buttonFixTop: boolean | undefined;
  status: EvalStatus | undefined;
  formValues: FormValues;
}

interface ActionButtonsProps {
  style?: CSSProperties;
  status: EvalStatus | undefined;
  formValues: FormValues;
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

const handleStartEval = (formValues: FormValues) => {
  console.log('Values: ', formValues);
};

const ActionButtonCpmponent: React.FC<ActionButtonCpmponentProps> = ({
  buttonFixTop,
  status,
  formValues,
}) => {
  const actionsButtons = (
    <Space size="small">
      <Button
        loading={false}
        size="large"
        icon={<UndoOutlined />}
        onClick={() => handleStartEval(formValues)} // 傳遞 true 表示這是 restart 操作
        shape="round"
        disabled={handleDisableButton('restart', status)}
      >
        Restart
      </Button>
      <Button
        loading={false}
        type="primary"
        size="large"
        icon={<CaretRightOutlined />}
        onClick={() => handleStartEval(formValues)} // 傳遞 false 表示這是 start 操作
        shape="round"
        disabled={handleDisableButton('start', status)}
      >
        Start
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

const ActionButtons: React.FC<ActionButtonsProps> = ({ style, status, formValues }) => {
  const [buttonFixTop, setButtonFixTop] = useState<boolean | undefined>(false);

  return (
    <Affix style={style} offsetTop={50} onChange={(v: boolean | undefined) => setButtonFixTop(v)}>
      <Space size="small" style={{ marginBottom: 15 }}>
        <ActionButtonCpmponent
          buttonFixTop={buttonFixTop}
          status={status}
          formValues={formValues}
        />
      </Space>
    </Affix>
  );
};

export default ActionButtons;
