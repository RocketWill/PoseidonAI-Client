/* eslint-disable */
import { createDataset } from '@/services/ant-design-pro/dataset';
import { LogActionDataset } from '@/utils/LogActions';
import { LogLevel } from '@/utils/LogLevels';
import { generateRandomName } from '@/utils/tools';
import { useUserActionLogger } from '@/utils/UserActionLoggerContext'; // 导入日志钩子
import { FormattedMessage } from '@umijs/max';
import { Button, Card, Form, Input, message, Select, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';
import { DatasetFormatItem, DetectTypeItem } from '..';

const { Dragger } = Upload;

interface CreateDatasetFormProps {
  detectTypes: DetectTypeItem[];
  datasetFormats: DatasetFormatItem[];
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const CreateDatasetForm: React.FC<CreateDatasetFormProps> = ({
  detectTypes,
  datasetFormats,
  setRefreshFlag,
}) => {
  const [form] = Form.useForm();
  const [jsonFile, setJsonFile] = useState<UploadFile | undefined>();
  const [imgList, setImgList] = useState<UploadFile[]>([]);
  const { logAction } = useUserActionLogger(); // 获取日志记录函数

  // 组件挂载时记录日志
  useEffect(() => {
    logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_FORM_MOUNT, '');
  }, [logAction]);

  const beforeJsonUpload = (file: UploadFile) => {
    const isJson = file.type === 'application/json';
    if (!isJson) {
      message.error(
        <FormattedMessage
          id="pages.dataset.display.onlyOneJson"
          defaultMessage="只能上傳一個 Json 文件"
        />,
      );
      logAction(LogLevel.WARN, LogActionDataset.CREATE_DATASET_UPLOAD_JSON_FAILURE, {
        fileName: file.name,
        reason: 'File type is not JSON',
      });
    }
    return isJson;
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
      logAction(LogLevel.WARN, LogActionDataset.CREATE_DATASET_UPLOAD_IMAGE_FAILURE, {
        fileName: file.name,
        reason: 'File type is not image',
      });
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
      logAction(LogLevel.WARN, LogActionDataset.CREATE_DATASET_UPLOAD_IMAGE_FAILURE, {
        fileName: file.name,
        reason: 'File size exceeds 200MB',
      });
    }
    return isImage && isLt200MB;
  };

  const onJsonChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    const file = newFileList[newFileList.length - 1];
    setJsonFile(file);
    if (file.status === 'done') {
      logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_UPLOAD_JSON_SUCCESS, {
        fileName: file.name,
        response: file.response,
      });
    } else if (file.status === 'error') {
      logAction(LogLevel.ERROR, LogActionDataset.CREATE_DATASET_UPLOAD_JSON_FAILURE, {
        fileName: file.name,
        error: file.error,
      });
    }
  };

  const onImageChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setImgList(newFileList);
    newFileList.forEach((file) => {
      if (file.status === 'done') {
        logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_UPLOAD_IMAGE_SUCCESS, {
          fileName: file.name,
          response: file.response,
        });
      } else if (file.status === 'error') {
        logAction(LogLevel.ERROR, LogActionDataset.CREATE_DATASET_UPLOAD_IMAGE_FAILURE, {
          fileName: file.name,
          error: file.error,
        });
      }
    });
  };

  const jsonUploadProps = {
    multiple: false,
    beforeUpload: beforeJsonUpload,
    onChange: onJsonChange,
    fileList: jsonFile ? [jsonFile] : [],
    accept: '.json',
  };

  const imageUploadProps = {
    multiple: true,
    beforeUpload: beforeImageUpload,
    onChange: onImageChange,
    fileList: imgList,
  };

  const onFinish = async (values: any) => {
    logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_SUBMIT_START, {
      formValues: values,
    });
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(values));
      if (jsonFile) {
        formData.append('jsonFile', jsonFile.originFileObj as Blob);
      }
      imgList.forEach((file) => {
        formData.append('imageFiles', file.originFileObj as Blob);
      });
      const result = await createDataset(formData);
      if (result.code === 200) {
        message.success(
          <FormattedMessage id="pages.dataset.display.createSuccess" defaultMessage="創建成功" />,
        );
        logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_SUBMIT_SUCCESS, {
          datasetName: values.name,
          response: result,
        });
      } else {
        message.error(
          `${(
            <FormattedMessage id="pages.dataset.display.createFail" defaultMessage="創建失敗" />
          )}: ${result.msg}`,
        );
        logAction(LogLevel.WARN, LogActionDataset.CREATE_DATASET_SUBMIT_FAILURE, {
          datasetName: values.name,
          errorMsg: result.msg,
        });
      }
      form.resetFields();
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      message.error(
        <FormattedMessage
          id="pages.dataset.display.createFailNetwork"
          defaultMessage="創建失敗，請檢查網絡連接"
        />,
      );
      logAction(LogLevel.ERROR, LogActionDataset.CREATE_DATASET_SUBMIT_FAILURE, {
        datasetName: values.name,
        error: error,
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    logAction(LogLevel.WARN, LogActionDataset.CREATE_DATASET_SUBMIT_FAILURE, {
      errorInfo,
    });
  };

  return (
    <Card
      style={{
        maxWidth: 600,
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
        <Form.Item
          label={
            <FormattedMessage id="pages.dataset.display.detectTypes" defaultMessage="檢測類型" />
          }
          name="detectType"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.dataset.display.selectDetectTypes"
                  defaultMessage="請選擇檢測類型"
                />
              ),
            },
          ]}
        >
          <Select>
            {detectTypes.map((data: any) => (
              <Select.Option key={data._id} value={data._id}>
                {data.name.toUpperCase()}
              </Select.Option>
            ))}
          </Select>
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
          <Upload {...jsonUploadProps}>
            <Button>
              <FormattedMessage
                id="pages.dataset.display.clickToUpload"
                defaultMessage="點擊上傳"
              />
            </Button>
          </Upload>
        </Form.Item>
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
          <Dragger {...imageUploadProps}>
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
          </Dragger>
        </Form.Item>
        <Form.Item
          label={
            <FormattedMessage
              id="pages.dataset.display.datasetFormatTitle"
              defaultMessage="資料集格式（MSCOCO 為默認必選）"
            />
          }
          name="datasetFormat"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.dataset.display.selectDatasetFormat"
                  defaultMessage="請選擇資料集格式"
                />
              ),
            },
          ]}
        >
          <Select mode="multiple">
            {datasetFormats.map((data: any) => (
              <Select.Option key={data._id} value={data._id}>
                {data.name.toUpperCase()}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="pages.dataset.display.submit" defaultMessage="提交" />
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateDatasetForm;
