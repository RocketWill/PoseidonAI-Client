/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-12 17:05:19
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-13 15:53:34
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/CategoryStatisticsChart.tsx
 */

import ReactEcharts from 'echarts-for-react'; // 引入 ECharts 進行圖表繪製
import React from 'react'; // 首先引入 React

import { SummaryItem } from '..'; // 引入專案內部的類型

// 定義組件的屬性類型
interface CategoryStatisticsChartProps {
  dataList: SummaryItem[]; // 數據列表，由 SummaryItem 組成的數組
  viewType: 'images' | 'instances'; // 視圖類型，可以是 'images' 或 'instances'
}

// 處理數據，將其轉換為圖表所需的格式
function processCategoryData(dataList: SummaryItem[], viewType: 'images' | 'instances') {
  const categories: string[] = [];
  const trainData: number[] = [];
  const valData: number[] = [];

  dataList.forEach((item) => {
    if (!categories.includes(item.classname)) {
      categories.push(item.classname);
      trainData.push(0);
      valData.push(0);
    }

    const index = categories.indexOf(item.classname);
    if (item.dataset_type === 'train') {
      trainData[index] += item[viewType]; // 根據 viewType 選擇 'images' 或 'instances'
    } else if (item.dataset_type === 'val') {
      valData[index] += item[viewType];
    }
  });

  return { categories, trainData, valData };
}

// 主 CategoryStatisticsChart 組件
const CategoryStatisticsChart: React.FC<CategoryStatisticsChartProps> = ({
  dataList,
  viewType,
}) => {
  const { categories, trainData, valData } = processCategoryData(dataList, viewType);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Train', 'Val'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: categories, // y 軸代表類別（類別名稱）
    },
    series: [
      {
        name: 'Training',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: trainData, // 訓練數據
      },
      {
        name: 'Validation',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: valData, // 驗證數據
      },
    ],
  };

  return <ReactEcharts option={option} style={{ height: '400px', width: '90%' }} />;
};

export default CategoryStatisticsChart;
