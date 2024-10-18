/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-07 09:16:43
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-08 11:03:48
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/NCreateDatasetForm.tsx
 */
/* eslint-disable */
import { createDataset } from '@/services/ant-design-pro/dataset';
import { generateRandomName } from '@/utils/tools';
import { FormattedMessage } from '@umijs/max';
import { Button, Card, Collapse, Form, Input, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';
import { DatasetFormatItem, DetectTypeItem } from '..';
import DetectTypes from './DetectTypes';
import UploadImages from './UploadImages';
import UploadJson from './UploadJson';
import UploadZip from './UploadZip';
import ClassifyExample from './exampleDataset/ClassifyExample';

interface CreateDatasetFormProps {
  detectTypes: DetectTypeItem[];
  datasetFormats: DatasetFormatItem[];
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

type detectTypes = [string, string];

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const NCreateDatasetForm: React.FC<CreateDatasetFormProps> = ({
  detectTypes,
  datasetFormats,
  setRefreshFlag,
}) => {
  const [form] = Form.useForm();
  const [jsonFile, setJsonFile] = useState<UploadFile | undefined>();
  const [imgList, setImgList] = useState<UploadFile[]>([]);
  const [zipFile, setZipFile] = useState<UploadFile | undefined>();
  const [detectType, setDetectType] = useState<[string, string]>(['', '']);

  const onFinish = async (values: any) => {
    const formData = new FormData();
    const data = {
      detect_type_id: values.detect_type[0],
      description: values.description,
      name: values.name,
      dataset_formats: datasetFormats.map((data: DatasetFormatItem) => data._id),
      ...values,
    };
    formData.append('data', JSON.stringify(data));

    // 根据 detectType 决定上传不同的数据
    if (detectType[1] === 'classify') {
      if (zipFile) {
        // 从 values 中获取 zipFile
        formData.append('zipFile', zipFile.originFileObj as Blob);
      } else {
        message.error('請上傳資料集壓縮檔');
        return;
      }
    } else {
      // 非 classify 类型上传图片和标注文件
      if (imgList && imgList.length > 0) {
        imgList.forEach((file: UploadFile) => {
          formData.append('imageFiles', file.originFileObj as Blob);
        });
      } else {
        message.error('請上傳圖片');
        return;
      }

      if (jsonFile) {
        formData.append('jsonFile', jsonFile.originFileObj as Blob);
      } else {
        message.error('請上傳標注文件');
        return;
      }
    }

    console.log('FormData to be sent: ', formData); // 调试用，查看 FormData 内容

    try {
      const result = await createDataset(formData);
      if (result.code === 200) {
        message.success(
          <FormattedMessage id="pages.dataset.display.createSuccess" defaultMessage="創建成功" />,
        );
      } else {
        message.error(
          `${(
            <FormattedMessage id="pages.dataset.display.createFail" defaultMessage="創建失敗" />
          )}: ${result.msg}`,
        );
      }

      // 重置表单
      form.resetFields();
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error('Error creating dataset: ', error);
      message.error('創建失敗');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    setImgList([]);
    setJsonFile(undefined);
    setZipFile(undefined);
  }, [detectType]);

  return (
    <Card
      style={{
        maxWidth: 800,
        borderRadius: '8px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <Form
        form={form}
        layout="horizontal"
        size="middle"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ name: `Dataset__${generateRandomName()}`, description: '' }}
      >
        <Form.Item
          label="任務類型"
          name="detect_type"
          layout="vertical"
          rules={[
            {
              required: true,
              message: '請選擇任務類型',
            },
          ]}
          style={{ minHeight: 380 }}
        >
          <DetectTypes data={detectTypes} onChange={setDetectType} />
        </Form.Item>

        <Form.Item
          label={<FormattedMessage id="pages.dataset.display.name" defaultMessage="名稱" />}
          name="name"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.dataset.display.enterDatasetName"
                  defaultMessage="請輸入資料集名稱"
                />
              ),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<FormattedMessage id="pages.dataset.display.description" defaultMessage="描述" />}
          name="description"
        >
          <Input />
        </Form.Item>

        {detectType[1] && detectType[1] !== 'classify' && (
          <>
            <Form.Item
              label={<FormattedMessage id="pages.dataset.display.images" defaultMessage="圖片" />}
              name="imageList"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.dataset.display.uploadImages"
                      defaultMessage="請上傳圖片"
                    />
                  ),
                },
              ]}
            >
              <UploadImages
                value={imgList}
                onChange={(fileList: UploadFile[]) => {
                  setImgList(fileList); // 更新本地状态
                  form.setFieldsValue({ imageList: fileList }); // 更新表单值
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <FormattedMessage
                  id="pages.dataset.display.cocoStyleLabelFile"
                  defaultMessage="標注文件（MSCOCO 格式）"
                />
              }
              name="labelFile"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.dataset.display.uploadLabelFile"
                      defaultMessage="請上傳標注文件"
                    />
                  ),
                },
              ]}
            >
              <UploadJson
                value={jsonFile}
                onChange={(fileList: UploadFile[]) => {
                  setJsonFile(fileList[0]); // 更新本地状态
                  form.setFieldsValue({ labelFile: fileList }); // 更新表单值
                }}
              />
            </Form.Item>
          </>
        )}
        {detectType[1] && detectType[1] === 'classify' && (
          <>
            <Form.Item
              label="資料集"
              name="datasetZip"
              // valuePropName="fileList"
              // getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: '請上傳資料集壓縮檔',
                },
              ]}
            >
              <UploadZip
                value={zipFile}
                onChange={(fileList) => {
                  setZipFile(fileList[0]); // 更新本地状态
                  form.setFieldsValue({ zipFile: fileList }); // 更新表单值
                }}
              />
            </Form.Item>
            <Collapse
              size="small"
              items={[
                {
                  key: '1',
                  label: '資料集壓縮檔目錄結構參考',
                  children: <ClassifyExample />,
                },
              ]}
            />
          </>
        )}
        <Form.Item style={{ marginTop: 15 }}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="pages.dataset.display.submit" defaultMessage="提交" />
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NCreateDatasetForm;
