/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-07 16:08:41
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-18 13:44:12
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/exampleDataset/ClassifyExample.tsx
 */
// UploadZip.tsx
import { FileImageOutlined, FileZipOutlined } from '@ant-design/icons';
import type { TreeDataNode } from 'antd';
import { Tree } from 'antd';
import React from 'react';

const { DirectoryTree } = Tree;

const ClassifyExample: React.FC = () => {
  const treeData: TreeDataNode[] = [
    {
      title: 'classify-example.zip',
      key: '0-0',
      icon: <FileZipOutlined />,
      children: [
        {
          title: 'classify',
          key: '0-0-0',
          children: [
            {
              title: 'class_one',
              key: '0-0-0-0',
              children: [
                { title: 'img1.png', key: '0-0-0-0-0', isLeaf: true, icon: <FileImageOutlined /> },
                { title: 'img2.png', key: '0-0-0-0-1', isLeaf: true, icon: <FileImageOutlined /> },
              ],
            },
            {
              title: 'class_two',
              key: '0-0-0-1',
              children: [
                { title: 'img3.png', key: '0-0-0-1-0', isLeaf: true, icon: <FileImageOutlined /> },
                { title: 'img4.png', key: '0-0-0-1-1', isLeaf: true, icon: <FileImageOutlined /> },
              ],
            },
          ],
        },
      ],
    },
  ];

  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      // onSelect={onSelect}
      // onExpand={onExpand}
      treeData={treeData}
    />
  );
};

export default ClassifyExample;
