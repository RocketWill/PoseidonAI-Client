/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-07 15:29:22
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-07 15:54:38
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/UploadJson.tsx
 */
// UploadJson.tsx
import { FormattedMessage } from '@umijs/max';
import { Button, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';

interface UploadJsonProps {
  onChange: (fileList: UploadFile[]) => void;
  value: UploadFile | undefined;
}

const UploadJson: React.FC<UploadJsonProps> = ({ onChange, value }) => {
  const [jsonFile, setJsonFile] = useState<UploadFile | undefined>(value);

  const onJsonChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    const file = newFileList[newFileList.length - 1];
    setJsonFile(file);
    onChange(newFileList); // 将新文件列表传递给表单
  };

  const beforeJsonUpload = (file: UploadFile) => {
    const isJson = file.type === 'application/json';
    if (!isJson) {
      message.error(
        <FormattedMessage
          id="pages.dataset.display.onlyOneJson"
          defaultMessage="只能上傳一個 Json 文件"
        />,
      );
    }
    return isJson;
  };

  const jsonUploadProps = {
    multiple: false,
    beforeUpload: beforeJsonUpload,
    onChange: onJsonChange,
    fileList: jsonFile ? [jsonFile] : [],
    accept: '.json',
  };

  return (
    <Upload {...jsonUploadProps}>
      <Button>
        <FormattedMessage id="pages.dataset.display.clickToUpload" defaultMessage="點擊上傳" />
      </Button>
    </Upload>
  );
};

export default UploadJson;
