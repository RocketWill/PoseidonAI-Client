import { TaskItem } from '@/pages/TrainingTask';
import { exportModel, getExportStatus } from '@/services/ant-design-pro/trainingTask';
import { LogActionExportTask } from '@/utils/LogActions';
import { LogLevel } from '@/utils/LogLevels';
import { capitalizeWords } from '@/utils/tools';
import { useUserActionLogger } from '@/utils/UserActionLoggerContext';
import { DownloadOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Spin,
  Typography,
  notification,
} from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react';
import './ExportModelForm.css';

const { Option } = Select;

interface ExportModelFormProps {
  style: CSSProperties | undefined;
  taskData: TaskItem | undefined;
}

export type ExportStatus =
  | 'IDLE'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'ERROR'
  | 'REVOKED';

const ExportModelForm: React.FC<ExportModelFormProps> = ({ taskData, style }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [exportId, setExportId] = useState<string>();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const detectType = taskData?.task_detail.algorithm.detect_type;
  const logger = useUserActionLogger();

  const algoName: string = taskData?.task_detail.algorithm.name.replace(/\s+/g, '') || '';
  const frameworkName: string =
    taskData?.task_detail.algorithm.training_framework.name.replace(/\s+/g, '') || '';
  const detectTypeName: string = taskData?.task_detail.algorithm.detect_type.name || '';
  const address = `http://localhost:5000/static`;

  const handleFinish = async (values: any) => {
    const trainingTaskId = taskData ? taskData.task_detail._id : null;
    if (taskData) {
      try {
        setIsExporting(true);
        const resp = await exportModel(taskData?.task_detail._id, {
          ...values,
          training_task_id: trainingTaskId,
        });
        setExportId(resp.results);
        form.resetFields();
        logger.logAction(
          LogLevel.INFO,
          LogActionExportTask.EXPORT_TASK_START,
          `Export started for task ${taskData?.task_detail._id}`,
        );
      } catch (err) {
        console.error(err);
        logger.logAction(
          LogLevel.ERROR,
          LogActionExportTask.EXPORT_TASK_ERROR,
          `Error starting export for task ${taskData?.task_detail._id}`,
        );
        notification.error({
          message: intl.formatMessage({
            id: 'pages.exportModel.downloadFailed',
            defaultMessage: '模型下載失敗',
          }),
          description: intl.formatMessage({
            id: 'pages.exportModel.tryAgainLater',
            defaultMessage: '請稍後重試',
          }),
          placement: 'topLeft',
        });
      }
    }
  };

  const downloadModel = async (relFilePath: string) => {
    const fileUrl = `${address}/${relFilePath}`;
    const fileName = relFilePath.split('/').pop() || 'download';

    try {
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error(
          intl.formatMessage({
            id: 'pages.exportModel.networkError',
            defaultMessage: '網路響應不是 OK',
          }),
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        intl.formatMessage({
          id: 'pages.exportModel.downloadError',
          defaultMessage: '下載文件時出錯:',
        }),
        error,
      );
      logger.logAction(
        LogLevel.ERROR,
        LogActionExportTask.EXPORT_TASK_ERROR,
        'Error occurred during file download',
      );
      notification.error({
        message: intl.formatMessage({
          id: 'pages.exportModel.downloadError',
          defaultMessage: '下載文件時出錯',
        }),
        description: intl.formatMessage({
          id: 'pages.exportModel.tryAgainLater',
          defaultMessage: '請稍後重試',
        }),
        placement: 'topLeft',
      });
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    const fetchEvalStatus = async () => {
      if (exportId) {
        const resp = await getExportStatus(exportId, algoName, frameworkName);
        const state: ExportStatus = resp.results.state;
        logger.logAction(
          LogLevel.DEBUG,
          LogActionExportTask.EXPORT_TASK_PROGRESS_FETCH,
          `Export progress: ${state} for exportId ${exportId}`,
        );

        if (state === 'SUCCESS' || state === 'ERROR' || state === 'FAILURE') {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          setIsExporting(false);
          if (state === 'SUCCESS') {
            logger.logAction(
              LogLevel.INFO,
              LogActionExportTask.EXPORT_TASK_SUCCESS,
              `Export successful for exportId ${exportId}`,
            );
            downloadModel(resp.results.data.results);
          } else {
            logger.logAction(
              LogLevel.ERROR,
              LogActionExportTask.EXPORT_TASK_FAILURE,
              `Export failed for exportId ${exportId}`,
            );
          }
        }
      }
    };

    if (exportId) {
      api.info({
        message: intl.formatMessage({
          id: 'pages.exportModel.downloadStartsOnComplete',
          defaultMessage: '模型打包完成會自動開始下載',
        }),
        placement: 'topLeft',
      });
      intervalId = setInterval(fetchEvalStatus, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [exportId, algoName, frameworkName]);

  return (
    <>
      {contextHolder}
      <Card style={style}>
        <Spin spinning={isExporting}>
          <Typography.Title level={4}>
            <DownloadOutlined style={{ marginRight: '8px' }} />
            <FormattedMessage id="pages.exportModel.exportModel" defaultMessage="模型導出" />
          </Typography.Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              format: detectType?.tag_name === 'classify' ? 'openvino' : 'torchscript',
              content: 'model',
            }}
          >
            <Form.Item
              name="format"
              label={
                <FormattedMessage id="pages.exportModel.exportFormat" defaultMessage="導出格式" />
              }
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.exportModel.selectExportFormat',
                    defaultMessage: '請選擇導出格式',
                  }),
                },
              ]}
            >
              <Select
                placeholder={intl.formatMessage({
                  id: 'pages.exportModel.selectExportFormat',
                  defaultMessage: '請選擇導出格式',
                })}
              >
                <Option value="torchscript" disabled={detectType?.tag_name === 'classify'}>
                  TorchSript
                </Option>
                <Option value="onnx" disabled>
                  ONNX
                </Option>
                <Option value="openvino" disabled={detectType?.tag_name === 'segment'}>
                  OpenVINO
                </Option>
                <Option value="ncnn" disabled>
                  NCNN
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="filename"
              label={
                <FormattedMessage
                  id="pages.exportModel.fileName"
                  defaultMessage="下載文件命名 (非必填)"
                />
              }
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'pages.exportModel.enterFileName',
                  defaultMessage: '輸入下載文件名 (默認為: model)',
                })}
                addonAfter=".zip"
              />
            </Form.Item>

            <Form.Item
              name="content"
              label={
                <FormattedMessage
                  id="pages.exportModel.downloadContent"
                  defaultMessage="下載的内容"
                />
              }
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.exportModel.selectDownloadContent',
                    defaultMessage: '請選擇下載内容',
                  }),
                },
              ]}
            >
              <Radio.Group style={{ width: '100%' }}>
                <Row gutter={8}>
                  <Col span={8}>
                    <Card hoverable className="custom-card">
                      <Radio value="model">
                        <FormattedMessage
                          id="pages.exportModel.onlyModel"
                          defaultMessage="只下載模型"
                        />
                      </Radio>
                      <div className="card-description">
                        <FormattedMessage
                          id="pages.exportModel.modelOnlyDesc"
                          defaultMessage="僅包含模型權重文件"
                        />
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card hoverable className="custom-card">
                      <Radio value="model_runtime">
                        <FormattedMessage
                          id="pages.exportModel.modelAndRuntime"
                          defaultMessage="模型 + EFC Runtime 運行庫"
                        />
                      </Radio>
                      <div className="card-description">
                        {intl.formatMessage(
                          {
                            id: 'pages.exportModel.modelRuntimeDesc',
                            defaultMessage:
                              '包含模型和 EFC Deep Learning Runtime {detectTypeName} 運行庫',
                          },
                          { detectTypeName: capitalizeWords(detectTypeName) },
                        )}
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card hoverable className="custom-card">
                      <Radio value="model_runtime_deps">
                        <FormattedMessage
                          id="pages.exportModel.modelRuntimeAndDeps"
                          defaultMessage="模型 + EFC Runtime 運行庫 + 其他依賴"
                        />
                      </Radio>
                      <div className="card-description">
                        {intl.formatMessage(
                          {
                            id: 'pages.exportModel.fullPackageDesc',
                            defaultMessage:
                              '包含模型和 EFC Deep Learning Runtime {detectTypeName} 運行庫和其他依賴庫 (OpenCV, Spd日誌等)',
                          },
                          { detectTypeName: capitalizeWords(detectTypeName) },
                        )}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="pages.exportModel.exportButton" defaultMessage="導出模型" />
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </>
  );
};

export default ExportModelForm;
