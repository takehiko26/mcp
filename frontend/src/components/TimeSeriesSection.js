import React, { useState } from 'react';
import axios from 'axios';
import StockChart from './StockChart';

const TimeSeriesSection = ({ symbol }) => {
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d');

  const fetchTimeSeriesData = async () => {
    if (!symbol) {
      setError('ティッカーコードを先に入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8000/stock/${symbol}/timeseries?period=${period}`
      );
      setTimeSeriesData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || '時系列データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    if (!symbol) {
      setError('ティッカーコードを先に入力してください');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/stock/${symbol}/export?period=${period}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${symbol}_timeseries_${period}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('CSVエクスポートに失敗しました');
    }
  };

  return (
    <div className="time-series-section">
      <h2>時系列データ</h2>
      
      <div className="controls">
        <div className="period-selector">
          <label>期間選択: </label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="30d">過去30日</option>
            <option value="3m">過去3ヶ月</option>
            <option value="1y">過去1年</option>
          </select>
        </div>
        
        <button 
          onClick={fetchTimeSeriesData} 
          disabled={loading || !symbol}
          className="fetch-button"
        >
          {loading ? '取得中...' : '時系列データを取得'}
        </button>
        
        <button 
          onClick={exportCSV} 
          disabled={!timeSeriesData || !symbol}
          className="export-button"
        >
          CSVエクスポート
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {timeSeriesData && (
        <div className="chart-container">
          <StockChart timeSeriesData={timeSeriesData} symbol={symbol} />
          <div className="data-info">
            <p>最終更新: {timeSeriesData.last_refreshed}</p>
            <p>データポイント数: {timeSeriesData.data.length}件</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSeriesSection;