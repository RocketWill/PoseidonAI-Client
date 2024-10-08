/* eslint-disable */
import { createTask, getCreateTaskStatus } from '@/services/ant-design-pro/trainingTask';
import { EyeOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Slider,
  Spin,
  Tag,
  Tooltip,
  message,
} from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

import { TrainingConfigItem } from '@/pages/Configuration';
import UserConfigDisplay from '@/pages/Configuration/components/UserConfigDisplay';
import { DatasetItem } from '@/pages/NDataset';
import DatasetDetails from '@/pages/NDataset/components/DatasetDetails';
import { listAlgorithms } from '@/services/ant-design-pro/algorithms';
import { findByFormatAndDetectType } from '@/services/ant-design-pro/dataset';
import { findByUserAndFramework } from '@/services/ant-design-pro/trainingConfig';
import { generateRandomName } from '@/utils/tools';
import CreateTaskStatus from './CreateTaskStatus';

import { AlgorithmItem, CreateTaskStateItem } from '..';
import { AlgoProjectSettings } from '../modelTrainingParams';
import AlgorithmSelector from './AlgorithmSelector';
import GPUSelector from './GPUSelector';

import './TrainingConfigForm.css';

const { Option } = Select;

const fetchAlgorithmData = async (setAlgorithmData: (data: AlgorithmItem[]) => void) => {
  try {
    const data = await listAlgorithms();
    setAlgorithmData(data.results);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchDatasetsByFormatAndType = async (
  datasetFormatId: string,
  detectTypeId: string,
  setDatasetData: (data: DatasetItem[]) => void,
) => {
  try {
    const data = await findByFormatAndDetectType(datasetFormatId, detectTypeId);
    setDatasetData(data.results);
  } catch (error) {
    console.error('Error fetching datasets:', error);
  }
};

const fetchFrameworksById = async (
  trainingFrameworkId: string,
  setFrameworksData: (data: TrainingConfigItem[]) => void,
) => {
  try {
    const data = await findByUserAndFramework(trainingFrameworkId);
    setFrameworksData(data.results);
  } catch (error) {
    console.error('Error fetching frameworks:', error);
  }
};

const initialValues = {
  name: `Training-Task__${generateRandomName()}`,
  description: '',
  algorithm: '',
  dataset: undefined,
  config: undefined,
  gpu: 0,
  epoch: undefined,
  trainValRatio: undefined,
};

const TrainingConfigForm = () => {
  const [algorithmData, setAlgorithmData] = useState<AlgorithmItem[]>([]);
  const [form] = Form.useForm();
  const [epoch, setEpoch] = useState(0);
  const [trainValRatio, setTrainValRatio] = useState<number | undefined>(undefined);
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<string>('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmItem>();
  const [selectedGpu, setSelectedGpu] = useState<number>(0);
  const [datasetData, setDatasetData] = useState<DatasetItem[]>();
  const [trainingConfigData, setTrainingConfigsData] = useState<TrainingConfigItem[]>();
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem>();
  const [datasetDetailModalOpen, setDatasetDetailModalOpen] = useState<boolean>(false);
  const [selectedTrainingConfigData, setSelectedTrainingConfigData] =
    useState<TrainingConfigItem>();
  const [trainingConfigModalOpen, setTrainingConfigModalOpen] = useState<boolean>(false);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  const [createTaskState, setCreateTaskState] = useState<CreateTaskStateItem | undefined>(
    undefined,
  );
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const handleSubmit = async (values: any) => {
    setSubmitLoading(true);
    try {
      const resp = await createTask(values);
      if (resp['code'] === 200) {
        const taskId = resp['results'];
        console.log(taskId);

        const fetchTaskProgress = async () => {
          const progressRes = await getCreateTaskStatus(taskId);
          // console.log('Task progress:', progressRes);
          setCreateTaskState(progressRes.results);
          if (progressRes.results.state === 'SUCCESS' || progressRes.results === 'FAILURE') {
            clearInterval(intervalId);
            setCreateTaskState(undefined);
            setSubmitLoading(false);
            form.setFieldsValue(initialValues);
            console.log('Task completed');
            message.success(
              <FormattedMessage
                id="pages.createTask.successMessage"
                defaultMessage="創建訓練任務完成"
              />,
            );
          } else {
            console.log('Task still in progress');
          }
        };

        const intervalId = setInterval(fetchTaskProgress, 2000);
      }
    } catch (error) {
      setCreateTaskState(undefined);
      setSubmitLoading(false);
      message.error(
        <FormattedMessage id="pages.createTask.errorMessage" defaultMessage="創建訓練任務失敗" />,
      );
      console.error(error);
    }
  };

  const handleEpochChange = useCallback(
    (value: number) => {
      setEpoch(value);
      form.setFieldsValue({ epoch: value });
    },
    [form],
  );

  const handleTrainValRatioChange = useCallback(
    (value: number) => {
      setTrainValRatio(value);
      form.setFieldsValue({ trainValRatio: value });
    },
    [form],
  );

  const handleSelectedDatasetData = useCallback(
    (datasetId: string) => {
      const foundItem = datasetData?.find((item: DatasetItem) => item._id === datasetId);
      setSelectedDataset(foundItem);
    },
    [datasetData],
  );

  const handleSelectTrainingConfigData = useCallback(
    (trainingConfigId: string) => {
      const foundItem = trainingConfigData?.find(
        (item: TrainingConfigItem) => item._id === trainingConfigId,
      );
      setSelectedTrainingConfigData(foundItem);
    },
    [trainingConfigData],
  );

  const handleFormChange = useCallback(() => {
    const { dataset, config, epoch, trainValRatio } = form.getFieldsValue();
    setDisableSubmit(
      !(
        dataset !== undefined &&
        config !== undefined &&
        epoch !== undefined &&
        trainValRatio !== undefined
      ),
    );
  }, []);

  useEffect(() => {
    fetchAlgorithmData(setAlgorithmData);
  }, [form]);

  useEffect(() => {
    form.setFieldsValue({ gpu: selectedGpu });
  }, [selectedGpu]);

  useEffect(() => {
    if (selectedAlgorithmId) {
      const selectedAlgoItem = algorithmData.find(
        (item: AlgorithmItem) => item._id === selectedAlgorithmId,
      );
      if (selectedAlgoItem) {
        const { detect_type, training_framework } = selectedAlgoItem;
        fetchDatasetsByFormatAndType(
          training_framework.dataset_format._id,
          detect_type._id,
          setDatasetData,
        );
        fetchFrameworksById(training_framework._id, setTrainingConfigsData);
        setSelectedAlgorithm(selectedAlgoItem);

        form.setFieldsValue({
          dataset: undefined,
          config: undefined,
          model: AlgoProjectSettings[training_framework.name].models.defaultValue,
          epoch: AlgoProjectSettings[training_framework.name].epoch.defaultValue,
          trainValRatio: AlgoProjectSettings[training_framework.name].val.defaultValue,
        });

        setSelectedDataset(undefined);
        setSelectedTrainingConfigData(undefined);
      }
    }
  }, [algorithmData, selectedAlgorithmId, form]);

  return (
    <Card
      style={{
        padding: '16px 19px',
        minWidth: '220px',
        maxWidth: 1000,
        flex: 1,
        borderRadius: '8px',
        marginTop: 15,
      }}
    >
      <Spin
        tip={<FormattedMessage id="pages.createTask.loadingTip" defaultMessage="處理中" />}
        size="large"
        spinning={submitLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialValues}
          style={{ marginTop: 40 }}
          onValuesChange={handleFormChange}
        >
          <Form.Item
            label={<FormattedMessage id="pages.createTask.name" defaultMessage="名稱" />}
            name="name"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.createTask.nameRequired"
                    defaultMessage="請輸入任務名稱"
                  />
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="pages.createTask.description" defaultMessage="説明" />}
            name="description"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <FormattedMessage
                id="pages.createTask.selectAlgorithm"
                defaultMessage="選擇訓練的算法"
              />
            }
            name="algorithm"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.createTask.selectAlgorithmRequired"
                    defaultMessage="請選擇訓練的算法"
                  />
                ),
              },
            ]}
          >
            <AlgorithmSelector
              data={algorithmData}
              onChange={setSelectedAlgorithmId}
              activeId={selectedAlgorithmId}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <FormattedMessage
                  id="pages.createTask.selectDataset"
                  defaultMessage="選擇訓練集數據"
                />
                {selectedDataset && (
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => setDatasetDetailModalOpen(true)}
                  />
                )}
              </>
            }
            name="dataset"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.createTask.selectDatasetRequired"
                    defaultMessage="請選擇訓練集數據"
                  />
                ),
              },
            ]}
          >
            <Select
              disabled={!datasetData}
              placeholder={
                datasetData ? (
                  <FormattedMessage
                    id="pages.createTask.selectDatasetPlaceholder"
                    defaultMessage="請選擇資料集"
                  />
                ) : (
                  <FormattedMessage
                    id="pages.createTask.selectAlgorithmFirst"
                    defaultMessage="請先選擇訓練演算法"
                  />
                )
              }
              onChange={handleSelectedDatasetData}
            >
              {datasetData?.map((item: DatasetItem) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                  <Tag style={{ marginLeft: 10 }} color="blue">
                    <FormattedMessage id="pages.createTask.validImages" defaultMessage="有效圖像" />{' '}
                    {item.valid_images_num}{' '}
                    <FormattedMessage id="pages.createTask.images" defaultMessage="張" />
                  </Tag>
                  <Tag color="green">
                    <FormattedMessage
                      id="pages.createTask.creationDate"
                      defaultMessage="創建日期"
                    />{' '}
                    {moment(item.created_at).format('YYYY-MM-DD')}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <>
                <FormattedMessage
                  id="pages.createTask.selectModelConfig"
                  defaultMessage="選擇模型參數配置"
                />
                {selectedTrainingConfigData && (
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => setTrainingConfigModalOpen(true)}
                  />
                )}
              </>
            }
            name="config"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.createTask.selectModelConfigRequired"
                    defaultMessage="請選擇模型參數配置"
                  />
                ),
              },
            ]}
          >
            <Select
              disabled={!trainingConfigData}
              placeholder={
                trainingConfigData ? (
                  <FormattedMessage
                    id="pages.createTask.selectConfigPlaceholder"
                    defaultMessage="請選擇訓練配置"
                  />
                ) : (
                  <FormattedMessage
                    id="pages.createTask.selectAlgorithmFirst"
                    defaultMessage="請先選擇訓練演算法"
                  />
                )
              }
              onChange={handleSelectTrainingConfigData}
            >
              {trainingConfigData?.map((item: TrainingConfigItem) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                  <Tag style={{ marginLeft: 10 }} color="green">
                    <FormattedMessage
                      id="pages.createTask.creationDate"
                      defaultMessage="創建日期"
                    />{' '}
                    {moment(item.created_at).format('YYYY-MM-DD')}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="pages.createTask.selectGPU" defaultMessage="選擇GPU卡" />}
            name="gpu"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.createTask.selectGPURequired"
                    defaultMessage="請選擇GPU卡"
                  />
                ),
              },
            ]}
          >
            <GPUSelector onChange={setSelectedGpu} activeId={selectedGpu} />
          </Form.Item>
          {selectedAlgorithm && (
            <>
              <Form.Item
                label={
                  <FormattedMessage id={`pages.createTask.modelSize`} defaultMessage="模型尺寸" />
                }
                name="model"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.createTask.selectModelSize"
                        defaultMessage="請選擇模型尺寸"
                      />
                    ),
                  },
                ]}
              >
                <Select
                  placeholder={
                    <FormattedMessage
                      id="pages.createTask.selectModelSizePlaceholder"
                      defaultMessage="請選擇模型尺寸"
                    />
                  }
                >
                  {AlgoProjectSettings[
                    selectedAlgorithm.training_framework.name
                  ].models.weights.map((weight: any) => (
                    <Option key={weight.name} value={weight.value} disabled={weight.disable}>
                      {weight.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={
                  <FormattedMessage
                    id={`pages.createTask.epochNum`}
                    defaultMessage="訓練迭代次數"
                  />
                }
              >
                <Row gutter={8}>
                  <Col span={16}>
                    <Form.Item name="epoch" noStyle>
                      <Slider
                        min={
                          AlgoProjectSettings[selectedAlgorithm.training_framework.name].epoch
                            .range[0]
                        }
                        max={
                          AlgoProjectSettings[selectedAlgorithm.training_framework.name].epoch
                            .range[1]
                        }
                        onChange={handleEpochChange}
                        value={epoch}
                        defaultValue={
                          AlgoProjectSettings[selectedAlgorithm.training_framework.name].epoch
                            .defaultValue
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="epoch"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: (
                            <FormattedMessage
                              id="pages.createTask.epochRequired"
                              defaultMessage="請設置訓練迭代次數"
                            />
                          ),
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        value={epoch}
                        onChange={(e) => handleEpochChange(Number(e.target.value))}
                        defaultValue={
                          AlgoProjectSettings[selectedAlgorithm.training_framework.name].epoch
                            .defaultValue
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label={
                  <FormattedMessage id={`pages.createTask.valRatio`} defaultMessage="驗證集比例" />
                }
              >
                <Row gutter={8}>
                  <Col span={16}>
                    <Form.Item name="trainValRatio" noStyle>
                      <Slider
                        min={
                          AlgoProjectSettings[selectedAlgorithm.training_framework.name].val
                            .range[0]
                        }
                        max={
                          AlgoProjectSettings[selectedAlgorithm.training_framework.name].val
                            .range[1]
                        }
                        step={
                          AlgoProjectSettings[selectedAlgorithm.training_framework.name].val.step
                        }
                        onChange={handleTrainValRatioChange}
                        value={trainValRatio}
                        defaultValue={
                          AlgoProjectSettings[selectedAlgorithm.training_framework.name].val
                            .defaultValue
                        }
                      />
                      {selectedDataset && trainValRatio && (
                        <>
                          <Tag color="volcano">
                            <FormattedMessage
                              id="pages.createTask.estimatedTrainSetSize"
                              defaultMessage="預估訓練集數量"
                            />{' '}
                            {`${Math.ceil(
                              selectedDataset?.valid_images_num * (1 - trainValRatio),
                            )}`}
                          </Tag>
                          <Tag color="purple">
                            <FormattedMessage
                              id="pages.createTask.estimatedValSetSize"
                              defaultMessage="預估驗證集數量"
                            />{' '}
                            {`${Math.floor(selectedDataset?.valid_images_num * trainValRatio)}`}
                          </Tag>
                        </>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="trainValRatio"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: (
                            <FormattedMessage
                              id="pages.createTask.valRequired"
                              defaultMessage="請設置驗證集比例"
                            />
                          ),
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        step={
                          AlgoProjectSettings[selectedAlgorithm.training_framework.name].val.step
                        }
                        value={trainValRatio}
                        onChange={(e) => handleTrainValRatioChange(Number(e.target.value))}
                        defaultValue={
                          AlgoProjectSettings[selectedAlgorithm.training_framework.name].val
                            .defaultValue
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Tooltip
              title={
                disableSubmit ? (
                  <FormattedMessage
                    id="pages.createTask.confirmAllParameters"
                    defaultMessage="請確認所有參數都已設置"
                  />
                ) : (
                  ''
                )
              }
            >
              <Button type="primary" htmlType="submit" disabled={disableSubmit}>
                <FormattedMessage id="pages.createTask.createTask" defaultMessage="創建任務" />
              </Button>
            </Tooltip>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => {
                setSelectedAlgorithm(undefined);
                setSelectedGpu(0);
                setSelectedAlgorithmId('');
                form.setFieldsValue(initialValues);
              }}
            >
              <FormattedMessage id="pages.createTask.reset" defaultMessage="重置" />
            </Button>
          </Form.Item>
        </Form>
        <Drawer
          open={datasetDetailModalOpen}
          title={
            <FormattedMessage
              id="pages.createTask.datasetDetails"
              defaultMessage="Dataset Details"
            />
          }
          footer={null}
          width={800}
          onClose={() => setDatasetDetailModalOpen(false)}
        >
          {selectedDataset && <DatasetDetails dataset={selectedDataset} />}
        </Drawer>
        <Drawer
          open={trainingConfigModalOpen}
          title={
            <FormattedMessage
              id="pages.createTask.trainingConfigurations"
              defaultMessage="Training Configurations"
            />
          }
          footer={null}
          width={800}
          onClose={() => setTrainingConfigModalOpen(false)}
        >
          {selectedTrainingConfigData && <UserConfigDisplay config={selectedTrainingConfigData} />}
        </Drawer>
      </Spin>
      <CreateTaskStatus state={createTaskState} />
    </Card>
  );
};

export default TrainingConfigForm;
