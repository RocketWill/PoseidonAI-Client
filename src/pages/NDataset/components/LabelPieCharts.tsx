/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-12 11:08:32
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-13 09:30:53
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/LabelPieCharts.tsx
 */
import ReactECharts from 'echarts-for-react';
import React from 'react';
import { CategoryCountItem } from '..';

interface LabelPieChartsProps {
  data: CategoryCountItem[] | undefined;
}

const LabelPieCharts: React.FC<LabelPieChartsProps> = ({ data }) => {
  if (!data) return;
  // 將傳入的數據轉換為 ECharts 需要的格式
  const chartData = data.map((item: CategoryCountItem) => ({
    value: item.value,
    name: item.name,
  }));

  // 配置 ECharts 圓餅圖的設置
  const option = {
    // title: {
    //   text: '標注數據分佈',
    //   left: 'center',
    // },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    color: [
      '#2E86C1',
      '#A93226',
      '#27AE60',
      '#F39C12',
      '#8E44AD',
      '#D35400',
      '#7D3C98',
      '#16A085',
      '#E74C3C',
      '#3498DB',
      '#F4D03F',
      '#2ECC71',
      '#E67E22',
      '#9B59B6',
      '#5DADE2',
      '#F0B27A',
    ],
    series: [
      {
        name: '標注數據',
        type: 'pie',
        radius: '50%',
        data: chartData,
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

  return <ReactECharts option={option} style={{ height: '200px', width: '400px' }} />;
};

export default LabelPieCharts;
