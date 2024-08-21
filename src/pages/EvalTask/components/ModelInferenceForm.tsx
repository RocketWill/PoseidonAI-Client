/* eslint-disable */
/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-15 10:37:57
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-21 11:44:50
 * @FilePath: /PoseidonAI-Client/src/pages/EvalTask/components/ModelInferenceForm.tsx
 */
import GPUSelector from '@/pages/CreateTask/components/GPUSelector';
import { Card, Col, Form, InputNumber, Row, Select, Slider } from 'antd';
import React, { CSSProperties } from 'react';
import { FormValues } from '..';

const { Option } = Select;

interface ModelInferenceFormPorps {
  styles?: CSSProperties;
  formValues: FormValues;
  setFormValues: (d: FormValues) => void;
}

const ModelInferenceForm: React.FC<ModelInferenceFormPorps> = ({
  styles,
  formValues,
  setFormValues,
}) => {
  // State to manage form values
  const [form] = Form.useForm();

  // Reset to initial state
  // const resetForm = () => {
  //   setFormValues(initialState);
  // };

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
    <Card style={styles} size="small">
      {/* <Typography.Title level={5}>Inference and Evaluation settings</Typography.Title> */}
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="IoU Threshould">
              <Row gutter={16}>
                <Col span={16}>
                  <Slider
                    min={0.1}
                    max={0.95}
                    step={0.01}
                    value={formValues?.iou}
                    onChange={(value: number) => setFormValues({ ...formValues, iou: value })}
                  />
                </Col>
                <Col span={8}>
                  <InputNumber
                    min={0.1}
                    max={0.95}
                    step={0.01}
                    value={formValues.iou}
                    onChange={(value: number | null) =>
                      setFormValues({ ...formValues, iou: value || 0.3 })
                    }
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Batch Size">
              <Row gutter={16}>
                <Col span={16}>
                  <Slider
                    min={1}
                    max={8}
                    value={formValues.batchSize}
                    onChange={(value: number) => setFormValues({ ...formValues, batchSize: value })}
                  />
                </Col>
                <Col span={8}>
                  <InputNumber
                    min={1}
                    max={8}
                    value={formValues.batchSize}
                    onChange={(value: number | null) =>
                      setFormValues({ ...formValues, batchSize: value || 1 })
                    }
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Device">
          <GPUSelector
            activeId={formValues.gpu}
            onChange={(value: number) => setFormValues({ ...formValues, gpu: value })}
          />
        </Form.Item>

        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="default" onClick={resetForm} style={{ marginLeft: '8px' }}>
            Reset
          </Button>
        </Form.Item> */}
      </Form>
    </Card>
  );
};

export default ModelInferenceForm;
