import React, { useState } from 'react';
import StockSearch from './components/StockSearch';
import StockCard from './components/StockCard';

const App = () => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStockData = (data) => {
    setStockData(data);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="container">
      <h1>株価情報アプリ</h1>
      <StockSearch 
        onStockData={handleStockData}
        onLoading={handleLoading}
        onError={handleError}
      />
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="loading">
          データを取得中...
        </div>
      )}
      
      {stockData && !loading && (
        <StockCard stockData={stockData} />
      )}
    </div>
  );
};

export default App;