import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StockChart = ({ timeSeriesData, symbol }) => {
  if (!timeSeriesData || !timeSeriesData.data || timeSeriesData.data.length === 0) {
    return <div className="chart-placeholder">チャートデータがありません</div>;
  }

  // データを日付順にソートしてチャート用に変換
  const chartData = timeSeriesData.data
    .map(entry => ({
      date: entry.date,
      close: parseFloat(entry.close),
      open: parseFloat(entry.open),
      high: parseFloat(entry.high),
      low: parseFloat(entry.low),
      volume: parseInt(entry.volume)
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="stock-chart">
      <h3>{symbol} 株価チャート</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
          />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip 
            labelFormatter={(date) => new Date(date).toLocaleDateString('ja-JP')}
            formatter={(value, name) => [value.toFixed(2), name === 'close' ? '終値' : name]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={false}
            name="終値"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;