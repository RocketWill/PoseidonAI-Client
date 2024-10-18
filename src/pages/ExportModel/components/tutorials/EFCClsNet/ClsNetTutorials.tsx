/* eslint-disable */
/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-08 19:54:02
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-16 09:22:07
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/EFCClsNet/ClsNetTutorials.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { DeploymentUnitOutlined } from '@ant-design/icons';
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

const ClsNetTutorials: React.FC<TutorialsProps> = ({ style }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguages>('csharp');

  return (
    <Card style={style}>
      <Typography.Title level={4}>
        <DeploymentUnitOutlined style={{ marginRight: '8px' }} />
        模型部署
      </Typography.Title>
      <Typography.Paragraph>了解如何使用不同的程式語言部署 EFC 深度學習模型。</Typography.Paragraph>
      <Divider />

      <Typography.Title level={5}>選擇部署語言</Typography.Title>
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

export default ClsNetTutorials;
