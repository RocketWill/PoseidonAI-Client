/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-09-16 09:13:15
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-31 13:27:54
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/DisplayCode.tsx
 */
import { CopyOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Typography, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './DisplayCode.css';

interface DisplayCodeProps {
  codeString: string;
}

const handleCopyCode = (codeString: string, intl: any) => {
  navigator.clipboard
    .writeText(codeString)
    .then(() => {
      message.success(
        intl.formatMessage({
          id: 'pages.exportModel.tutorial.copySuccess',
          defaultMessage: '程式碼已複製到剪貼簿',
        }),
      );
    })
    .catch(() => {
      message.error(
        intl.formatMessage({
          id: 'pages.exportModel.tutorial.copyFail',
          defaultMessage: '複製失敗',
        }),
      );
    });
};

const DisplayCode: React.FC<DisplayCodeProps> = ({ codeString }) => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    if (expanded) {
      setMaxHeight(codeContainerRef.current?.scrollHeight + 'px');
    } else {
      setMaxHeight('300px');
    }
  }, [expanded]);

  return (
    <>
      <Typography.Title level={5}>
        <Button
          icon={<CopyOutlined />}
          size="small"
          onClick={() => handleCopyCode(codeString, intl)}
        >
          <FormattedMessage
            id="pages.exportModel.tutorial.copyButton"
            defaultMessage="複製程式碼"
          />
        </Button>
      </Typography.Title>
      <div
        ref={codeContainerRef}
        className={`code-container ${expanded ? 'expanded' : ''}`}
        style={{ maxHeight }}
      >
        <SyntaxHighlighter
          language="csharp"
          style={base16AteliersulphurpoolLight}
          wrapLines={true}
          showLineNumbers={true}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
      <Button
        type="link"
        onClick={() => setExpanded(!expanded)}
        icon={expanded ? <UpOutlined /> : <DownOutlined />}
      >
        {expanded ? (
          <FormattedMessage id="pages.exportModel.tutorial.collapse" defaultMessage="收起" />
        ) : (
          <FormattedMessage id="pages.exportModel.tutorial.expandAll" defaultMessage="展開全部" />
        )}
      </Button>
    </>
  );
};

export default DisplayCode;
