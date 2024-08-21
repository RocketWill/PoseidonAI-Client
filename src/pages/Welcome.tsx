import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: any;
  index: number;
  desc: any;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        <FormattedMessage id="page.welcome.learnMore" defaultMessage="了解更多" /> {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        styles={{
          body: {
            backgroundImage:
              initialState?.settings?.navTheme === 'realDark'
                ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
          },
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            <FormattedMessage id="page.welcome.title" defaultMessage="歡迎使用 PoseidonAI" />
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            <FormattedMessage
              id="page.welcome.description"
              defaultMessage="PoseidonAI 是一款由 EFC AI develop team 開發，專為深度學習領域設計的先進工具，旨在幫助開發者和研究人員更高效地進行模型的訓練和驗證。無論是初學者還是經驗豐富的專業人士，PoseidonAI 都提供了直觀且強大的功能，以簡化複雜的深度學習任務。"
            />
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href="https://umijs.org/docs/introduce/introduce"
              title={
                <FormattedMessage
                  id="page.welcome.feature1.title"
                  defaultMessage="可視化訓練界面"
                />
              }
              desc={
                <FormattedMessage
                  id="page.welcome.feature1.desc"
                  defaultMessage="PoseidonAI 提供直觀的可視化界面，使用戶能夠實時監控模型的訓練過程和效果。通過圖表和動態展示，用戶可以輕鬆了解模型的訓練狀態和性能變化"
                />
              }
            />
            <InfoCard
              index={2}
              href="https://ant.design"
              title={
                <FormattedMessage
                  id="page.welcome.feature2.title"
                  defaultMessage="多功能工具集成"
                />
              }
              desc={
                <FormattedMessage
                  id="page.welcome.feature2.desc"
                  defaultMessage="內建多種功能強大的工具，包括模型調參、資料集管理、實驗重現等，幫助用戶在同一個平台上完成從模型設計到驗證的全過程"
                />
              }
            />
            <InfoCard
              index={3}
              href="https://procomponents.ant.design"
              title={
                <FormattedMessage
                  id="page.welcome.feature3.title"
                  defaultMessage="性能優化和易用性"
                />
              }
              desc={
                <FormattedMessage
                  id="page.welcome.feature3.desc"
                  defaultMessage="設計上注重性能優化，保證高效的計算資源利用，同時簡化複雜操作，使得深度學習模型的開發和優化變得更加直觀和高效"
                />
              }
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
