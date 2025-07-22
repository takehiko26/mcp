import React, { useState } from 'react';
import axios from 'axios';

const StockSearch = ({ onStockData, onLoading, onError }) => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!symbol.trim()) {
      onError('ティッカーコードを入力してください');
      return;
    }

    onLoading(true);
    onError(null);
    
    try {
      console.log(`Searching for stock: ${symbol}`);
      
      const response = await axios.get(`http://localhost:8000/stock/${symbol.trim().toUpperCase()}`);
      
      console.log('Stock data received:', response.data);
      onStockData(response.data);
      onError(null);
      
    } catch (error) {
      console.error('Error fetching stock data:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          onError(`ティッカーコード "${symbol}" が見つかりませんでした`);
        } else if (error.response.status === 429) {
          onError('API制限に達しました。しばらく待ってから再試行してください');
        } else {
          onError(`エラーが発生しました: ${error.response.data.detail || 'サーバーエラー'}`);
        }
      } else if (error.request) {
        onError('サーバーに接続できませんでした。バックエンドが起動していることを確認してください');
      } else {
        onError('予期しないエラーが発生しました');
      }
      
      onStockData(null);
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-group">
        <label htmlFor="symbol">ティッカーコード:</label>
        <input
          type="text"
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="例: AAPL, GOOGL, TSLA"
          maxLength={10}
        />
      </div>
      <button type="submit" className="search-button">
        株価を検索
      </button>
    </form>
  );
};

export default StockSearch;