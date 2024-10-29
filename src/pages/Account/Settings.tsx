/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-18 15:25:20
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-18 16:59:00
 * @FilePath: /PoseidonAI-Client/src/pages/Account/Settings.tsx
 */
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Result, Typography } from 'antd';
import React from 'react';

const AccountSettings: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  return (
    <PageContainer>
      <Result
        status="success"
        title={
          <>
            Welcome back <Typography.Title>{currentUser?.name}</Typography.Title>
          </>
        }
        subTitle="The page is coming soon. Stay tuned for more exciting content!"
      />
    </PageContainer>
  );
};

export default AccountSettings;
