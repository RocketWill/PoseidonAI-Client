/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-07 09:16:43
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-22 10:25:12
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/NCreateDatasetForm.tsx
 */
/* eslint-disable */
import { createDataset } from '@/services/ant-design-pro/dataset';
import { LogActionDataset } from '@/utils/LogActions';
import { LogLevel } from '@/utils/LogLevels';
import { useUserActionLogger } from '@/utils/UserActionLoggerContext';
import { generateRandomName } from '@/utils/tools';
import { FormattedMessage } from '@umijs/max';
import { Button, Card, Collapse, Form, Input, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useEffect, useMemo, useState } from 'react';
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
  const { logAction } = useUserActionLogger();
  const datasetInitName = useMemo(() => generateRandomName(), []);

  //   // 组件挂载时记录日志
  //   useEffect(() => {
  //     logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_FORM_MOUNT, {
  //       timestamp: new Date().toISOString(),
  //       userId: undefined, // 如果有用户ID，可以传递
  //     });
  //   }, [logAction]);

  // 检测类型变化时记录日志
  //   useEffect(() => {
  //     if (detectType[1]) {
  //       logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_DETECT_TYPE_CHANGE, {
  //         detectTypeId: detectType[0],
  //         detectTypeName: detectType[1],
  //       });
  //     }
  //   }, [detectType, logAction]);

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

  const beforeZipUpload = (file: UploadFile) => {
    const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
    if (!isZip) {
      message.error('只能上傳 ZIP 文件');
      logAction(LogLevel.WARN, LogActionDataset.CREATE_DATASET_UPLOAD_ZIP_FAILURE, {
        fileName: file.name,
        reason: 'File type is not ZIP',
      });
    }
    return isZip;
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

  const onZipChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    const file = newFileList[newFileList.length - 1];
    setZipFile(file);
    if (file.status === 'done') {
      logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_UPLOAD_ZIP_SUCCESS, {
        fileName: file.name,
        response: file.response,
      });
    } else if (file.status === 'error') {
      logAction(LogLevel.ERROR, LogActionDataset.CREATE_DATASET_UPLOAD_ZIP_FAILURE, {
        fileName: file.name,
        error: file.error,
      });
    }
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
  };

  const zipUploadProps = {
    multiple: false,
    beforeUpload: beforeZipUpload,
    onChange: onZipChange,
    fileList: zipFile ? [zipFile] : [],
    accept: '.zip,.rar,.7z',
  };

  const onFinish = async (values: any) => {
    logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_SUBMIT_START, {
      formValues: values,
      detectType: detectType,
    });
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
        formData.append('zipFile', zipFile.originFileObj as Blob);
      } else {
        message.error('請上傳資料集壓縮檔');
        logAction(LogLevel.WARN, LogActionDataset.CREATE_DATASET_SUBMIT_FAILURE, {
          reason: 'Missing ZIP file for classify task',
        });
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
        logAction(LogLevel.WARN, LogActionDataset.CREATE_DATASET_SUBMIT_FAILURE, {
          reason: 'Missing image files',
        });
        return;
      }

      if (jsonFile) {
        formData.append('jsonFile', jsonFile.originFileObj as Blob);
      } else {
        message.error('請上傳標注文件');
        logAction(LogLevel.WARN, LogActionDataset.CREATE_DATASET_SUBMIT_FAILURE, {
          reason: 'Missing JSON label file',
        });
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

      // 重置表单
      form.resetFields();
      setRefreshFlag((prev) => !prev);
    } catch (error: any) {
      console.error('Error creating dataset: ', error);
      message.error('創建失敗');
      logAction(LogLevel.ERROR, LogActionDataset.CREATE_DATASET_SUBMIT_FAILURE, {
        datasetName: values.name,
        error: error.message || 'Unknown error',
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    logAction(LogLevel.WARN, LogActionDataset.CREATE_DATASET_FORM_VALIDATION_FAILURE, {
      errorInfo,
    });
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
        initialValues={{ name: datasetInitName, description: '' }}
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
          style={{ minHeight: 350 }}
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
                  // 记录上传图片操作
                  logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_UPLOAD_IMAGE_SUCCESS, {
                    uploadedImages: fileList.map((file) => file.name),
                  });
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
                  if (fileList[0].status === 'done') {
                    logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_UPLOAD_JSON_SUCCESS, {
                      fileName: fileList[0].name,
                      response: fileList[0].response,
                    });
                  } else if (fileList[0].status === 'error') {
                    logAction(LogLevel.ERROR, LogActionDataset.CREATE_DATASET_UPLOAD_JSON_FAILURE, {
                      fileName: fileList[0].name,
                      error: fileList[0].error,
                    });
                  }
                }}
              />
            </Form.Item>
          </>
        )}
        {detectType[1] && detectType[1] === 'classify' && (
          <>
            <Form.Item
              label="資料集壓縮檔"
              name="datasetZip"
              rules={[
                {
                  required: true,
                  message: '請上傳資料集壓縮檔',
                },
              ]}
            >
              <UploadZip
                value={zipFile}
                onChange={(fileList: UploadFile[]) => {
                  setZipFile(fileList[0]); // 更新本地状态
                  form.setFieldsValue({ zipFile: fileList }); // 更新表单值
                  if (fileList[0].status === 'done') {
                    logAction(LogLevel.INFO, LogActionDataset.CREATE_DATASET_UPLOAD_ZIP_SUCCESS, {
                      fileName: fileList[0].name,
                      response: fileList[0].response,
                    });
                  } else if (fileList[0].status === 'error') {
                    logAction(LogLevel.ERROR, LogActionDataset.CREATE_DATASET_UPLOAD_ZIP_FAILURE, {
                      fileName: fileList[0].name,
                      error: fileList[0].error,
                    });
                  }
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
