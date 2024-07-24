import React, { useState, useEffect, useRef } from 'react';
import {
    FormattedMessage,
    history,
    useIntl,
    useModel,
    Helmet
} from '@umijs/max';
import moment from 'moment';
import {
    createDataset,
    listDataset,
    deleteDataset,
    visDataset,
    checkVisDatasetDirExist,
    getVisDatasetStatus
} from '@/services/ant-design-pro/dataset';
import { listDetectTypes } from '@/services/ant-design-pro/detectType';
import { listDatasetFormats } from '@/services/ant-design-pro/datasetFormat'
import { PageContainer } from '@ant-design/pro-components';
import {
    Typography,
    Table,
    Tag,
    Card,
    theme,
    message,
    Spin,
    Modal,
    Descriptions,
    Empty,
    Space,
    Badge,
    Image
} from 'antd';
import {
    Button,
    Form,
    Input,
    Select,
    Upload
} from 'antd';
import {
    DeleteOutlined,
    InfoCircleOutlined,
    CheckOutlined,
    Loading3QuartersOutlined
} from '@ant-design/icons';
import { forEach } from 'lodash';

interface DatasetItem {
    _id: string;
    name: string;
    detect_type_id: string;
    created_at: string;
    valid_images_num: number;
    description: string;
    dataset_format_ids: string[];
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
    const [dataLoaded, setDataLoaded] = useState(false);
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const [datasets, setDatasets] = useState<DatasetItem[]>([]);
    const [showDatasets, setShowDatasets] = useState<any[]>([]);
    const [datasetDetail, setDatasetDetail] = useState<React.ReactNode>(null);
    const [datasetModalOpen, setDatasetModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [imgList, setImgList] = useState<any[]>([]);
    const [jsonFile, setJsonFile] = useState<any>(null);
    const [visDatasetLoading, setVisDatasetLoading] = useState<boolean>(false);
    const [visImageList, setVisImageList] = useState<string[]>([]);
    const [detectTypes, setDetectTypes] = useState<any[]>([]);
    const [datasetFormats, setDatasetFormats] = useState<any[]>([]);
    const { useToken } = theme;
    const { token } = useToken();
    const deleteDatasetIdRef = useRef<string>('');
    const currentVisDatasetId = useRef<string>('');
    const imageRef = useRef<string>('');
    const imageTitleRef = useRef<string>('');

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
            render: (type: string) => <Tag>{type.toUpperCase()}</Tag>,
        },
        {
            title: <FormattedMessage id='pages.dataset.display.datasetFormat' defaultMessage='資料格式' />,
            dataIndex: 'datasetFormat',
            key: 'datasetFormat',
            width: 200,
            render: (formats: string[]) => (
                <>
                    {formats.map((format: string, i: number) => (
                        <Tag key={`${format}-${i}`}>{format.toUpperCase()}</Tag>
                    ))}
                </>
            ),
        },
        {
            title: <FormattedMessage id='pages.dataset.display.validImages' defaultMessage='帶標注圖片數量' />,
            dataIndex: 'validImagesNum',
            key: 'validImagesNum',
            width: 120,
        },
        {
            title: <FormattedMessage id='pages.dataset.display.createdAt' defaultMessage='創建日期' />,
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
        },
        {
            title: <FormattedMessage id='pages.dataset.display.description' defaultMessage='描述' />,
            key: 'description',
            dataIndex: 'description',
        },
        {
            title: <FormattedMessage id='pages.dataset.display.action' defaultMessage='操作' />,
            key: 'action',
            dataIndex: 'action',
            width: 120,
            render: (datasetId: string) => (
                <>
                    <Button
                        type="text"
                        icon={<InfoCircleOutlined />}
                        onClick={() => handleEditDataset(datasetId)}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            deleteDatasetIdRef.current = datasetId;
                            setDeleteModalOpen(true);
                        }}
                    />
                </>
            ),
        },
    ];

    const handleVisDataset = async (datasetId: string) => {
        console.log('Starting visualization task...');
        setVisDatasetLoading(true);
        const resp = await visDataset(datasetId);
        const taskId = resp.results;

        const fetchTaskProgress = async () => {
            const progressRes = await getVisDatasetStatus(taskId);
            handleEditDataset(currentVisDatasetId.current);
            console.log('Task progress:', progressRes);
            if (progressRes.results === 'SUCCESS' || progressRes.results === 'FAILURE') {
                clearInterval(intervalId);
                setVisDatasetLoading(false);
                console.log('Task completed');
            } else {
                console.log('Task still in progress');
            }
        };

        const intervalId = setInterval(fetchTaskProgress, 2000);
    };

    const handleDisplayVisDatasetLabel = (
        datasetId: string,
        imageFiles: string[],
        visualizedFiles: string[]
    ) => {
        if (!visualizedFiles.length) {
            return (
                <Button
                    size="small"
                    style={{ marginLeft: 15 }}
                    loading={visDatasetLoading}
                    onClick={() => handleVisDataset(datasetId)}
                >
                    <FormattedMessage
                        id="pages.dataset.display.visualizeAnnotations"
                        defaultMessage="視覺化標注"
                    />
                </Button>
            );
        } else if (imageFiles.length !== visualizedFiles.length) {
            return (
                <Tag color="orange" style={{ marginLeft: 15 }}>
                    <Loading3QuartersOutlined />
                    <span />
                    <FormattedMessage
                        id="pages.dataset.display.visualized"
                        defaultMessage="部分已視覺化"
                    />
                </Tag>
            );
        } else {
            return (
                <Tag color="green" style={{ marginLeft: 15 }}>
                    <CheckOutlined />
                    <span />
                    <FormattedMessage
                        id="pages.dataset.display.visualized"
                        defaultMessage="視覺化"
                    />
                </Tag>
            );
        }
    };

    const handleDisplayImage = (link: string, imageFile: string) => {
        imageRef.current = link;
        imageTitleRef.current = imageFile;
        setImageModalOpen(true);
    };

    const handleDisplayVisDatasetChildren = (
        dataset: any,
        visualizedFiles: string[]
    ) => {
        const imageList = (imageFile: string, i: number) => {
            const {
                currentUser: { userid },
            } = initialState;
            if (visualizedFiles.includes(imageFile)) {
                const link = `http://localhost:8000/static/dataset_visualization/${userid}/${dataset.save_key}/${imageFile}`;
                return (
                    <Badge
                        key={`${i}-${imageFile}`}
                        status="success"
                        text={<a>{imageFile}</a>}
                        onClick={() => handleDisplayImage(link, imageFile)}
                    />
                );
            }
            return <Badge key={`${i}-${imageFile}`} status="default" text={imageFile} />;
        };

        return (
            <Space direction="vertical">
                {dataset.image_files.map((imageFile: string, i: number) =>
                    imageList(imageFile, i)
                )}
            </Space>
        );
    };

    const handleEditDataset = async (datasetId: string) => {
        if (!datasetId) return;
        console.log('Editing dataset:', datasetId);
        currentVisDatasetId.current = datasetId;
        const resp = await checkVisDatasetDirExist(datasetId);
        const visualizedFiles = resp.results.files;
        const dataset = datasets.filter((dataset) => dataset._id === datasetId)[0];
        const datasetFormat = dataset.dataset_format_ids.map(id => {
            const foundItem = datasetFormats.find(item => item._id === id);
            return foundItem ? foundItem.name : null;
        });
        const typeItem = detectTypes.find(item => item._id === dataset.detect_type_id);

        const items = [
            {
                key: 1,
                label: (
                    <FormattedMessage
                        id="pages.dataset.display.createdAt"
                        defaultMessage="創建日期"
                    />
                ),
                children: moment(dataset.created_at).format('YYYY-MM-DD HH:mm'),
            },
            {
                key: 2,
                label: (
                    <FormattedMessage
                        id="pages.dataset.display.datasetFormat"
                        defaultMessage="資料格式"
                    />
                ),
                children: (
                    <>
                        {datasetFormat.map((format: string, i: number) => (
                            <Tag key={`${i}-${format}`}>{format.toUpperCase()}</Tag>
                        ))}
                    </>
                ),
            },
            {
                key: 3,
                label: (
                    <FormattedMessage
                        id="pages.dataset.display.description"
                        defaultMessage="描述"
                    />
                ),
                children: dataset.description,
            },
            {
                key: 4,
                label: (
                    <FormattedMessage
                        id="pages.dataset.display.validImages"
                        defaultMessage="帶標注圖片數量"
                    />
                ),
                children: dataset.valid_images_num,
            },
            {
                key: 5,
                span: { xs: 1, sm: 1, md: 1, lg: 1, xl: 2, xxl: 2 },
                label: (
                    <>
                        <FormattedMessage
                            id="pages.dataset.display.imageList"
                            defaultMessage="圖片列表"
                        />
                        {handleDisplayVisDatasetLabel(
                            datasetId,
                            dataset.image_files,
                            visualizedFiles
                        )}
                    </>
                ),
                children: handleDisplayVisDatasetChildren(dataset, visualizedFiles),
            },
            {
                key: 6,
                label: (
                    <FormattedMessage
                        id="pages.dataset.display.labelFile"
                        defaultMessage="標注文件"
                    />
                ),
                children: <p>{dataset.label_file}</p>,
            },
            {
                key: 7,
                label: (
                    <FormattedMessage
                        id="pages.dataset.display.detectTypes"
                        defaultMessage="檢測類型"
                    />
                ),
                children: <Tag>{typeItem.tag_name.toUpperCase()}</Tag> ,
            },
        ];
        setDatasetDetail(
            <Descriptions title={dataset.name} layout="vertical" bordered items={items} />
        );
        setDatasetModalOpen(true);
    };

    const handleDeleteDataset = async (datasetId: string) => {
        const result = await deleteDataset(datasetId);
        if (result.code === 200) {
            message.success(
                <FormattedMessage
                    id="pages.dataset.display.deleteSuccess"
                    defaultMessage="刪除成功"
                />
            );
        } else {
            message.error(
                `${(
                    <FormattedMessage
                        id="pages.dataset.display.deleteFail"
                        defaultMessage="刪除失敗"
                    />
                )}: ${result.msg}`
            );
        }
        setDeleteModalOpen(false);
    };

    const beforeJsonUpload = (file: any) => {
        const isJson = file.type === 'application/json';
        if (!isJson) {
            message.error(
                <FormattedMessage
                    id="pages.dataset.display.onlyOneJson"
                    defaultMessage="只能上傳一個 Json 文件"
                />
            );
        }
        return isJson;
    };

    const beforeImageUpload = (file: any) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error(
                <FormattedMessage
                    id="pages.dataset.display.onlyImageFile"
                    defaultMessage="只能上傳圖片資料"
                />
            );
        }
        const isLt200MB = file.size / 1024 / 1024 < 200;
        if (!isLt200MB) {
            message.error(
                <FormattedMessage
                    id="pages.dataset.display.lt200mb"
                    defaultMessage="圖片大小不能超過200MB"
                />
            );
        }
        return isImage && isLt200MB;
    };

    const onJsonChange = ({ fileList: newFileList }: { fileList: any[] }) => {
        const file = newFileList[newFileList.length - 1];
        setJsonFile(file);
    };

    const onImageChange = ({ fileList: newFileList }: { fileList: any[] }) => {
        console.log(newFileList);
        setImgList(newFileList);
    };

    const jsonUploadProps = {
        multiple: false,
        beforeUpload: beforeJsonUpload,
        onChange: onJsonChange,
        fileList: jsonFile ? [jsonFile] : [],
        accept: '.json',
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
        formData.append('data', JSON.stringify(values));
        if (jsonFile) {
            formData.append('jsonFile', jsonFile.originFileObj);
        }
        imgList.forEach((file) => {
            formData.append('imageFiles', file.originFileObj);
        });
        const result = await createDataset(formData);
        if (result.code === 200) {
            message.success(
                <FormattedMessage
                    id="pages.dataset.display.createSuccess"
                    defaultMessage="創建成功"
                />
            );
        } else {
            message.error(
                `${(
                    <FormattedMessage
                        id="pages.dataset.display.createFail"
                        defaultMessage="創建失敗"
                    />
                )}: ${result.msg}`
            );
        }
        form.resetFields();
        setUploadLoading(false);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleCancleViewDatasetDetail = () => {
        setDatasetModalOpen(false);
        currentVisDatasetId.current = '';
    };

    useEffect(() => {
        handleEditDataset(currentVisDatasetId.current);
    }, [visDatasetLoading, visImageList]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const detectTypesResp = await listDetectTypes();
                setDetectTypes(detectTypesResp.results);
                const datasetFormatsResp = await listDatasetFormats();
                setDatasetFormats(datasetFormatsResp.results);
                setDataLoaded(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                if (!dataLoaded) return;
                const result = await listDataset();
                const datasetList = result.map((dataset: DatasetItem, i: number) => {
                    const datasetFormat = dataset.dataset_format_ids.map(id => {
                        const foundItem = datasetFormats.find(item => item._id === id);
                        return foundItem ? foundItem.name : null;
                    });
                    const typeItem = detectTypes.find(item => item._id === dataset.detect_type_id);
                    return {
                        key: `${i}`,
                        name: dataset.name,
                        type: typeItem.tag_name,
                        datasetFormat,
                        createdAt: moment(dataset.created_at).format('YYYY-MM-DD HH:mm'),
                        validImagesNum: dataset.valid_images_num,
                        description: dataset.description,
                        action: dataset._id,
                    }
            });
                setDatasets(result);
                setShowDatasets(datasetList);
            } catch (error) {
                console.error('Fetch datasets error:', error);
                message.error('Fetch datasets error');
            }
        };
        fetchDatasets();
    }, [uploadLoading, deleteModalOpen, dataLoaded]);

    return (
        <PageContainer>
            <Card>
                <Title level={3}>
                    <FormattedMessage
                        id="pages.dataset.table.createdDataset"
                        defaultMessage="已創建的資料集"
                    />
                </Title>
                <Card
                    style={{
                        backgroundColor: token.colorBgContainer,
                        boxShadow: token.boxShadow,
                        borderRadius: '8px',
                        color: token.colorTextSecondary,
                        padding: '16px 19px',
                        minWidth: '220px',
                        flex: 1,
                    }}
                >
                    {showDatasets.length === 0 && <Empty />}
                    {showDatasets.length > 0 && <Table dataSource={showDatasets} columns={columns} />}
                </Card>

                <Title level={3} style={{ marginTop: 40 }}>
                    <FormattedMessage
                        id="pages.dataset.table.createDataset"
                        defaultMessage="建立新的資料集"
                    />
                </Title>
                <Card
                    style={{
                        backgroundColor: token.colorBgContainer,
                        boxShadow: token.boxShadow,
                        borderRadius: '8px',
                        color: token.colorTextSecondary,
                        padding: '16px 19px',
                        minWidth: '220px',
                        flex: 1,
                    }}
                >
                    <Spin spinning={uploadLoading}>
                        <Form
                            form={form}
                            layout="horizontal"
                            size="middle"
                            style={{ maxWidth: 600 }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label={
                                    <FormattedMessage
                                        id="pages.dataset.display.name"
                                        defaultMessage="名稱"
                                    />
                                }
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.dataset.display.enterDatasetName"
                                                defaultMessage="請輸入資料集名稱"
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
                                        id="pages.dataset.display.detectTypes"
                                        defaultMessage="檢測類型"
                                    />
                                }
                                name="detectType"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.dataset.display.selectDetectTypes"
                                                defaultMessage="請選擇檢測類型"
                                            />
                                        ),
                                    },
                                ]}
                            >
                                <Select>
                                    {detectTypes.map((data: any, i: number) => 
                                        <Select.Option key={data._id} value={data._id}>{data.name.toUpperCase()}</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <FormattedMessage
                                        id="pages.dataset.display.description"
                                        defaultMessage="描述"
                                    />
                                }
                                name="description"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <FormattedMessage
                                        id="pages.dataset.display.cocoStyleLabelFile"
                                        defaultMessage="標注文件（MSCOCO 格式）"
                                    />
                                }
                                name="labelFile"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.dataset.display.uploadLabelFile"
                                                defaultMessage="請上傳標注文件"
                                            />
                                        ),
                                    },
                                ]}
                            >
                                <Upload {...jsonUploadProps}>
                                    <Button>
                                        <FormattedMessage
                                            id="pages.dataset.display.clickToUpload"
                                            defaultMessage="點擊上傳"
                                        />
                                    </Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <FormattedMessage
                                        id="pages.dataset.display.images"
                                        defaultMessage="圖片"
                                    />
                                }
                                name="imageList"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.dataset.display.uploadImages"
                                                defaultMessage="請上傳圖片"
                                            />
                                        ),
                                    },
                                ]}
                            >
                                <Dragger {...imageUploadProps}>
                                    <p className="ant-upload-drag-icon"></p>
                                    <p className="ant-upload-text">
                                        <FormattedMessage
                                            id="pages.dataset.display.clickOrDragToUpload"
                                            defaultMessage="點擊或拖動上傳"
                                        />
                                    </p>
                                    <p className="ant-upload-hint">
                                        <FormattedMessage
                                            id="pages.dataset.display.uploadDescription"
                                            defaultMessage="支持單個或批量上傳。嚴禁上傳私人數據或其他禁止的文件"
                                        />
                                    </p>
                                </Dragger>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <FormattedMessage
                                        id="pages.dataset.display.datasetFormatTitle"
                                        defaultMessage="資料集格式（MSCOCO 為默認必選）"
                                    />
                                }
                                name="datasetFormat"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.dataset.display.selectDatasetFormat"
                                                defaultMessage="請選擇資料集格式"
                                            />
                                        ),
                                    },
                                ]}
                            >
                                <Select mode="multiple">
                                    {datasetFormats.map((data: any, i: number) => 
                                        <Select.Option key={data._id} value={data._id}>{data.name.toUpperCase()}</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    <FormattedMessage
                                        id="pages.dataset.display.submit"
                                        defaultMessage="提交"
                                    />
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Card>
            </Card>
            <Modal
                style={{ minWidth: 800 }}
                footer={null}
                title={
                    <FormattedMessage
                        id="pages.dataset.display.datasetDetail"
                        defaultMessage="資料集詳情"
                    />
                }
                open={datasetModalOpen}
                onOk={() => setDatasetModalOpen(false)}
                onCancel={handleCancleViewDatasetDetail}
            >
                {datasetDetail}
            </Modal>
            <Modal
                style={{ minWidth: 200 }}
                title={
                    <FormattedMessage
                        id="pages.dataset.display.deleteDataset"
                        defaultMessage="刪除資料集"
                    />
                }
                open={deleteModalOpen}
                onOk={() => handleDeleteDataset(deleteDatasetIdRef.current)}
                onCancel={() => {
                    setDeleteModalOpen(false);
                }}
            >
                <FormattedMessage
                    id="pages.dataset.display.confirmDeleteDataset"
                    defaultMessage="確定要刪除該資料集嗎？此操作將無法還原"
                />
            </Modal>
            <Modal
                style={{ minWidth: 600 }}
                title={imageTitleRef.current}
                footer={null}
                onCancel={() => { setImageModalOpen(false); imageRef.current = '' }}
                open={imageModalOpen}
            >
                <Image width={500} src={imageRef.current} />
            </Modal>
        </PageContainer>
    );
};

export default Dataset;
