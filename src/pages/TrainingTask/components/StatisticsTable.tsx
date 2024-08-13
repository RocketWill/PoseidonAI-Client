import { Table, Tag } from 'antd'; // 引入 Ant Design 的表格和標籤組件
import React from 'react';
import { SummaryItem } from '..'; // 引入專案內部的類型

// 定義 StatisticsTableProps 的接口，描述組件的 props 結構
interface StatisticsTableProps {
  dataList: SummaryItem[]; // 數據列表，由 SummaryItem 組成的數組
}

// 定義 DataItem 的接口，描述表格中每一行的數據結構
interface DataItem {
  key: string;
  dataset: string;
  instances: number;
  images: number;
  color: string;
}

// 函數：聚合統計數據
function aggregateStatistics(dataList: SummaryItem[]) {
  const result = {
    train: { totalImages: 0, totalInstances: 0 },
    val: { totalImages: 0, totalInstances: 0 },
  };

  dataList.forEach((item) => {
    if (item.dataset_type === 'train') {
      result.train.totalImages += item.images;
      result.train.totalInstances += item.instances;
    } else if (item.dataset_type === 'val') {
      result.val.totalImages += item.images;
      result.val.totalInstances += item.instances;
    }
  });

  return result;
}

// 主 StatisticsTable 組件
const StatisticsTable: React.FC<StatisticsTableProps> = ({ dataList }) => {
  // 獲取聚合統計數據
  const stats = aggregateStatistics(dataList);

  const totalInstances = stats.train.totalInstances + stats.val.totalInstances;
  const totalImages = stats.train.totalImages + stats.val.totalImages;

  // 定義表格的列結構
  const columns = [
    {
      title: 'Dataset',
      dataIndex: 'dataset',
      key: 'dataset',
      render: (_: number, record: DataItem) => (
        <span>
          <Tag color={record.color} key={record.dataset}>
            {record.dataset}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Instances',
      dataIndex: 'instances',
      key: 'instances',
      render: (_: number, record: DataItem) => (
        <span>
          {record.instances} ({((record.instances / totalInstances) * 100).toFixed(1)}%)
        </span>
      ),
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      render: (_: number, record: DataItem) => (
        <span>
          {record.images} ({((record.images / totalImages) * 100).toFixed(1)}%)
        </span>
      ),
    },
  ];

  // 構建表格數據
  const data: DataItem[] = [
    {
      key: '1',
      dataset: 'Training',
      instances: stats.train.totalInstances,
      images: stats.train.totalImages,
      color: '#69c0ff', // 淺藍色代表訓練數據集
    },
    {
      key: '2',
      dataset: 'Validation',
      instances: stats.val.totalInstances,
      images: stats.val.totalImages,
      color: '#597ef7', // 藍色代表驗證數據集
    },
    {
      key: '3',
      dataset: 'Total in Split',
      instances: totalInstances,
      images: totalImages,
      color: '#000000', // 黑色代表總數
    },
  ];

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={data}
      pagination={false}
      showHeader={true}
      summary={() => (
        <Table.Summary.Row>
          {/* 彙總行暫時被註釋掉，如需顯示總數可以取消註釋 */}
          {/* <Table.Summary.Cell index={0}>Total in Split</Table.Summary.Cell> */}
          {/* <Table.Summary.Cell index={1}>{totalInstances}</Table.Summary.Cell> */}
          {/* <Table.Summary.Cell index={2}>{totalImages}</Table.Summary.Cell> */}
        </Table.Summary.Row>
      )}
      style={{
        minWidth: 600,
      }}
    />
  );
};

export default StatisticsTable;
