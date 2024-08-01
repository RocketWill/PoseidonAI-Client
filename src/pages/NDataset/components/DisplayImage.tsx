/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-01 08:31:04
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-01 08:56:16
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/DisplayImage.tsx
 */
import { Image } from 'antd';
import React from 'react';

interface DisplayImageProps {
  imageSrc: string;
}

const DisplayImage: React.FC<DisplayImageProps> = ({ imageSrc }) => {
  return <Image width={500} src={imageSrc} />;
};

export default DisplayImage;
