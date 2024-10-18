/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-07 14:31:10
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-07 15:52:26
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/UploadImages.tsx
 */
// UploadImages.tsx
import { FormattedMessage } from '@umijs/max';
import { Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';

interface UploadImagesProps {
  onChange: (fileList: UploadFile[]) => void;
  value: UploadFile[];
}

const UploadImages: React.FC<UploadImagesProps> = ({ onChange, value }) => {
  const [imgList, setImgList] = useState<UploadFile[]>(value || []);

  const onImageChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setImgList(newFileList);
    onChange(newFileList); // 将新文件列表传递给表单
  };

  const beforeImageUpload = (file: UploadFile) => {
    const isImage = file.type?.startsWith('image/');
    if (!isImage) {
      message.error(
        <FormattedMessage
          id="pages.dataset.display.onlyImageFile"
          defaultMessage="只能上傳圖片資料"
        />,
      );
    }

    const fileSize = file.size || 0;
    const isLt200MB = fileSize / 1024 / 1024 < 200;
    if (!isLt200MB) {
      message.error(
        <FormattedMessage
          id="pages.dataset.display.lt200mb"
          defaultMessage="圖片大小不能超過200MB"
        />,
      );
    }
    return isImage && isLt200MB;
  };

  const imageUploadProps = {
    multiple: true,
    beforeUpload: beforeImageUpload,
    onChange: onImageChange,
    fileList: imgList,
  };

  return (
    <Upload.Dragger {...imageUploadProps}>
      <p className="ant-upload-drag-icon"></p>
      <p className="ant-upload-text">
        <FormattedMessage
          id="pages.dataset.display.clickOrDragToUpload"
          defaultMessage="點擊或拖動上傳"
        />
      </p>
      <p className="ant-upload-hint">
        <FormattedMessage
          id="pages.dataset.display.uploadDescription"
          defaultMessage="支持單個或批量上傳。嚴禁上傳私人數據或其他禁止的文件"
        />
      </p>
    </Upload.Dragger>
  );
};

export default UploadImages;
