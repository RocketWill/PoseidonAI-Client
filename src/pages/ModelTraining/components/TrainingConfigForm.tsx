/* eslint-disable */
import { TrainingConfigItem } from '@/pages/Configuration';
import { listAlgorithms } from '@/services/ant-design-pro/algorithms';
import { findByFormatAndDetectType } from '@/services/ant-design-pro/dataset';
import { findByUserAndFramework } from '@/services/ant-design-pro/trainingConfig';
import { generateRandomName } from '@/utils/tools';
import { Button, Card, Col, Form, Input, Row, Select, Slider, Tag, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { AlgorithmItem } from '..';
import AlgorithmSelector from './AlgorithmSelector';
import GPUSelector from './GPUSelector';
import './TrainingConfigForm.css'; // 引入CSS文件

const { Title, Text } = Typography;
const { Option } = Select;

interface FilteredDatasetItem {
  _id: string;
  name: string;
  description: string;
  valid_images_num: number;
  created_at: string;
}

interface FilteredDatasets {
  dataset_format: {
    name: string;
  };
  datasets: FilteredDatasetItem[];
  detect_type: {
    name: string;
    tag_name: string;
  };
}

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
  setDatasetData: (data: FilteredDatasets) => void,
) => {
  const data = await findByFormatAndDetectType(datasetFormatId, detectTypeId);
  setDatasetData(data.results);
};

const fetchFrameworksById = async (
  trainingFrameworkId: string,
  setFrameworksData: (data: TrainingConfigItem[]) => void,
) => {
  const data = await findByUserAndFramework(trainingFrameworkId);
  setFrameworksData(data.results);
};

const TrainingConfigForm = () => {
  const [algorithmData, setAlgorithmData] = useState<AlgorithmItem[]>([]);
  const [form] = Form.useForm();
  const [epoch, setEpoch] = useState(10);
  const [trainValRatio, setTrainValRatio] = useState(0.8);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [selectedGpu, setSelectedGpu] = useState<number>(0);
  const [datasetData, setDatasetData] = useState<FilteredDatasets | undefined>(undefined);
  const [trainingConfigData, setTrainingConfigsData] = useState<TrainingConfigItem[] | undefined>(
    undefined,
  );
  const taskName = `Training-Task__${generateRandomName()}`;
  const handleSubmit = (values: any) => {
    console.log('Form Values:', values);
  };

  const handleEpochChange = (value: number) => {
    setEpoch(value);
    form.setFieldsValue({ epoch: value });
  };

  const handleTrainValRatioChange = (value: number) => {
    setTrainValRatio(value);
    form.setFieldsValue({ trainValRatio: value });
  };

  useEffect(() => {
    fetchAlgorithmData(setAlgorithmData);
    form.setFieldsValue({ gpu: selectedGpu });
  }, []);

  useEffect(() => {
    form.setFieldsValue({ algorithm: selectedAlgorithm });
    const selectedAlgoItem = algorithmData.find(
      (item: AlgorithmItem) => item._id === selectedAlgorithm,
    );
    if (selectedAlgoItem) {
      const detectTypeId = selectedAlgoItem.detect_type._id;
      const trainingFrameworkId = selectedAlgoItem.training_framework._id;
      const datasetFormatId = selectedAlgoItem.training_framework.dataset_format._id;
      fetchDatasetsByFormatAndType(datasetFormatId, detectTypeId, setDatasetData);
      fetchFrameworksById(trainingFrameworkId, setTrainingConfigsData);
    }
    form.setFieldsValue({ dataset: undefined });
  }, [selectedAlgorithm]);

  useEffect(() => {
    form.setFieldsValue({ gpu: selectedGpu });
  }, [selectedGpu]);

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
      <Title level={4}>創建訓練任務</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: taskName,
          description: '',
          algorithm: 'YOLOv8 目標檢測',
          dataset: undefined,
          config: undefined,
          gpu: selectedGpu,
          epoch: 30,
          trainValRatio: 0.1,
        }}
        style={{ marginTop: 40 }}
      >
        <Form.Item label="名稱" name="name" rules={[{ required: true, message: '請輸入任務名稱' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="説明"
          name="description"
          rules={[{ required: false, message: '請輸入任務説明' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="選擇訓練的算法"
          name="algorithm"
          rules={[{ required: true, message: '請選擇訓練的算法' }]}
        >
          <AlgorithmSelector
            data={algorithmData}
            onChange={setSelectedAlgorithm}
            activeId={selectedAlgorithm}
          />
        </Form.Item>
        <Form.Item
          label="選擇訓練集數據"
          name="dataset"
          rules={[{ required: true, message: '請選擇訓練集數據' }]}
        >
          <Select
            disabled={datasetData ? false : true}
            placeholder={datasetData ? '請選擇資料集' : '請先選擇訓練演算法'}
          >
            {/* <Option value="Dataset1">Dataset1</Option>
            <Option value="Dataset2">Dataset2</Option>
            <Option value="Dataset3">Dataset3</Option> */}
            {datasetData &&
              datasetData.datasets.length &&
              datasetData.datasets.map((item: FilteredDatasetItem) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                  <Tag style={{ marginLeft: 10 }} color="blue">
                    有效圖像 {item.valid_images_num} 張
                  </Tag>
                  <Tag color="green">創建日期 {moment(item.created_at).format('YYYY-MM-DD')}</Tag>
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="選擇模型參數配置"
          name="config"
          rules={[{ required: true, message: '請選擇模型參數配置' }]}
        >
          <Select
            disabled={trainingConfigData ? false : true}
            placeholder={trainingConfigData ? '請選擇訓練配置' : '請先選擇訓練演算法'}
          >
            {/* <Option value="Config1">Config1</Option>
            <Option value="Config2">Config2</Option>
            <Option value="Config3">Config3</Option> */}
            {trainingConfigData &&
              trainingConfigData.length &&
              trainingConfigData.map((item: TrainingConfigItem) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                  <Tag style={{ marginLeft: 10 }} color="green">
                    創建日期 {moment(item.created_at).format('YYYY-MM-DD')}
                  </Tag>
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="選擇GPU卡"
          name="gpu"
          rules={[{ required: true, message: '請選擇GPU卡' }]}
        >
          <GPUSelector onChange={setSelectedGpu} activeId={selectedGpu} />
        </Form.Item>
        <Form.Item label="設置訓練epoch">
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item name="epochSlider" noStyle>
                <Slider min={30} max={150} onChange={handleEpochChange} value={epoch} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="epoch"
                noStyle
                rules={[{ required: true, message: '請設置訓練epoch' }]}
              >
                <Input
                  type="number"
                  value={epoch}
                  onChange={(e) => handleEpochChange(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="設置val比例">
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item name="trainValRatioSlider" noStyle>
                <Slider
                  min={0.1}
                  max={0.8}
                  step={0.01}
                  onChange={handleTrainValRatioChange}
                  value={trainValRatio}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="trainValRatio"
                noStyle
                rules={[{ required: true, message: '請設置val比例' }]}
              >
                <Input
                  type="number"
                  step={0.01}
                  value={trainValRatio}
                  onChange={(e) => handleTrainValRatioChange(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            創建任務
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => form.resetFields()}>
            重置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TrainingConfigForm;
