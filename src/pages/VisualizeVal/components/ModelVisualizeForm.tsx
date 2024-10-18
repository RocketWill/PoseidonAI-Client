/* eslint-disable */
/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-15 10:37:57
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-09 15:39:56
 * @FilePath: /PoseidonAI-Client/src/pages/VisualizeVal/components/ModelVisualizeForm.tsx
 */
import { DetectTypeItem } from '@/pages/CreateTask';
import { Card, Col, Form, InputNumber, Row, Slider, Typography } from 'antd';
import React, { CSSProperties } from 'react';
import { FormValues } from '..';

interface ModelVisualizeFormProps {
  style?: CSSProperties;
  formValues: FormValues;
  setFormValues: (d: FormValues) => void;
  detectType: DetectTypeItem;
}

const ModelVisualizeForm: React.FC<ModelVisualizeFormProps> = ({
  style,
  formValues,
  setFormValues,
  detectType,
}) => {
  // State to manage form values
  const [form] = Form.useForm();

  // Handle form submission
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Form submitted with values:', values);
        // 在这里处理提交逻辑，例如发送请求到后端或更新应用状态
      })
      .catch((errorInfo) => {
        console.error('Failed:', errorInfo);
      });
  };

  return (
    <Card style={style} size="small">
      <Typography.Title level={5}>Validation set visualization settings</Typography.Title>
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="IoU Threshold">
              <Row gutter={16}>
                <Col span={16}>
                  <Slider
                    min={0.1}
                    max={0.95}
                    step={0.01}
                    value={formValues?.iou}
                    onChange={(value: number) => setFormValues({ ...formValues, iou: value })}
                    disabled={detectType.tag_name === 'classify' ? true : false}
                  />
                </Col>
                <Col span={8}>
                  <InputNumber
                    min={0.1}
                    max={0.95}
                    step={0.01}
                    value={formValues.iou}
                    onChange={(value: number | null) =>
                      setFormValues({ ...formValues, iou: value || 0.7 })
                    }
                    style={{ width: '100%' }}
                    disabled={detectType.tag_name === 'classify' ? true : false}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Confifence Threshold">
              <Row gutter={16}>
                <Col span={16}>
                  <Slider
                    min={0.2}
                    max={0.8}
                    step={0.01}
                    value={formValues.conf}
                    onChange={(value: number) => setFormValues({ ...formValues, conf: value })}
                    disabled={detectType.tag_name === 'classify' ? true : false}
                  />
                </Col>
                <Col span={8}>
                  <InputNumber
                    min={0.01}
                    max={0.8}
                    step={0.01}
                    value={formValues.conf}
                    onChange={(value: number | null) =>
                      setFormValues({ ...formValues, conf: value || 0.01 })
                    }
                    style={{ width: '100%' }}
                    disabled={detectType.tag_name === 'classify' ? true : false}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ModelVisualizeForm;
