import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { CSSProperties } from 'react';

interface NameItem {
  id: number;
  name: string;
}

interface F1Data {
  f1_scores: number[][];
  f1_mean: number[];
}

interface MetricsItem {
  names: NameItem[];
  confidence: number[];
  f1: F1Data;
}

interface F1ConfidenceChartProps {
  metrics: MetricsItem;
  style?: CSSProperties;
}

const F1ConfidenceChart: React.FC<F1ConfidenceChartProps> = ({ metrics, style }) => {
  const { names, confidence, f1 } = metrics;
  const { f1_scores, f1_mean } = f1;

  // 过滤掉超出f1_scores数组范围的names
  const validNames = names.filter((_, index) => index < f1_scores.length);

  const series: any[] = validNames.map((item, index) => ({
    name: item.name,
    type: 'line',
    showSymbol: false,
    data: f1_scores[index].map((score, i) => [confidence[i], score]),
  }));

  series.push({
    name: 'Average',
    type: 'line',
    showSymbol: false,
    data: confidence.map((c, i) => [c, f1_mean[i]]),
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
      name: 'Confidence',
    },
    yAxis: {
      type: 'value',
      name: 'F1 Score',
    },
    series,
  };

  return (
    <Card title="F1-Confidence Curve" size="small" style={style}>
      <ReactECharts option={options} style={{ height: '400px' }} />
    </Card>
  );
};

export default F1ConfidenceChart;
