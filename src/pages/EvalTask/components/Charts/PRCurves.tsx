import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { CSSProperties } from 'react';

interface NameItem {
  id: number;
  name: string;
}

interface PRData {
  recall: number[];
  precision: number[][];
  precision_mean: number[];
}

interface MetricsItem {
  names: NameItem[];
  pr: PRData;
}

interface PRChartProps {
  metrics: MetricsItem;
  style?: CSSProperties;
}

const PRChart: React.FC<PRChartProps> = ({ metrics, style }) => {
  const { names, pr } = metrics;
  const { recall, precision, precision_mean } = pr;

  // 过滤掉超出precision数组范围的names
  const validNames = names.filter((_, index) => index < precision.length);

  const series: any[] = validNames.map((item, index) => ({
    name: item.name,
    type: 'line',
    showSymbol: false,
    data: precision[index].map((p, i) => [recall[i], p]),
  }));

  series.push({
    name: 'Average',
    type: 'line',
    showSymbol: false,
    data: recall.map((r, i) => [r, precision_mean[i]]),
    lineStyle: {
      type: 'dashed',
    },
  });

  const options = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [...validNames.map((item) => item.name), 'Average'],
    },
    xAxis: {
      type: 'value',
      name: 'Recall',
    },
    yAxis: {
      type: 'value',
      name: 'Precision',
    },
    series,
  };

  return (
    <Card title="PR Curve" style={style} size="small">
      <ReactECharts option={options} style={{ height: '400px' }} />
    </Card>
  );
};

export default PRChart;
