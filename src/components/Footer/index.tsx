/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 08:28:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-18 11:57:28
 * @FilePath: /PoseidonAI-Client/src/components/Footer/index.tsx
 */
import { FireOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'PoseidonAI',
          title: 'PoseidonAI',
          href: '',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <FireOutlined />,
          href: '',
          blankTarget: true,
        },
        {
          key: 'EFC AI Develop Team',
          title: 'EFC AI Develop Team',
          href: '',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
