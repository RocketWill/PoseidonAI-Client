/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-15 19:54:15
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-04 17:18:01
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/DisplayMarkdown.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
// import React from 'react';
// import ReactMarkdown from 'react-markdown';

// interface DisplayDisplayMarkdownProps {
//   markdown: string;
// }

// const DisplayMarkdown: React.FC<DisplayDisplayMarkdownProps> = ({ markdown }) => {
//   return <ReactMarkdown>{markdown}</ReactMarkdown>;
// };

// export default DisplayMarkdown;

import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type MarkdownRendererProps = {
  children: string;
};

const DisplayMarkdown = ({ children: markdown }: MarkdownRendererProps) => {
  return (
    <Markdown
      components={{
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline && match ? (
            <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </Markdown>
  );
};

export default DisplayMarkdown;
