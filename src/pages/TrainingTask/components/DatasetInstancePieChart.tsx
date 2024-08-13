/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-12 15:44:43
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-13 15:52:23
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/DatasetInstancePieChart.tsx
 */

import { Button, Space } from 'antd'; // 引入 Ant Design 的組件
import ReactEcharts from 'echarts-for-react'; // 引入 ECharts 進行圖表繪製
import React, { useState } from 'react'; // 首先引入 React 和 useState
import { SummaryItem } from '..'; // 引入專案內部的類型

// 定義組件的屬性類型
interface DatasetInstancePieChartProps {
  dataList: SummaryItem[]; // 數據列表，由 SummaryItem 組成的數組
}

// 聚合統計數據
const aggregateStatistics = (dataList: SummaryItem[]) => {
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
};

// 主 DatasetInstancePieChart 組件
const DatasetInstancePieChart: React.FC<DatasetInstancePieChartProps> = ({ dataList }) => {
  const [viewType, setViewType] = useState<'instances' | 'images'>('instances'); // 狀態：切換「instances」和「images」視圖
  const stats = aggregateStatistics(dataList);

  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: viewType === 'instances' ? 'Instances' : 'Images',
        type: 'pie',
        radius: '50%',
        data: [
          {
            value: viewType === 'instances' ? stats.train.totalInstances : stats.train.totalImages,
            name: 'Training',
          },
          {
            value: viewType === 'instances' ? stats.val.totalInstances : stats.val.totalImages,
            name: 'Validation',
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <div>
      {/* 切換視圖類型的按鈕 */}
      <Space style={{ marginBottom: '10px' }}>
        <Button
          size="small"
          type={viewType === 'instances' ? 'primary' : 'default'}
          onClick={() => setViewType('instances')}
        >
          Instances
        </Button>
        <Button
          size="small"
          type={viewType === 'images' ? 'primary' : 'default'}
          onClick={() => setViewType('images')}
        >
          Images
        </Button>
      </Space>
      {/* 顯示圖表 */}
      <ReactEcharts option={option} style={{ height: '200px', width: '500px' }} />
    </div>
  );
};

export default DatasetInstancePieChart;
