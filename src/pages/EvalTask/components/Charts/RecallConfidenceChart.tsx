import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { CSSProperties } from 'react';

interface NameItem {
  id: number;
  name: string;
}

interface RecallData {
  recall: number[][];
  recall_mean: number[];
}

interface MetricsItem {
  names: NameItem[];
  confidence: number[];
  recall: RecallData;
}

interface RecallConfidenceChartProps {
  metrics: MetricsItem;
  style?: CSSProperties;
}

const RecallConfidenceChart: React.FC<RecallConfidenceChartProps> = ({ metrics, style }) => {
  const { names, confidence, recall } = metrics;
  const { recall: recallScores, recall_mean: recallMean } = recall;

  // 过滤掉超出recallScores数组范围的names
  const validNames = names.filter((_, index) => index < recallScores.length);

  const series: any[] = validNames.map((item, index) => ({
    name: item.name,
    type: 'line',
    showSymbol: false,
    data: recallScores[index].map((score, i) => [confidence[i], score]),
  }));

  series.push({
    name: 'Average',
    type: 'line',
    showSymbol: false,
    data: confidence.map((c, i) => [c, recallMean[i]]),
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
      name: 'Recall',
    },
    series,
  };

  return (
    <Card title="Recall-Confidence Curve" size="small" style={style}>
      <ReactECharts option={options} style={{ height: '400px' }} />
    </Card>
  );
};

export default RecallConfidenceChart;
