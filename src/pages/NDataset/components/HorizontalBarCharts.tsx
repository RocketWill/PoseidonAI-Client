/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-12 11:43:36
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-14 13:24:14
 * @FilePath: /PoseidonAI-Client/src/pages/NDataset/components/HorizontalBarCharts.tsx
 */
import ReactECharts from 'echarts-for-react';
import React from 'react';

interface HorizontalBarChartProps {
  totalImages: number | undefined;
  labeledInstances: number | undefined;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  totalImages,
  labeledInstances,
}) => {
  if (!totalImages || !labeledInstances) return;
  const option = {
    // title: {
    //   text: '圖片總數與標注實例數',
    //   left: 'center',
    // },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow', // 默認是直線，可選為：'line' | 'shadow'
      },
      formatter: '{b}: {c}',
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: ['Instances', 'Images'],
      axisLabel: {
        fontSize: 8, // 調整字體大小
      },
    },
    series: [
      {
        name: '數量',
        type: 'bar',
        data: [labeledInstances, totalImages],
        itemStyle: {
          color: function (params: any) {
            return params.dataIndex === 0 ? '#3498DB' : '#2ECC71';
          },
        },
        label: {
          show: true, // 顯示數字
          position: 'right', // 文字顯示在柱子內部右側，或使用 'right' 顯示在外部右側
          formatter: '{c}', // 顯示數據值
          fontSize: 12, // 調整字體大小
          color: '#000', // 字體顏色
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '250px', width: '100%' }} />;
};

export default HorizontalBarChart;
