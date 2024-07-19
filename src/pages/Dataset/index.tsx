import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage, history, useIntl, useModel, Helmet } from '@umijs/max';
import moment from 'moment';
import { createDataset, listDataset, deleteDataset } from '@/services/ant-design-pro/dataset';
import { PageContainer } from '@ant-design/pro-components';
import { Typography, Table, Tag, Card, theme, message, Spin, Modal, Descriptions } from 'antd';
import {
    Button,
    Form,
    Input,
    Select,
    Upload
  } from 'antd';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons'

interface DatasetItem {
    _id: string;
    name: string;
    detect_types: string[];
    created_at: string;
    valid_images_num: number;
    description: string;
    format: string;
    image_files: string[];
    label_file: string;
}

const { Title } = Typography;
const { Dragger } = Upload;

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};


const Dataset: React.FC = () => {
    const { initialState, setInitialState } = useModel('@@initialState');
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const [datasets, setDatasets] = useState<DatasetItem[]>([]);
    const [showDatasets, setShowDatasets] = useState<any[]>([]);
    const [datasetDetail, setDatasetDetail] = useState<React.ReactNode>(null);
    const [datasetModalOpen, setDatasetModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [imgList, setImgList] = useState<any[]>([]); // 根据实际需要定义类型
    const [jsonFile, setJsonFile] = useState<any>(null); // 用于存储 JSON 文件
    const { useToken } = theme;
    const { token } = useToken();
    const deleteDatasetIdRef = useRef<string>('');

    const columns = [
        {
          title: '名稱',
          dataIndex: 'name',
          key: 'name',
          render: (text: any) => <a>{text}</a>,
        },
        {
          title: '檢測類型',
          dataIndex: 'type',
          key: 'type',
          render: (ts: string[]) => (<>
            {ts.map((t: string, i: number) => <Tag key={`${t}-${i}`}>{t}</Tag>)} 
          </>)
        },
        {
            title: '有效圖片數',
            dataIndex: 'norfimage',
            key: 'norfimage',
        },
        {
          title: '創建日期',
          dataIndex: 'create_date',
          key: 'create_date',
        },
        {
          title: '描述',
          key: 'description',
          dataIndex: 'description'
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: 'action',
            render: (dataset_id: string) => (
            <>
                <Button
                    type="text"
                    icon={<InfoCircleOutlined />}
                    onClick={() => handleEditDataset(dataset_id)}
                />
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                        deleteDatasetIdRef.current = dataset_id
                        setDeleteModalOpen(true)
                    }}
                />
            </>)
        }
    ];

    const handleEditDataset = (dataset_id: string) => {
        const dataset = datasets.filter(dataset => dataset._id === dataset_id)[0];
        const items = [
            {
                key: 1,
                label: 'Created date',
                children: moment(dataset.created_at).format('YYYY-MM-DD HH:mm')
            },
            {
                key: 2,
                label: 'Fromat',
                children: dataset.format
            },
            {
                key: 3,
                label: 'Description',
                children: dataset.description
            },
            {
                key: 4,
                label: 'Valid number of images',
                children: dataset.valid_images_num
            },
            {
                key: 5,
                label: 'Image files',
                children: <>{dataset.image_files.map((image_file, i) => <p key={`${i}-${image_file}`}>{image_file}</p>)}</>
            },
            {
                key: 6,
                label: 'Label file',
                children: <p>{dataset.label_file}</p>
            }
        ];
        setDatasetDetail(<Descriptions title={dataset.name} layout="vertical" bordered items={items} />)
        setDatasetModalOpen(true);
    }
    
    const handleDeleteDataset = async(dataset_id: string) => {
        const result = await deleteDataset(dataset_id)
        if (result.code === 200)
        {
            message.success("刪除資料集成功");
        }
        else {
            message.error(`刪除資料集失敗，原因：${result.msg}`);
        }
        setDeleteModalOpen(false)
    }

    const beforeJsonUpload = (file: any) => {
        // 检查文件类型
        const isJson = file.type === 'application/json';
        if (!isJson) {
          message.error('只能上傳一個 JSON 文件！');
        }
        return isJson;
      };

    const beforeImageUpload = (file: any) => {
        // 检查文件类型
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          message.error('只能上傳圖片文件！');
        }
        // 检查文件大小，小于200MB
        const isLt200MB = file.size / 1024 / 1024 < 200;
        if (!isLt200MB) {
          message.error('圖片文件大小不能超過200MB！');
        }
        return isImage && isLt200MB;
      };

    const onJsonChange = ({ fileList: newFileList }) => {
    const file = newFileList[newFileList.length - 1]; // 获取最后一个文件
    setJsonFile(file); // 设置 JSON 文件
    };

    const onImageChange = ({ fileList: newFileList }) => {
        console.log(newFileList)
        setImgList(newFileList);
    };
    
    const jsonUploadProps = {
        multiple: false,
        beforeUpload: beforeJsonUpload,
        onChange: onJsonChange,
        fileList: jsonFile ? [jsonFile] : [],
        accept: '.json', // 只允许上传 JSON 文件
    };

    const imageUploadProps = {
        multiple: true,
        beforeUpload: beforeImageUpload,
        onChange: onImageChange,
        imgList,
    };

    const onFinish = async (values: any) => {
        setUploadLoading(true);
        const formData = new FormData();
        formData.append('data', JSON.stringify(values)); // 表单数据
        if (jsonFile) {
            formData.append('jsonFile', jsonFile.originFileObj); // JSON 文件
        }
        // 添加所有图片文件
        imgList.forEach(file => {
            formData.append('imageFiles', file.originFileObj); // 图片文件
        });
        const result = await createDataset(formData);
        if (result.code === 200) {
            message.success("創建數據集成功");
        }
        else {
            message.error(`創建數據集失敗，原因: ${result.msg}`);
        }
        form.resetFields();
        setUploadLoading(false);
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const result = await listDataset();
                const datasetList = result.map((dataset: DatasetItem, i: number) => ({
                    key: `${i}`,
                    name: dataset.name,
                    type: dataset.detect_types,
                    create_date: moment(dataset.created_at).format('YYYY-MM-DD HH:mm'),
                    norfimage: dataset.valid_images_num,
                    description: dataset.description,
                    action: dataset._id
                }));
                setDatasets(result);
                setShowDatasets(datasetList);
            } catch (error) {
                console.error('Fetch datasets error:', error);
                message.error('Fetch datasets error');
            }
        };
        fetchDatasets();
    }, [uploadLoading, deleteModalOpen]);

    return (
        <PageContainer>
            <Card>
                <Title level={3}>已創建的資料集</Title>
                <Card
                    style={{
                        backgroundColor: token.colorBgContainer,
                        boxShadow: token.boxShadow,
                        borderRadius: '8px',
                        color: token.colorTextSecondary,
                        padding: '16px 19px',
                        minWidth: '220px',
                        flex: 1
                    }}
                >
                    {showDatasets.length && <Table dataSource={showDatasets} columns={columns} />}
                </Card>

                <Title level={3} style={{ marginTop: 40 }}>建立新的資料集</Title>
                <Card
                    style={{
                        backgroundColor: token.colorBgContainer,
                        boxShadow: token.boxShadow,
                        borderRadius: '8px',
                        color: token.colorTextSecondary,
                        padding: '16px 19px',
                        minWidth: '220px',
                        flex: 1
                    }}
                >
                <Spin spinning={uploadLoading}>
                    <Form
                        form={form}
                        layout="horizontal"
                        size='middle'
                        style={{ maxWidth: 600 }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item 
                            label="名稱"
                            name="name"
                            rules={[{ required: true, message: '請輸入資料集名稱' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item label="檢測類型" name="detect_types" rules={[{ required: true, message: '請選擇檢測類型' }]}>
                            <Select mode="multiple">
                                <Select.Option value="det">Detection</Select.Option>
                                <Select.Option value="seg">Segmentation</Select.Option>
                                <Select.Option value="cls">Classification</Select.Option>
                                <Select.Option value="kpts">Keypoints</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="描述" name="description">
                            <Input />
                        </Form.Item>
                        <Form.Item label="標注文件（MSCOCO 格式）" name="label_file" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: '請上傳標注文件' }]}>
                            <Upload {...jsonUploadProps} >
                                <Button>點擊上傳</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label="圖片" name="image_list" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: '請上傳圖片' }]}>
                            <Dragger {...imageUploadProps} >
                                <p className="ant-upload-drag-icon">
                                </p>
                                <p className="ant-upload-text">點擊或拖動上傳</p>
                                <p className="ant-upload-hint">
                                    支持單個或批量上傳。嚴禁上傳私人數據或其他禁止的文件。
                                </p>
                            </Dragger>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
                </Card>
            </Card>
            <Modal style={{ minWidth: 800 }} title="資料集詳情" open={datasetModalOpen} onOk={() => setDatasetModalOpen(false)} onCancel={() => setDatasetModalOpen(false)}>
                {datasetDetail}
            </Modal>
            <Modal style={{ minWidth: 200 }} title="删除資料集" open={deleteModalOpen} onOk={() => handleDeleteDataset(deleteDatasetIdRef.current)} onCancel={() => setDeleteModalOpen(false)} >
                確定要刪除該資料集嗎？此操作將無法還原
            </Modal>
        </PageContainer>

    );
}

export default Dataset;