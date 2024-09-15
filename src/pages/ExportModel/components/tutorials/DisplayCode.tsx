import { CopyOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Typography, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 选择一种高亮风格
import './DisplayCode.css'; // 引入样式文件

interface DisplayCodeProps {
  codeString: string;
}

const handleCopyCode = (codeString: string) => {
  navigator.clipboard
    .writeText(codeString)
    .then(() => {
      message.success('程式碼已複製到剪貼簿');
    })
    .catch(() => {
      message.error('複製失敗');
    });
};

const DisplayCode: React.FC<DisplayCodeProps> = ({ codeString }) => {
  const [expanded, setExpanded] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('300px'); // 设置默认高度

  useEffect(() => {
    // 当expanded变化时，动态调整maxHeight
    if (expanded) {
      setMaxHeight(codeContainerRef.current?.scrollHeight + 'px');
    } else {
      setMaxHeight('300px'); // 初始高度可以调节
    }
  }, [expanded]);

  return (
    <>
      <Typography.Title level={5}>
        <Button icon={<CopyOutlined />} size="small" onClick={() => handleCopyCode(codeString)}>
          複製程式碼
        </Button>
      </Typography.Title>
      <div
        ref={codeContainerRef}
        className={`code-container ${expanded ? 'expanded' : ''}`} // 应用CSS
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
        {expanded ? '收起' : '展開全部'}
      </Button>
    </>
  );
};

export default DisplayCode;
