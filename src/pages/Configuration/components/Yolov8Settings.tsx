/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-25 09:46:30
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-07-28 20:47:37
 * @FilePath: /PoseidonAI-Client/src/pages/Configuration/components/Yolov8Settings.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
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
  Switch,
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
  // Training parameters
  time: 12,
  patience: 50,
  batch: 16,
  imgsz: 640,
  optimizer: 'SGD',
  seed: 0,
  deterministic: true,
  single_cls: false,
  rect: false,
  cos_lr: false,
  close_mosaic: 10,
  amp: true,
  fraction: 1.0,
  profile: false,
  freeze: 0,
  lr0: 0.01,
  lrf: 0.01,
  momentum: 0.937,
  weight_decay: 0.0005,
  warmup_epochs: 3.0,
  warmup_momentum: 0.8,
  warmup_bias_lr: 0.1,
  box: 0.05,
  cls: 0.5,
  dfl: 1.0,
  pose: 0.0,
  kobj: 1.0,
  label_smoothing: 0.0,
  nbs: 64,
  overlap_mask: true,
  mask_ratio: 4.0,
  dropout: 0.0,

  // Data augmentation parameters
  hsv_h: 0.015,
  hsv_s: 0.7,
  hsv_v: 0.4,
  degrees: 0.0,
  translate: 0.1,
  scale: 0.5,
  shear: 0.0,
  perspective: 0.0,
  flipud: 0.0,
  fliplr: 0.5,
  bgr: 0.0,
  mosaic: 1.0,
  mixup: 0.0,
  copy_paste: 0.0,
  auto_augment: 'randaugment',
  erasing: 0.4,
  crop_fraction: 1.0,
};

const YoloV8Settings = (props: TrainingFrameworkProps) => {
  const { handleSubmitConfig, saving } = props;
  const [form] = Form.useForm();
  const [values, setValues] = useState(initialValues);

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
        YOLOv8
        <FormattedMessage
          id="pages.trainingConfig.trainingSettings"
          defaultMessage="訓練參數配置"
        />
      </Title>
      <Spin tip="Saving" spinning={saving}>
        <Form
          {...layout}
          form={form}
          name="yolov8-config"
          initialValues={values}
          onFinish={(data) => handleSubmitConfig(data, handleReset)}
          labelAlign="left"
          style={{ maxWidth: 900, marginTop: 40 }}
        >
          <Form.Item
            label={
              <FormattedMessage
                id="pages.trainingConfig.framework.setName"
                defaultMessage="配置名稱"
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
            <Input />
          </Form.Item>
          {/* Training Parameters Section */}
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
                    id="pages.trainingConfig.yolov8.time"
                    defaultMessage="訓練時間（小時）"
                  />
                }
              >
                <span>Time</span>
              </Tooltip>
            }
            name="time"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={24}
                  onChange={(value) => handleSliderChange('time', value)}
                  value={values.time}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={24}
                  value={values.time}
                  onChange={(value) => handleSliderChange('time', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.patience"
                    defaultMessage="提前停止的耐心值"
                  />
                }
              >
                <span>Patience</span>
              </Tooltip>
            }
            name="patience"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={100}
                  onChange={(value) => handleSliderChange('patience', value)}
                  value={values.patience}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={100}
                  value={values.patience}
                  onChange={(value) => handleSliderChange('patience', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.batch"
                    defaultMessage="批量大小"
                  />
                }
              >
                <span>Batch Size</span>
              </Tooltip>
            }
            name="batch"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={128}
                  onChange={(value) => handleSliderChange('batch', value)}
                  value={values.batch}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={128}
                  value={values.batch}
                  onChange={(value) => handleSliderChange('batch', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.imgsz"
                    defaultMessage="輸入圖像大小"
                  />
                }
              >
                <span>Image Size</span>
              </Tooltip>
            }
            name="imgsz"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={320}
                  max={1280}
                  step={32}
                  onChange={(value) => handleSliderChange('imgsz', value)}
                  value={values.imgsz}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={320}
                  max={1280}
                  step={32}
                  value={values.imgsz}
                  onChange={(value) => handleSliderChange('imgsz', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.optimizer"
                    defaultMessage="優化器"
                  />
                }
              >
                <span>Optimizer</span>
              </Tooltip>
            }
            name="optimizer"
          >
            <Select
              defaultValue={values.optimizer}
              onChange={(value) => handleSliderChange('optimizer', value)}
            >
              <Select.Option value="SGD">SGD</Select.Option>
              <Select.Option value="Adam">Adam</Select.Option>
              <Select.Option value="AdamW">AdamW</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.seed"
                    defaultMessage="隨機種子"
                  />
                }
              >
                <span>Seed</span>
              </Tooltip>
            }
            name="seed"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={100}
                  onChange={(value) => handleSliderChange('seed', value)}
                  value={values.seed}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={100}
                  value={values.seed}
                  onChange={(value) => handleSliderChange('seed', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.deterministic"
                    defaultMessage="是否使用確定性算法"
                  />
                }
              >
                <span>Deterministic</span>
              </Tooltip>
            }
            name="deterministic"
          >
            <Switch
              defaultChecked={values.deterministic}
              onChange={(value) => handleSliderChange('deterministic', value)}
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.single_cls"
                    defaultMessage="是否將所有類視為單一類"
                  />
                }
              >
                <span>Single Class</span>
              </Tooltip>
            }
            name="single_cls"
          >
            <Switch
              defaultChecked={values.single_cls}
              onChange={(value) => handleSliderChange('single_cls', value)}
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.rect"
                    defaultMessage="是否使用矩形訓練"
                  />
                }
              >
                <span>Rectangular Training</span>
              </Tooltip>
            }
            name="rect"
          >
            <Switch
              defaultChecked={values.rect}
              onChange={(value) => handleSliderChange('rect', value)}
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.cos_lr"
                    defaultMessage="是否使用余弦退火學習率調度"
                  />
                }
              >
                <span>Cosine LR</span>
              </Tooltip>
            }
            name="cos_lr"
          >
            <Switch
              defaultChecked={values.cos_lr}
              onChange={(value) => handleSliderChange('cos_lr', value)}
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.close_mosaic"
                    defaultMessage="關閉馬賽克增強的輪數"
                  />
                }
              >
                <span>Close Mosaic</span>
              </Tooltip>
            }
            name="close_mosaic"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={50}
                  onChange={(value) => handleSliderChange('close_mosaic', value)}
                  value={values.close_mosaic}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={50}
                  value={values.close_mosaic}
                  onChange={(value) => handleSliderChange('close_mosaic', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.amp"
                    defaultMessage="是否使用自動混合精度訓練"
                  />
                }
              >
                <span>Automatic Mixed Precision</span>
              </Tooltip>
            }
            name="amp"
          >
            <Switch
              defaultChecked={values.amp}
              onChange={(value) => handleSliderChange('amp', value)}
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.fraction"
                    defaultMessage="使用的數據集比例"
                  />
                }
              >
                <span>Dataset Fraction</span>
              </Tooltip>
            }
            name="fraction"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('fraction', value)}
                  value={values.fraction}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={values.fraction}
                  onChange={(value) => handleSliderChange('fraction', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.profile"
                    defaultMessage="是否進行性能分析"
                  />
                }
              >
                <span>Performance Profiling</span>
              </Tooltip>
            }
            name="profile"
          >
            <Switch
              defaultChecked={values.profile}
              onChange={(value) => handleSliderChange('profile', value)}
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.freeze"
                    defaultMessage="凍結的層數"
                  />
                }
              >
                <span>Freeze Layers</span>
              </Tooltip>
            }
            name="freeze"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={100}
                  onChange={(value) => handleSliderChange('freeze', value)}
                  value={values.freeze}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={100}
                  value={values.freeze}
                  onChange={(value) => handleSliderChange('freeze', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.lr0"
                    defaultMessage="初始學習率"
                  />
                }
              >
                <span>Initial Learning Rate</span>
              </Tooltip>
            }
            name="lr0"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  onChange={(value) => handleSliderChange('lr0', value)}
                  value={values.lr0}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  value={values.lr0}
                  onChange={(value) => handleSliderChange('lr0', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.lrf"
                    defaultMessage="最終學習率"
                  />
                }
              >
                <span>Final Learning Rate</span>
              </Tooltip>
            }
            name="lrf"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  onChange={(value) => handleSliderChange('lrf', value)}
                  value={values.lrf}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  value={values.lrf}
                  onChange={(value) => handleSliderChange('lrf', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.momentum"
                    defaultMessage="動量因子"
                  />
                }
              >
                <span>Momentum</span>
              </Tooltip>
            }
            name="momentum"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.5}
                  max={0.99}
                  step={0.001}
                  onChange={(value) => handleSliderChange('momentum', value)}
                  value={values.momentum}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.5}
                  max={0.99}
                  step={0.001}
                  value={values.momentum}
                  onChange={(value) => handleSliderChange('momentum', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.weight_decay"
                    defaultMessage="權重衰減因子"
                  />
                }
              >
                <span>Weight Decay</span>
              </Tooltip>
            }
            name="weight_decay"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0001}
                  max={0.1}
                  step={0.0001}
                  onChange={(value) => handleSliderChange('weight_decay', value)}
                  value={values.weight_decay}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0001}
                  max={0.1}
                  step={0.0001}
                  value={values.weight_decay}
                  onChange={(value) => handleSliderChange('weight_decay', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.warmup_epochs"
                    defaultMessage="熱身訓練輪數"
                  />
                }
              >
                <span>Warmup Epochs</span>
              </Tooltip>
            }
            name="warmup_epochs"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={10}
                  step={0.1}
                  onChange={(value) => handleSliderChange('warmup_epochs', value)}
                  value={values.warmup_epochs}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={10}
                  step={0.1}
                  value={values.warmup_epochs}
                  onChange={(value) => handleSliderChange('warmup_epochs', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.warmup_momentum"
                    defaultMessage="熱身動量"
                  />
                }
              >
                <span>Warmup Momentum</span>
              </Tooltip>
            }
            name="warmup_momentum"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.5}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('warmup_momentum', value)}
                  value={values.warmup_momentum}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.5}
                  max={1.0}
                  step={0.1}
                  value={values.warmup_momentum}
                  onChange={(value) => handleSliderChange('warmup_momentum', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.warmup_bias_lr"
                    defaultMessage="熱身偏置學習率"
                  />
                }
              >
                <span>Warmup Bias Learning Rate</span>
              </Tooltip>
            }
            name="warmup_bias_lr"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  onChange={(value) => handleSliderChange('warmup_bias_lr', value)}
                  value={values.warmup_bias_lr}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  value={values.warmup_bias_lr}
                  onChange={(value) => handleSliderChange('warmup_bias_lr', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.box"
                    defaultMessage="邊框損失比重"
                  />
                }
              >
                <span>Box Loss Weight</span>
              </Tooltip>
            }
            name="box"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  onChange={(value) => handleSliderChange('box', value)}
                  value={values.box}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  value={values.box}
                  onChange={(value) => handleSliderChange('box', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.cls"
                    defaultMessage="分類損失比重"
                  />
                }
              >
                <span>Classification Loss Weight</span>
              </Tooltip>
            }
            name="cls"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  onChange={(value) => handleSliderChange('cls', value)}
                  value={values.cls}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  value={values.cls}
                  onChange={(value) => handleSliderChange('cls', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.dfl"
                    defaultMessage="分佈聚類損失比重"
                  />
                }
              >
                <span>Distribution Focal Loss Weight</span>
              </Tooltip>
            }
            name="dfl"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.01}
                  max={2.0}
                  step={0.01}
                  onChange={(value) => handleSliderChange('dfl', value)}
                  value={values.dfl}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.01}
                  max={2.0}
                  step={0.01}
                  value={values.dfl}
                  onChange={(value) => handleSliderChange('dfl', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.pose"
                    defaultMessage="姿態估計損失比重"
                  />
                }
              >
                <span>Pose Estimation Loss Weight</span>
              </Tooltip>
            }
            name="pose"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.01}
                  onChange={(value) => handleSliderChange('pose', value)}
                  value={values.pose}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.01}
                  value={values.pose}
                  onChange={(value) => handleSliderChange('pose', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.kobj"
                    defaultMessage="關鍵點損失比重"
                  />
                }
              >
                <span>Key Object Loss Weight</span>
              </Tooltip>
            }
            name="kobj"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.1}
                  max={10.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('kobj', value)}
                  value={values.kobj}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.1}
                  max={10.0}
                  step={0.1}
                  value={values.kobj}
                  onChange={(value) => handleSliderChange('kobj', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.label_smoothing"
                    defaultMessage="標籤平滑因子"
                  />
                }
              >
                <span>Label Smoothing</span>
              </Tooltip>
            }
            name="label_smoothing"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('label_smoothing', value)}
                  value={values.label_smoothing}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.label_smoothing}
                  onChange={(value) => handleSliderChange('label_smoothing', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.nbs"
                    defaultMessage="標準批量大小"
                  />
                }
              >
                <span>Normal Batch Size</span>
              </Tooltip>
            }
            name="nbs"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={256}
                  onChange={(value) => handleSliderChange('nbs', value)}
                  value={values.nbs}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={256}
                  value={values.nbs}
                  onChange={(value) => handleSliderChange('nbs', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.overlap_mask"
                    defaultMessage="是否使用重疊掩碼"
                  />
                }
              >
                <span>Overlap Mask</span>
              </Tooltip>
            }
            name="overlap_mask"
          >
            <Switch
              defaultChecked={values.overlap_mask}
              onChange={(value) => handleSliderChange('overlap_mask', value)}
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.mask_ratio"
                    defaultMessage="掩碼損失比重"
                  />
                }
              >
                <span>Mask Loss Weight</span>
              </Tooltip>
            }
            name="mask_ratio"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={1.0}
                  max={10.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('mask_ratio', value)}
                  value={values.mask_ratio}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1.0}
                  max={10.0}
                  step={0.1}
                  value={values.mask_ratio}
                  onChange={(value) => handleSliderChange('mask_ratio', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.dropout"
                    defaultMessage="Dropout 機率"
                  />
                }
              >
                <span>Dropout Probability</span>
              </Tooltip>
            }
            name="dropout"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('dropout', value)}
                  value={values.dropout}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.dropout}
                  onChange={(value) => handleSliderChange('dropout', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Title level={5} style={{ marginBottom: 30 }}>
            <FormattedMessage
              id="pages.trainingConfig.dataAugmentationSettings"
              defaultMessage="資料增強參數"
            />
          </Title>
          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.hsv_h"
                    defaultMessage="調整色調的範圍，範圍0.0 - 1.0"
                  />
                }
              >
                <span>HSV Hue</span>
              </Tooltip>
            }
            name="hsv_h"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.01}
                  onChange={(value) => handleSliderChange('hsv_h', value)}
                  value={values.hsv_h}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.01}
                  value={values.hsv_h}
                  onChange={(value) => handleSliderChange('hsv_h', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.hsv_s"
                    defaultMessage="調整飽和度的範圍，範圍0.0 - 1.0"
                  />
                }
              >
                <span>HSV Saturation</span>
              </Tooltip>
            }
            name="hsv_s"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('hsv_s', value)}
                  value={values.hsv_s}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.hsv_s}
                  onChange={(value) => handleSliderChange('hsv_s', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.hsv_v"
                    defaultMessage="調整亮度的範圍，範圍0.0 - 1.0"
                  />
                }
              >
                <span>HSV Value</span>
              </Tooltip>
            }
            name="hsv_v"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('hsv_v', value)}
                  value={values.hsv_v}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.hsv_v}
                  onChange={(value) => handleSliderChange('hsv_v', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.degrees"
                    defaultMessage="圖像隨機旋轉的角度範圍，範圍-180 - +180"
                  />
                }
              >
                <span>Degrees</span>
              </Tooltip>
            }
            name="degrees"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={-180}
                  max={180}
                  step={1}
                  onChange={(value) => handleSliderChange('degrees', value)}
                  value={values.degrees}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={-180}
                  max={180}
                  step={1}
                  value={values.degrees}
                  onChange={(value) => handleSliderChange('degrees', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.translate"
                    defaultMessage="圖像平移的範圍，範圍0.0 - 1.0"
                  />
                }
              >
                <span>Translate</span>
              </Tooltip>
            }
            name="translate"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('translate', value)}
                  value={values.translate}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.translate}
                  onChange={(value) => handleSliderChange('translate', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.scale"
                    defaultMessage="圖像縮放的增益因子，範圍>=0.0"
                  />
                }
              >
                <span>Scale</span>
              </Tooltip>
            }
            name="scale"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={2.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('scale', value)}
                  value={values.scale}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={2.0}
                  step={0.1}
                  value={values.scale}
                  onChange={(value) => handleSliderChange('scale', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.shear"
                    defaultMessage="圖像錯切的角度範圍，範圍-180 - +180"
                  />
                }
              >
                <span>Shear</span>
              </Tooltip>
            }
            name="shear"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={-180}
                  max={180}
                  step={1}
                  onChange={(value) => handleSliderChange('shear', value)}
                  value={values.shear}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={-180}
                  max={180}
                  step={1}
                  value={values.shear}
                  onChange={(value) => handleSliderChange('shear', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.perspective"
                    defaultMessage="隨機透視變換的範圍，範圍0.0 - 0.001"
                  />
                }
              >
                <span>Perspective</span>
              </Tooltip>
            }
            name="perspective"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={0.001}
                  step={0.0001}
                  onChange={(value) => handleSliderChange('perspective', value)}
                  value={values.perspective}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={0.001}
                  step={0.0001}
                  value={values.perspective}
                  onChange={(value) => handleSliderChange('perspective', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.flipud"
                    defaultMessage="圖像上下翻轉的概率，範圍0.0 - 1.0"
                  />
                }
              >
                <span>Flip Up-Down Probability</span>
              </Tooltip>
            }
            name="flipud"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('flipud', value)}
                  value={values.flipud}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.flipud}
                  onChange={(value) => handleSliderChange('flipud', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.fliplr"
                    defaultMessage="圖像左右翻轉的概率，範圍0.0 - 1.0"
                  />
                }
              >
                <span>Flip Left-Right Probability</span>
              </Tooltip>
            }
            name="fliplr"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('fliplr', value)}
                  value={values.fliplr}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.fliplr}
                  onChange={(value) => handleSliderChange('fliplr', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.bgr"
                    defaultMessage="圖像通道從RGB翻轉到BGR的概率，範圍0.0 - 1.0"
                  />
                }
              >
                <span>BGR Conversion Probability</span>
              </Tooltip>
            }
            name="bgr"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('bgr', value)}
                  value={values.bgr}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.bgr}
                  onChange={(value) => handleSliderChange('bgr', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.mosaic"
                    defaultMessage="使用馬賽克數據增強的概率，範圍0.0 - 1.0"
                  />
                }
              >
                <span>Mosaic Probability</span>
              </Tooltip>
            }
            name="mosaic"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('mosaic', value)}
                  value={values.mosaic}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.mosaic}
                  onChange={(value) => handleSliderChange('mosaic', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.mixup"
                    defaultMessage="混合兩張圖像及其標籤的概率，範圍0.0 - 1.0"
                  />
                }
              >
                <span>MixUp Probability</span>
              </Tooltip>
            }
            name="mixup"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('mixup', value)}
                  value={values.mixup}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.mixup}
                  onChange={(value) => handleSliderChange('mixup', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.copy_paste"
                    defaultMessage="從一張圖像複製對象並粘貼到另一張圖像的機率，範圍0.0 - 1.0"
                  />
                }
              >
                <span>Copy-Paste Probability</span>
              </Tooltip>
            }
            name="copy_paste"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('copy_paste', value)}
                  value={values.copy_paste}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  value={values.copy_paste}
                  onChange={(value) => handleSliderChange('copy_paste', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.auto_augment"
                    defaultMessage="自動應用預定義的資料增強策略，可選值為'randaugment', 'autoaugment', 'augmix'"
                  />
                }
              >
                <span>Auto Augment</span>
              </Tooltip>
            }
            name="auto_augment"
          >
            <Select
              defaultValue={values.auto_augment}
              onChange={(value) => handleSliderChange('auto_augment', value)}
            >
              <Select.Option value="randaugment">randaugment</Select.Option>
              <Select.Option value="autoaugment">autoaugment</Select.Option>
              <Select.Option value="augmix">augmix</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.erasing"
                    defaultMessage="隨機擦除部分圖像的機率，範圍0.0 - 0.9"
                  />
                }
              >
                <span>Random Erasing Probability</span>
              </Tooltip>
            }
            name="erasing"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.0}
                  max={0.9}
                  step={0.1}
                  onChange={(value) => handleSliderChange('erasing', value)}
                  value={values.erasing}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.0}
                  max={0.9}
                  step={0.1}
                  value={values.erasing}
                  onChange={(value) => handleSliderChange('erasing', value)}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <FormattedMessage
                    id="pages.trainingConfig.yolov8.crop_fraction"
                    defaultMessage="裁剪分類圖像的比例，範圍0.1 - 1.0"
                  />
                }
              >
                <span>Crop Fraction</span>
              </Tooltip>
            }
            name="crop_fraction"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  onChange={(value) => handleSliderChange('crop_fraction', value)}
                  value={values.crop_fraction}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={values.crop_fraction}
                  onChange={(value) => handleSliderChange('crop_fraction', value)}
                />
              </Col>
            </Row>
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

export default YoloV8Settings;
