import { Card } from 'antd';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import React, { CSSProperties, useEffect, useState } from 'react';

// 定义 ClassifyMetricsItem 接口
interface ClassifyMetricsItem {
  id: number;
  name: string;
  f1: number;
  precision: number;
  recall: number;
}

interface MetricsBarChartProps {
  metrics: any;
  style?: CSSProperties;
}

const ClassifyResultChart: React.FC<MetricsBarChartProps> = ({ metrics, style }) => {
  const [data, setData] = useState<ClassifyMetricsItem[]>([]);

  useEffect(() => {
    const getData = async () => {
      // 将返回的数据转换为 ClassifyMetricsItem[] 格式
      const transformedData: ClassifyMetricsItem[] = metrics.names.map(
        (item: { id: number; name: string }, index: number) => ({
          id: item.id,
          name: item.name,
          f1: metrics.f1[index],
          precision: metrics.precision[index],
          recall: metrics.recall[index],
        }),
      );

      // 计算 f1、precision 和 recall 的平均值
      const averageF1 =
        transformedData.reduce((sum, item) => sum + item.f1, 0) / transformedData.length;
      const averagePrecision =
        transformedData.reduce((sum, item) => sum + item.precision, 0) / transformedData.length;
      const averageRecall =
        transformedData.reduce((sum, item) => sum + item.recall, 0) / transformedData.length;

      // 添加“平均”类到数据中
      const averageItem: ClassifyMetricsItem = {
        id: transformedData.length,
        name: 'Average',
        f1: averageF1,
        precision: averagePrecision,
        recall: averageRecall,
      };
      setData([...transformedData, averageItem]);
    };

    getData();
  }, []);

  const getOption = (): echarts.EChartsOption => {
    const names = data.map((item) => item.name);
    const f1Data = data.map((item) => item.f1);
    const precisionData = data.map((item) => item.precision);
    const recallData = data.map((item) => item.recall);

    return {
      //   title: {
      //     text: 'Fruit Performance Metrics',
      //   },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['F1', 'Precision', 'Recall'],
      },
      xAxis: {
        type: 'category',
        data: names,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'F1',
          type: 'bar',
          data: f1Data,
        },
        {
          name: 'Precision',
          type: 'bar',
          data: precisionData,
        },
        {
          name: 'Recall',
          type: 'bar',
          data: recallData,
        },
      ],
    };
  };

  return (
    <Card title="Classify Performance Metrics" size="small" style={style}>
      <ReactECharts option={getOption()} />
    </Card>
  );
};

export default ClassifyResultChart;
