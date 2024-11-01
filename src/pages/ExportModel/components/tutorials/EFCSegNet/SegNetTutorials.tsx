/* eslint-disable */
/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-08 19:54:02
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-31 13:16:51
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/EFCSegNet/SegNetTutorials.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { DeploymentUnitOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Card, Divider, Radio, Typography } from 'antd';
import React, { CSSProperties, useState } from 'react';
import CppDemo from './CppDemo';
import CSharpDemo from './CSharpDemo';
import PythonDemo from './PythonDemo';

interface TutorialsProps {
  style: CSSProperties | undefined;
}
type SupportedLanguages = 'python' | 'csharp' | 'cpp';

const demoContent = {
  python: <PythonDemo />,
  csharp: <CSharpDemo />,
  cpp: <CppDemo />,
};

const SetNetTutorials: React.FC<TutorialsProps> = ({ style }) => {
  const intl = useIntl();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguages>('csharp');

  return (
    <Card style={style}>
      <Typography.Title level={4}>
        <DeploymentUnitOutlined style={{ marginRight: '8px' }} />
        <FormattedMessage
          id="pages.exportModel.tutorial.modelDeployment"
          defaultMessage="模型部署"
        />
      </Typography.Title>
      <Typography.Paragraph>
        <FormattedMessage
          id="pages.exportModel.tutorial.deploymentDescription"
          defaultMessage="了解如何使用不同的程式語言部署 EFC 深度學習模型。"
        />
      </Typography.Paragraph>
      <Divider />

      <Typography.Title level={5}>
        <FormattedMessage
          id="pages.exportModel.tutorial.selectLanguage"
          defaultMessage="選擇部署語言"
        />
      </Typography.Title>
      <Radio.Group
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        buttonStyle="solid"
      >
        <Radio.Button value="python">Python</Radio.Button>
        <Radio.Button value="csharp">C#</Radio.Button>
        <Radio.Button value="cpp">C++</Radio.Button>
      </Radio.Group>

      <Divider />

      {demoContent[selectedLanguage]}
    </Card>
  );
};

export default SetNetTutorials;
