/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-15 10:52:46
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-09-15 15:31:58
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/ExportModelForm.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { TaskItem } from '@/pages/TrainingTask';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Radio, Row, Select, Typography } from 'antd';
import React, { CSSProperties } from 'react';
import './ExportModelForm.css'; // 引入自定义CSS

const { Option } = Select;

interface ExportModelFormProps {
  style: CSSProperties | undefined;
  taskData: TaskItem | undefined;
}

const ExportModelForm: React.FC<ExportModelFormProps> = ({ taskData, style }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const trainingTaskId = taskData ? taskData.task_detail._id : null;
    console.log('Form values:', { ...values, training_task_id: trainingTaskId });
  };

  return (
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
            <Option value="onnx">ONNX</Option>
            <Option value="openvino">OpenVINO</Option>
            <Option value="ncnn">NCNN</Option>
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
          label="下载的内容"
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
                    包含模型和 EFC Deep Learning Runtime Object Detection 運行庫
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card hoverable className="custom-card">
                  <Radio value="model_runtime_deps">模型 + EFC Runtime 運行庫 + 其他依賴</Radio>
                  <div className="card-description">
                    包含模型和 EFC Deep Learning Runtime Object Detection 運行庫和其他依賴庫
                    (OpenCV, Spd日誌等)
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
  );
};

export default ExportModelForm;
