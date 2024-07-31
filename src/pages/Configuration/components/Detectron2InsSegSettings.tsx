import { generateRandomName } from '@/utils/tools';
import { FormattedMessage } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Slider,
  Spin,
  Tooltip,
  Typography,
} from 'antd';
import { useState } from 'react';
import { TrainingFrameworkProps } from './CreateConfiguration';

const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const initialValues = {
  config_name: `D2-INSSEG__${generateRandomName()}`,
  description: '',
  ANCHOR_GENERATOR_SIZES: [32, 64, 128, 256, 512],
  ANCHOR_GENERATOR_ASPECT_RATIOS: [0.5, 1.0, 2.0],
  RPN_PRE_NMS_TOPK_TRAIN: 2000,
  RPN_PRE_NMS_TOPK_TEST: 1000,
  RPN_POST_NMS_TOPK_TRAIN: 1000,
  RPN_POST_NMS_TOPK_TEST: 1000,
  ROI_BOX_HEAD_NUM_FC: 2,
  ROI_BOX_HEAD_POOLER_RESOLUTION: 7,
  ROI_MASK_HEAD_NUM_CONV: 4,
  ROI_MASK_HEAD_POOLER_RESOLUTION: 14,
  SOLVER_IMS_PER_BATCH: 16,
  SOLVER_BASE_LR: 0.02,
  SOLVER_STEPS: [210000, 250000],
  SOLVER_MAX_ITER: 270000,
  INPUT_MIN_SIZE_TRAIN: [640, 672, 704, 736, 768, 800],
};

const Detectron2InsSegSettings = (props: TrainingFrameworkProps) => {
  const { handleSubmitConfig, saving } = props;
  const [form] = Form.useForm();
  const [values, setValues] = useState({ ...initialValues });

  const handleSliderChange = (name: string, value: any) => {
    setValues({ ...values, [name]: value });
  };

  const handleReset = () => {
    form.resetFields();
    setValues(initialValues);
  };

  return (
    <Card
      style={{
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
        borderRadius: '8px',
        marginTop: 15,
      }}
    >
      <Title level={4}>
        Detectron2 Instance Segmentation
        <FormattedMessage
          id="pages.trainingConfig.trainingSettings"
          defaultMessage="訓練參數配置"
        />
      </Title>
      <Spin tip="Saving" spinning={saving}>
        <Form
          {...layout}
          form={form}
          name="detectron2-config"
          initialValues={initialValues}
          onFinish={(data) => handleSubmitConfig(data, handleReset)}
          labelAlign="left"
          style={{ maxWidth: 900, marginTop: 40 }}
        >
          <Form.Item
            label={
              <FormattedMessage
                id="pages.trainingConfig.framework.setName"
                defaultMessage="訓練配置名稱"
              />
            }
            name="config_name"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.trainingConfig.framework.setNameForSettings"
                    defaultMessage="請為此配置命名"
                  />
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <FormattedMessage
                id="pages.trainingConfig.framework.setDescription"
                defaultMessage="描述"
              />
            }
            name="description"
          >
            <Input defaultValue="" />
          </Form.Item>

          <Title level={5} style={{ marginBottom: 30 }}>
            <FormattedMessage
              id="pages.trainingConfig.trainingParameters"
              defaultMessage="訓練參數"
            />
          </Title>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.anchorGeneratorSizes"
                    defaultMessage="錨點生成器大小"
                  />
                }
              >
                <span>Anchor Generator Sizes</span>
              </Tooltip>
            }
            name="ANCHOR_GENERATOR_SIZES"
          >
            <Select
              mode="tags"
              open={false}
              defaultValue={values.ANCHOR_GENERATOR_SIZES}
              disabled
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.anchorGeneratorAspectRatios"
                    defaultMessage="錨點生成器長寬比"
                  />
                }
              >
                <span>Anchor Generator Aspect Ratios</span>
              </Tooltip>
            }
            name="ANCHOR_GENERATOR_ASPECT_RATIOS"
          >
            <Select mode="tags" open={false} defaultValue={values.ANCHOR_GENERATOR_ASPECT_RATIOS} />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.rpnPreNmsTopkTrain"
                    defaultMessage="訓練時NMS之前保留的最大候選區域數"
                  />
                }
              >
                <span>RPN Pre NMS TopK Train</span>
              </Tooltip>
            }
            name="RPN_PRE_NMS_TOPK_TRAIN"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5000}
                  onChange={(value) => handleSliderChange('RPN_PRE_NMS_TOPK_TRAIN', value)}
                  value={values.RPN_PRE_NMS_TOPK_TRAIN}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={5000}
                  value={values.RPN_PRE_NMS_TOPK_TRAIN}
                  onChange={(value) => handleSliderChange('RPN_PRE_NMS_TOPK_TRAIN', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.rpnPreNmsTopkTest"
                    defaultMessage="測試時NMS之前保留的最大候選區域數"
                  />
                }
              >
                <span>RPN Pre NMS TopK Test</span>
              </Tooltip>
            }
            name="RPN_PRE_NMS_TOPK_TEST"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5000}
                  onChange={(value) => handleSliderChange('RPN_PRE_NMS_TOPK_TEST', value)}
                  value={values.RPN_PRE_NMS_TOPK_TEST}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={5000}
                  value={values.RPN_PRE_NMS_TOPK_TEST}
                  onChange={(value) => handleSliderChange('RPN_PRE_NMS_TOPK_TEST', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.rpnPostNmsTopkTrain"
                    defaultMessage="訓練時NMS之後保留的最大候選區域數"
                  />
                }
              >
                <span>RPN Post NMS TopK Train</span>
              </Tooltip>
            }
            name="RPN_POST_NMS_TOPK_TRAIN"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5000}
                  onChange={(value) => handleSliderChange('RPN_POST_NMS_TOPK_TRAIN', value)}
                  value={values.RPN_POST_NMS_TOPK_TRAIN}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={5000}
                  value={values.RPN_POST_NMS_TOPK_TRAIN}
                  onChange={(value) => handleSliderChange('RPN_POST_NMS_TOPK_TRAIN', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.rpnPostNmsTopkTest"
                    defaultMessage="測試時NMS之後保留的最大候選區域數"
                  />
                }
              >
                <span>RPN Post NMS TopK Test</span>
              </Tooltip>
            }
            name="RPN_POST_NMS_TOPK_TEST"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5000}
                  onChange={(value) => handleSliderChange('RPN_POST_NMS_TOPK_TEST', value)}
                  value={values.RPN_POST_NMS_TOPK_TEST}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={5000}
                  value={values.RPN_POST_NMS_TOPK_TEST}
                  onChange={(value) => handleSliderChange('RPN_POST_NMS_TOPK_TEST', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.roiBoxHeadNumFc"
                    defaultMessage="全連接層數量"
                  />
                }
              >
                <span>ROI Box Head Num FC</span>
              </Tooltip>
            }
            name="ROI_BOX_HEAD_NUM_FC"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={10}
                  onChange={(value) => handleSliderChange('ROI_BOX_HEAD_NUM_FC', value)}
                  value={values.ROI_BOX_HEAD_NUM_FC}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={10}
                  value={values.ROI_BOX_HEAD_NUM_FC}
                  onChange={(value) => handleSliderChange('ROI_BOX_HEAD_NUM_FC', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.roiBoxHeadPoolerResolution"
                    defaultMessage="池化解析度"
                  />
                }
              >
                <span>ROI Box Head Pooler Resolution</span>
              </Tooltip>
            }
            name="ROI_BOX_HEAD_POOLER_RESOLUTION"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={14}
                  onChange={(value) => handleSliderChange('ROI_BOX_HEAD_POOLER_RESOLUTION', value)}
                  value={values.ROI_BOX_HEAD_POOLER_RESOLUTION}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={14}
                  value={values.ROI_BOX_HEAD_POOLER_RESOLUTION}
                  onChange={(value) => handleSliderChange('ROI_BOX_HEAD_POOLER_RESOLUTION', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.roiMaskHeadNumConv"
                    defaultMessage="卷積層數量"
                  />
                }
              >
                <span>ROI Mask Head Num Conv</span>
              </Tooltip>
            }
            name="ROI_MASK_HEAD_NUM_CONV"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={10}
                  onChange={(value) => handleSliderChange('ROI_MASK_HEAD_NUM_CONV', value)}
                  value={values.ROI_MASK_HEAD_NUM_CONV}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={10}
                  value={values.ROI_MASK_HEAD_NUM_CONV}
                  onChange={(value) => handleSliderChange('ROI_MASK_HEAD_NUM_CONV', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.roiMaskHeadPoolerResolution"
                    defaultMessage="池化解析度"
                  />
                }
              >
                <span>ROI Mask Head Pooler Resolution</span>
              </Tooltip>
            }
            name="ROI_MASK_HEAD_POOLER_RESOLUTION"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={28}
                  onChange={(value) => handleSliderChange('ROI_MASK_HEAD_POOLER_RESOLUTION', value)}
                  value={values.ROI_MASK_HEAD_POOLER_RESOLUTION}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={28}
                  value={values.ROI_MASK_HEAD_POOLER_RESOLUTION}
                  onChange={(value) => handleSliderChange('ROI_MASK_HEAD_POOLER_RESOLUTION', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.solverImsPerBatch"
                    defaultMessage="每批次圖像數量"
                  />
                }
              >
                <span>Solver IMS per Batch</span>
              </Tooltip>
            }
            name="SOLVER_IMS_PER_BATCH"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={64}
                  onChange={(value) => handleSliderChange('SOLVER_IMS_PER_BATCH', value)}
                  value={values.SOLVER_IMS_PER_BATCH}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={64}
                  value={values.SOLVER_IMS_PER_BATCH}
                  onChange={(value) => handleSliderChange('SOLVER_IMS_PER_BATCH', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.solverBaseLr"
                    defaultMessage="基礎學習率"
                  />
                }
              >
                <span>Solver Base LR</span>
              </Tooltip>
            }
            name="SOLVER_BASE_LR"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  onChange={(value) => handleSliderChange('SOLVER_BASE_LR', value)}
                  value={values.SOLVER_BASE_LR}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  value={values.SOLVER_BASE_LR}
                  onChange={(value) => handleSliderChange('SOLVER_BASE_LR', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.solverSteps"
                    defaultMessage="學習率調整步長"
                  />
                }
              >
                <span>Solver Steps</span>
              </Tooltip>
            }
            name="SOLVER_STEPS"
          >
            <Row>
              <Col span={12}>
                <Slider
                  range
                  min={1000}
                  max={300000}
                  onChange={(value) => handleSliderChange('SOLVER_STEPS', value)}
                  value={values.SOLVER_STEPS}
                />
              </Col>
              <Col span={8}>
                <InputNumber
                  min={1000}
                  max={300000}
                  value={values.SOLVER_STEPS[0]}
                  onChange={(value) =>
                    handleSliderChange('SOLVER_STEPS', [value, values.SOLVER_STEPS[1]])
                  }
                  style={{ marginRight: 16 }}
                />
                <InputNumber
                  min={1000}
                  max={300000}
                  value={values.SOLVER_STEPS[1]}
                  onChange={(value) =>
                    handleSliderChange('SOLVER_STEPS', [values.SOLVER_STEPS[0], value])
                  }
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.solverMaxIter"
                    defaultMessage="最大迭代次數"
                  />
                }
              >
                <span>Solver Max Iter</span>
              </Tooltip>
            }
            name="SOLVER_MAX_ITER"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1000}
                  max={500000}
                  onChange={(value) => handleSliderChange('SOLVER_MAX_ITER', value)}
                  value={values.SOLVER_MAX_ITER}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1000}
                  max={500000}
                  value={values.SOLVER_MAX_ITER}
                  onChange={(value) => handleSliderChange('SOLVER_MAX_ITER', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.d2insseg.inputMinSizeTrain"
                    defaultMessage="訓練時圖像的最小尺寸"
                  />
                }
              >
                <span>Input Min Size Train</span>
              </Tooltip>
            }
            name="INPUT_MIN_SIZE_TRAIN"
          >
            <Select mode="tags" open={false} defaultValue={values.INPUT_MIN_SIZE_TRAIN} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="pages.trainingConfig.submit" defaultMessage="送出" />
            </Button>
            <Button type="default" onClick={handleReset} style={{ marginLeft: '10px' }}>
              <FormattedMessage id="pages.trainingConfig.reset" defaultMessage="重設" />
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default Detectron2InsSegSettings;
