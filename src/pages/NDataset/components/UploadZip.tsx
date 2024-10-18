// UploadZip.tsx
import { FormattedMessage } from '@umijs/max';
import { Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import JSZip from 'jszip';
import React, { useState } from 'react';

interface UploadZipProps {
  onChange: (fileList: UploadFile[]) => void;
  value: UploadFile | undefined;
}

const UploadZip: React.FC<UploadZipProps> = ({ onChange, value }) => {
  const [zipFile, setZipFile] = useState<UploadFile | undefined>(value);

  const onZipChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    const file = newFileList[newFileList.length - 1];
    setZipFile(file);
    onChange(newFileList); // 传递新的文件列表
  };

  const beforeZipUpload = async (file: UploadFile): Promise<void> => {
    // 检查文件类型是否为 ZIP
    const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed';

    if (!isZip) {
      message.error(
        <FormattedMessage id="pages.dataset.display.onlyZip" defaultMessage="只能上傳 ZIP 文件" />,
      );
      return Promise.reject(); // 直接返回拒绝的 Promise
    }

    // 创建 FileReader 实例
    const reader = new FileReader();

    // 返回一个 Promise
    return new Promise((resolve, reject) => {
      reader.onload = async (e: any) => {
        try {
          const zip = await JSZip.loadAsync(e.target.result);
          const files = Object.keys(zip.files);

          // 解析 ZIP 结构
          const structure = {
            train: new Set<string>(), // 存储 train 子目录
            val: new Set<string>(), // 存储 val 子目录
          };

          for (const filePath of files) {
            const parts = filePath.split('/'); // 分割路径

            if (parts[0] === 'train' && parts.length === 2) {
              structure.train.add(parts[1]); // 收集 train 下的子目录
            } else if (parts[0] === 'val' && parts.length === 2) {
              structure.val.add(parts[1]); // 收集 val 下的子目录
            } else if (parts.length === 3) {
              const fileName = parts[2];
              // 检查第三层是否为图片文件
              if (!fileName.match(/\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i)) {
                message.error('子目录下的文件必须是图片格式！');
                return reject(); // 使用 reject() 而不是 Promise.reject()
              }
            }
          }

          // 验证 train 和 val 目录下的子目录数量和名称是否相同
          if (structure.train.size !== structure.val.size) {
            message.error('train 和 val 目录下的子目录数量不匹配！');
            return reject(); // 使用 reject() 而不是 Promise.reject()
          }

          const trainDirs = Array.from(structure.train);
          const valDirs = Array.from(structure.val);

          for (const dir of trainDirs) {
            if (!valDirs.includes(dir)) {
              message.error(`val 目录中缺少与 train 目录同名的子目录: ${dir}`);
              return reject(); // 使用 reject() 而不是 Promise.reject()
            }
          }

          message.success('ZIP 文件的目录结构符合要求！');
          resolve(); // 使用 resolve() 而不是 Promise.resolve()
        } catch (error) {
          message.error('读取 ZIP 文件时发生错误！');
          reject(); // 使用 reject() 而不是 Promise.reject()
        }
      };

      // 读取文件内容
      reader.readAsArrayBuffer(file.originFileObj as Blob); // 确保在 Promise 中读取文件
    });
  };

  const zipUploadProps = {
    multiple: false,
    beforeUpload: beforeZipUpload,
    onChange: onZipChange,
    fileList: zipFile ? [zipFile] : [],
    accept: '.zip',
  };

  return (
    <Upload.Dragger {...zipUploadProps}>
      <p className="ant-upload-drag-icon"></p>
      <p className="ant-upload-text">
        <FormattedMessage
          id="pages.dataset.display.clickToUploadZip"
          defaultMessage="點擊或拖動上傳 ZIP 文件"
        />
      </p>
      <p className="ant-upload-hint">
        <FormattedMessage
          id="pages.dataset.display.uploadZipDescription"
          defaultMessage="支持單個文件上傳，且必須符合特定目錄結構"
        />
      </p>
    </Upload.Dragger>
  );
};

export default UploadZip;
