import os
import logging
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Stock Information API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"

class StockData(BaseModel):
    symbol: str
    price: str
    change: str
    change_percent: str
    open: str
    high: str
    low: str
    volume: str
    latest_trading_day: str

class ErrorResponse(BaseModel):
    error: str
    message: str

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/stock/{symbol}", response_model=StockData)
async def get_stock_data(symbol: str):
    if not ALPHA_VANTAGE_API_KEY:
        logger.error("Alpha Vantage API key not configured")
        raise HTTPException(status_code=500, detail="API key not configured")
    
    try:
        logger.info(f"Fetching stock data for symbol: {symbol}")
        
        async with httpx.AsyncClient() as client:
            params = {
                "function": "GLOBAL_QUOTE",
                "symbol": symbol.upper(),
                "apikey": ALPHA_VANTAGE_API_KEY
            }
            
            response = await client.get(ALPHA_VANTAGE_BASE_URL, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if "Error Message" in data:
                logger.error(f"Alpha Vantage API error for symbol {symbol}: {data['Error Message']}")
                raise HTTPException(status_code=404, detail=f"Symbol {symbol} not found")
            
            if "Note" in data:
                logger.error(f"Alpha Vantage API rate limit exceeded")
                raise HTTPException(status_code=429, detail="API rate limit exceeded")
            
            quote_data = data.get("Global Quote", {})
            
            if not quote_data:
                logger.error(f"No data returned for symbol {symbol}")
                raise HTTPException(status_code=404, detail=f"No data found for symbol {symbol}")
            
            stock_data = StockData(
                symbol=quote_data.get("01. symbol", ""),
                price=quote_data.get("05. price", "0"),
                change=quote_data.get("09. change", "0"),
                change_percent=quote_data.get("10. change percent", "0%"),
                open=quote_data.get("02. open", "0"),
                high=quote_data.get("03. high", "0"),
                low=quote_data.get("04. low", "0"),
                volume=quote_data.get("06. volume", "0"),
                latest_trading_day=quote_data.get("07. latest trading day", "")
            )
            
            logger.info(f"Successfully retrieved data for {symbol}")
            return stock_data
            
    except httpx.HTTPError as e:
        logger.error(f"HTTP error when fetching data for {symbol}: {str(e)}")
        raise HTTPException(status_code=503, detail="Failed to fetch stock data")
    except Exception as e:
        logger.error(f"Unexpected error when fetching data for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)