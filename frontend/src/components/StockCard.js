import React from 'react';

const StockCard = ({ stockData }) => {
  const { symbol, price, change, change_percent, open, high, low, volume, latest_trading_day } = stockData;
  
  const isPositive = parseFloat(change) >= 0;
  
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('ja-JP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatVolume = (vol) => {
    const num = parseInt(vol);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString('ja-JP');
  };

  return (
    <div className="stock-card">
      <div className="stock-header">
        <div className="stock-symbol">{symbol}</div>
        <div className={`stock-price ${isPositive ? 'positive' : 'negative'}`}>
          ${formatNumber(price)}
        </div>
      </div>
      
      <div className="stock-details">
        <div className="detail-item">
          <span className="detail-label">変動額:</span>
          <span className={`detail-value ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}${formatNumber(change)}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">変動率:</span>
          <span className={`detail-value ${isPositive ? 'positive' : 'negative'}`}>
            {change_percent}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">始値:</span>
          <span className="detail-value">${formatNumber(open)}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">高値:</span>
          <span className="detail-value">${formatNumber(high)}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">安値:</span>
          <span className="detail-value">${formatNumber(low)}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">出来高:</span>
          <span className="detail-value">{formatVolume(volume)}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">取引日:</span>
          <span className="detail-value">{latest_trading_day}</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;