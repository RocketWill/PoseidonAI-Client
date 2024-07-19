import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage, history, useIntl, useModel, Helmet } from '@umijs/max';
import moment from 'moment';
import { createDataset, listDataset, deleteDataset } from '@/services/ant-design-pro/dataset';
import { PageContainer } from '@ant-design/pro-components';
import { Typography, Table, Tag, Card, theme, message, Spin, Modal, Descriptions, Empty, Space, Badge } from 'antd';
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
            title: <FormattedMessage id='pages.dataset.display.name' defaultMessage='名稱' />,
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (text: any) => <a>{text}</a>,
        },
        {
            title: <FormattedMessage id='pages.dataset.display.detectTypes' defaultMessage='檢測類型' />,
            dataIndex: 'type',
            key: 'type',
            width: 150,
            render: (types: string[]) => (<>
                {types.map((type: string, i: number) => <Tag key={`${type}-${i}`}>{type.toUpperCase()}</Tag>)}
            </>)
        },
        {
            title: <FormattedMessage id='pages.dataset.display.datasetFormat' defaultMessage='資料格式' />,
            dataIndex: 'dataset_format',
            key: 'dataset_format',
            width: 200,
            render: (formats: string[]) => (<>
                {formats.map((format: string, i: number) => <Tag key={`${format}-${i}`}>{format.toUpperCase()}</Tag>)}
            </>)
        },
        {
            title: <FormattedMessage id='pages.dataset.display.validImages' defaultMessage='帶標注圖片數量' />,
            dataIndex: 'norfimage',
            key: 'norfimage',
            width: 120
        },
        {
            title: <FormattedMessage id='pages.dataset.display.createdAt' defaultMessage='創建日期' />,
            dataIndex: 'create_date',
            key: 'create_date',
            width: 150
        },
        {
            title: <FormattedMessage id='pages.dataset.display.description' defaultMessage='描述' />,
            key: 'description',
            dataIndex: 'description'
        },
        {
            title: <FormattedMessage id='pages.dataset.display.action' defaultMessage='操作' />,
            key: 'action',
            dataIndex: 'action',
            width: 120,
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
                label: <FormattedMessage id='pages.dataset.display.createdAt' defaultMessage='創建日期' />,
                children: moment(dataset.created_at).format('YYYY-MM-DD HH:mm')
            },
            {
                key: 2,
                label: <FormattedMessage id='pages.dataset.display.datasetFormat' defaultMessage='資料格式' />,
                children: <>{dataset.format.map((format: string, i: number) =>
                    <Tag key={`${i}-${format}`}>{format.toUpperCase()}</Tag>)}</>
            },
            {
                key: 3,
                label: <FormattedMessage id='pages.dataset.display.description' defaultMessage='描述' />,
                children: dataset.description
            },
            {
                key: 4,
                label: <FormattedMessage id='pages.dataset.display.validImages' defaultMessage='帶標注圖片數量' />,
                children: dataset.valid_images_num
            },
            {
                key: 5,
                label: <FormattedMessage id='pages.dataset.display.imageList' defaultMessage='圖片列表' />,
                children: <Space direction='vertical'>{dataset.image_files.map((image_file: string, i: number) =>
                    <Badge key={`${i}-${image_file}`} status="success" text={image_file} />)}</Space>
            },
            {
                key: 6,
                label: <FormattedMessage id='pages.dataset.display.labelFile' defaultMessage='標注文件' />,
                children: <p>{dataset.label_file}</p>
            }
        ];
        setDatasetDetail(<Descriptions title={dataset.name} layout="vertical" bordered items={items} />)
        setDatasetModalOpen(true);
    }

    const handleDeleteDataset = async (dataset_id: string) => {
        const result = await deleteDataset(dataset_id)
        if (result.code === 200) {
            message.success(<FormattedMessage id='pages.dataset.display.deleteSuccess' defaultMessage='刪除成功' />);
        }
        else {
            message.error(`${<FormattedMessage id='pages.dataset.display.deleteFail' defaultMessage='刪除失敗' />}: ${result.msg}`);
        }
        setDeleteModalOpen(false)
    }

    const beforeJsonUpload = (file: any) => {
        // 检查文件类型
        const isJson = file.type === 'application/json';
        if (!isJson) {
            message.error(<FormattedMessage id='pages.dataset.display.onlyOneJson' defaultMessage='只能上傳一個 Json 文件' />);
        }
        return isJson;
    };

    const beforeImageUpload = (file: any) => {
        // 检查文件类型
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error(<FormattedMessage id='pages.dataset.display.onlyImageFile' defaultMessage='只能上傳圖片資料' />);
        }
        // 检查文件大小，小于200MB
        const isLt200MB = file.size / 1024 / 1024 < 200;
        if (!isLt200MB) {
            message.error(<FormattedMessage id='pages.dataset.display.lt200mb' defaultMessage='圖片大小不能超過200MB' />);
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
            message.success(<FormattedMessage id='pages.dataset.display.createSuccess' defaultMessage='創建成功' />);
        }
        else {
            message.error(`${<FormattedMessage id='pages.dataset.display.createFail' defaultMessage='創建失敗' />}: ${result.msg}`);
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
                    dataset_format: dataset.format,
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
                <Title level={3}><FormattedMessage id='pages.dataset.table.createdDataset' defaultMessage='已創建的資料集' /></Title>
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
                    {showDatasets.length === 0 && <Empty />}
                    {showDatasets.length > 0 && <Table dataSource={showDatasets} columns={columns} />}
                </Card>

                <Title level={3} style={{ marginTop: 40 }}><FormattedMessage id='pages.dataset.table.createDataset' defaultMessage='建立新的資料集' /></Title>
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
                                label={<FormattedMessage id='pages.dataset.display.name' defaultMessage='名稱' />}
                                name="name"
                                rules={[{ required: true, message: <FormattedMessage id='pages.dataset.display.enterDatasetName' defaultMessage='請輸入資料集名稱' /> }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='pages.dataset.display.detectTypes' defaultMessage='檢測類型' />} name="detect_types" rules={[{ required: true, message: <FormattedMessage id='pages.dataset.display.selectDetectTypes' defaultMessage='請選擇檢測類型' /> }]}>
                                <Select mode="multiple">
                                    <Select.Option value="det">Detection</Select.Option>
                                    <Select.Option value="seg">Segmentation</Select.Option>
                                    <Select.Option value="cls">Classification</Select.Option>
                                    <Select.Option value="kpts">Keypoints</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='pages.dataset.display.description' defaultMessage='描述' />} name="description">
                                <Input />
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='pages.dataset.display.cocoStyleLabelFile' defaultMessage='標注文件（MSCOCO 格式）' />} name="label_file" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: <FormattedMessage id='pages.dataset.display.uploadLabelFile' defaultMessage='請上傳標注文件' /> }]}>
                                <Upload {...jsonUploadProps} >
                                    <Button><FormattedMessage id='pages.dataset.display.clickToUpload' defaultMessage='點擊上傳' /></Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='pages.dataset.display.images' defaultMessage='圖片' />} name="image_list" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: <FormattedMessage id='pages.dataset.display.uploadImages' defaultMessage='請上傳圖片' /> }]}>
                                <Dragger {...imageUploadProps} >
                                    <p className="ant-upload-drag-icon">
                                    </p>
                                    <p className="ant-upload-text"><FormattedMessage id='pages.dataset.display.clickOrDragToUpload' defaultMessage='點擊或拖動上傳' /></p>
                                    <p className="ant-upload-hint">
                                        <FormattedMessage id='pages.dataset.display.uploadDescription' defaultMessage='支持單個或批量上傳。嚴禁上傳私人數據或其他禁止的文件' />
                                    </p>
                                </Dragger>
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='pages.dataset.display.datasetFormatTitle' defaultMessage='資料集格式（MSCOCO 為默認必選）' />} name="dataset_format" rules={[{ required: true, message: <FormattedMessage id='pages.dataset.display.selectDatasetFormat' defaultMessage='請選擇資料集格式' /> }]}>
                                <Select mode="multiple">
                                    <Select.Option value="mscoco">MSCOCO</Select.Option>
                                    <Select.Option value="yolo">YOLO</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    <FormattedMessage id='pages.dataset.display.submit' defaultMessage='提交' />
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Card>
            </Card>
            <Modal style={{ minWidth: 800 }} title={<FormattedMessage id='pages.dataset.display.datasetDetail' defaultMessage='資料集詳情' />} open={datasetModalOpen} onOk={() => setDatasetModalOpen(false)} onCancel={() => setDatasetModalOpen(false)}>
                {datasetDetail}
            </Modal>
            <Modal style={{ minWidth: 200 }} title={<FormattedMessage id='pages.dataset.display.deleteDataset' defaultMessage='刪除資料集' />} open={deleteModalOpen} onOk={() => handleDeleteDataset(deleteDatasetIdRef.current)} onCancel={() => setDeleteModalOpen(false)} >

                <FormattedMessage id='pages.dataset.display.confirmDeleteDataset' defaultMessage='確定要刪除該資料集嗎？此操作將無法還原' />
            </Modal>
        </PageContainer>

    );
}

export default Dataset;