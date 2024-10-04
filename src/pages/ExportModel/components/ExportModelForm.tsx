/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-15 10:52:46
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-04 14:56:28
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/ExportModelForm.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { TaskItem } from '@/pages/TrainingTask';
import { exportModel, getExportStatus } from '@/services/ant-design-pro/trainingTask';
import { capitalizeWords } from '@/utils/tools';
import { DownloadOutlined } from '@ant-design/icons';
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
import './ExportModelForm.css'; // 引入自定义CSS

const { Option } = Select;

interface ExportModelFormProps {
  style: CSSProperties | undefined;
  taskData: TaskItem | undefined;
}

// 定義評估任務的狀態類型
export type ExportStatus =
  | 'IDLE'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'ERROR'
  | 'REVOKED';

const ExportModelForm: React.FC<ExportModelFormProps> = ({ taskData, style }) => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [exportId, setExportId] = useState<string>();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  console.log(taskData);

  const algoName: string = taskData?.task_detail.algorithm.name.replace(/\s+/g, '') || '';
  const frameworkName: string =
    taskData?.task_detail.algorithm.training_framework.name.replace(/\s+/g, '') || '';
  const detectTypeName: string = taskData?.task_detail.algorithm.detect_type.name || '';
  const address = `http://localhost:5000/static`;

  const handleFinish = async (values: any) => {
    const trainingTaskId = taskData ? taskData.task_detail._id : null;
    console.log('Form values:', { ...values, training_task_id: trainingTaskId });
    if (taskData) {
      try {
        setIsExporting(true);
        const resp = await exportModel(taskData?.task_detail._id, {
          ...values,
          training_task_id: trainingTaskId,
        });
        setExportId(resp.results);
        form.resetFields();
      } catch (err) {
        console.error(err);
        notification.error({
          message: '模型下載失敗',
          description: '請稍後重試',
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
        throw new Error('網路響應不是 OK');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      // 将 <a> 添加到 DOM 中
      document.body.appendChild(link);
      // 触发点击事件
      link.click();
      // 移除 <a> 元素
      document.body.removeChild(link);
      // 释放 URL 对象
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下載文件時出錯:', error);
      notification.error({
        message: '下載文件時出錯',
        description: '請稍後重試',
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
        console.log(resp.results); // 輸出當前狀態

        // 當任務完成或發生錯誤時停止輪詢
        if (state === 'SUCCESS' || state === 'ERROR' || state === 'FAILURE') {
          if (intervalId) {
            clearInterval(intervalId); // 停止輪詢
            intervalId = null;
          }
          setIsExporting(false);
          downloadModel(resp.results.data.results);
        }
      }
    };

    // 啟動輪詢
    if (exportId) {
      api.info({
        message: '模型打包完成會自動開始下載',
        placement: 'topLeft',
      });
      intervalId = setInterval(fetchEvalStatus, 2000);
    }

    // 清除定時器以避免內存洩漏
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // 清除定時器
      }
    };
  }, [exportId, algoName, frameworkName]);

  return (
    <Spin spinning={isExporting}>
      {contextHolder}
      <Card style={style}>
        <Typography.Title level={4}>
          <DownloadOutlined style={{ marginRight: '8px' }} />
          模型導出
        </Typography.Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ format: 'typescript', content: 'model' }}
        >
          {/* 导出格式 */}
          <Form.Item
            name="format"
            label="導出格式"
            rules={[{ required: true, message: '請選擇導出格式' }]}
          >
            <Select placeholder="請選擇導出格式">
              <Option value="typescript">Typescript</Option>
              <Option value="onnx" disabled>
                ONNX
              </Option>
              <Option value="openvino" disabled>
                OpenVINO
              </Option>
              <Option value="ncnn" disabled>
                NCNN
              </Option>
            </Select>
          </Form.Item>

          {/* 下载文件命名 */}
          <Form.Item name="filename" label="下載文件命名 (非必填)">
            <Input
              placeholder="輸入下載文件名 (默認為: model)"
              addonAfter=".zip" // 在输入框右侧显示.zip
            />
          </Form.Item>

          {/* 下载内容 */}
          <Form.Item
            name="content"
            label="下載的内容"
            rules={[{ required: true, message: '請選擇下載内容' }]}
          >
            <Radio.Group style={{ width: '100%' }}>
              <Row gutter={8}>
                <Col span={8}>
                  <Card hoverable className="custom-card">
                    <Radio value="model">只下載模型</Radio>
                    <div className="card-description">僅包含模型權重文件</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card hoverable className="custom-card">
                    <Radio value="model_runtime">模型 + EFC Runtime 運行庫</Radio>
                    <div className="card-description">
                      {`包含模型和 EFC Deep Learning Runtime ${capitalizeWords(
                        detectTypeName,
                      )} 運行庫`}
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card hoverable className="custom-card">
                    <Radio value="model_runtime_deps">模型 + EFC Runtime 運行庫 + 其他依賴</Radio>
                    <div className="card-description">
                      {`包含模型和 EFC Deep Learning Runtime ${capitalizeWords(
                        detectTypeName,
                      )} 運行庫和其他依賴庫 (OpenCV, Spd日誌等)`}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>

          {/* 提交按钮 */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              導出模型
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default ExportModelForm;
