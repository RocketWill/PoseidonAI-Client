/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-15 19:54:15
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-09-15 19:55:31
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/DisplayMarkdown.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface DisplayDisplayMarkdownProps {
  markdown: string;
}

const DisplayMarkdown: React.FC<DisplayDisplayMarkdownProps> = ({ markdown }) => {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
};

export default DisplayMarkdown;
