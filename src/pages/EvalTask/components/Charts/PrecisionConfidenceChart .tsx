import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { CSSProperties } from 'react';

interface NameItem {
  id: number;
  name: string;
}

interface PrecisionData {
  precision: number[][];
  precision_mean: number[];
}

interface MetricsItem {
  names: NameItem[];
  confidence: number[];
  precision: PrecisionData;
}

interface PrecisionConfidenceChartProps {
  metrics: MetricsItem;
  style?: CSSProperties;
}

const PrecisionConfidenceChart: React.FC<PrecisionConfidenceChartProps> = ({ metrics, style }) => {
  const { names, confidence, precision } = metrics;
  const { precision: precisionScores, precision_mean: precisionMean } = precision;

  // 过滤掉超出precisionScores数组范围的names
  const validNames = names.filter((_, index) => index < precisionScores.length);

  const series: any[] = validNames.map((item, index) => ({
    name: item.name,
    type: 'line',
    showSymbol: false,
    data: precisionScores[index].map((score, i) => [confidence[i], score]),
  }));

  series.push({
    name: 'Average',
    type: 'line',
    showSymbol: false,
    data: confidence.map((c, i) => [c, precisionMean[i]]),
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
      name: 'Precision',
    },
    series,
  };

  return (
    <Card title="Precision-Confidence Curve" size="small" style={style}>
      <ReactECharts option={options} style={{ height: '400px' }} />
    </Card>
  );
};

export default PrecisionConfidenceChart;
