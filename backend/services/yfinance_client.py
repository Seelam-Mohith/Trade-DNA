import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta


STOCK_UNIVERSE = {
    "NVDA": {"name": "NVIDIA Corp.", "sector": "Semiconductors", "region": "international"},
    "AAPL": {"name": "Apple Inc.", "sector": "Consumer Electronics", "region": "international"},
    "MSFT": {"name": "Microsoft Corp.", "sector": "Software", "region": "international"},
    "GOOGL": {"name": "Alphabet Inc.", "sector": "Internet & Media", "region": "international"},
    "AMZN": {"name": "Amazon.com Inc.", "sector": "E-Commerce & Cloud", "region": "international"},
    "TSLA": {"name": "Tesla Inc.", "sector": "Automotive", "region": "international"},
    "AMD": {"name": "Advanced Micro Devices", "sector": "Semiconductors", "region": "international"},
    "JPM": {"name": "JPMorgan Chase & Co.", "sector": "Financials", "region": "international"},
    "AVGO": {"name": "Broadcom Inc.", "sector": "Semiconductors", "region": "international"},
    "MSTR": {"name": "Strategy Inc.", "sector": "Software / BTC", "region": "international"},
    "XOM": {"name": "Exxon Mobil Corp.", "sector": "Energy", "region": "international"},
    "CRM": {"name": "Salesforce Inc.", "sector": "Software", "region": "international"},
    "RELIANCE": {"name": "Reliance Industries Ltd.", "sector": "Oil & Gas", "region": "indian", "currency": "INR"},
    "TCS": {"name": "Tata Consultancy Services Ltd.", "sector": "IT Services", "region": "indian", "currency": "INR"},
    "INFY": {"name": "Infosys Ltd.", "sector": "IT Services", "region": "indian", "currency": "INR"},
    "HDFCBANK": {"name": "HDFC Bank Ltd.", "sector": "Banking", "region": "indian", "currency": "INR"},
    "BHARTIARTL": {"name": "Bharti Airtel Ltd.", "sector": "Telecom", "region": "indian", "currency": "INR"},
    "HINDUNILVR": {"name": "Hindustan Unilever Ltd.", "sector": "Consumer Goods", "region": "indian", "currency": "INR"},
    "TATAMOTORS": {"name": "Tata Motors Ltd.", "sector": "Automotive", "region": "indian", "currency": "INR"},
}

SP500_TICKER = "^GSPC"


def fetch_stock_data(symbol, period="1y", interval="1d"):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)
        if hist.empty:
            return None

        info = ticker.info or {}

        current_price = float(hist["Close"].iloc[-1])
        prev_close = float(hist["Close"].iloc[-2]) if len(hist) > 1 else current_price
        change = current_price - prev_close
        change_pct = (change / prev_close * 100) if prev_close != 0 else 0

        volume = int(hist["Volume"].iloc[-1]) if "Volume" in hist.columns else 0

        market_cap = info.get("marketCap", 0)
        pe_ratio = info.get("trailingPE", 0) or 0

        return {
            "current_price": round(current_price, 2),
            "change": round(change, 2),
            "change_pct": round(change_pct, 2),
            "volume": volume,
            "market_cap": market_cap,
            "pe": round(pe_ratio, 1),
            "history": hist,
            "info": info,
        }
    except Exception as e:
        print(f"[yfinance] Error fetching {symbol}: {e}")
        return None


def fetch_stock_history(symbol, period="1y"):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)
        if hist.empty:
            return None
        return hist
    except Exception as e:
        print(f"[yfinance] Error fetching history for {symbol}: {e}")
        return None


def fetch_market_index(period="1y"):
    try:
        ticker = yf.Ticker(SP500_TICKER)
        hist = ticker.history(period=period)
        if hist.empty:
            return None

        monthly = hist.resample("ME").last().dropna()
        result = []
        for date, row in monthly.iterrows():
            result.append({
                "date": date.strftime("%b"),
                "value": round(float(row["Close"]), 2),
            })
        return result
    except Exception as e:
        print(f"[yfinance] Error fetching market index: {e}")
        return None


def format_volume(vol):
    if vol >= 1_000_000_000:
        return f"{vol / 1_000_000_000:.1f}B"
    if vol >= 1_000_000:
        return f"{vol / 1_000_000:.1f}M"
    if vol >= 1_000:
        return f"{vol / 1_000:.1f}K"
    return str(vol)


def format_market_cap(cap):
    if cap >= 1_000_000_000_000:
        return f"${cap / 1_000_000_000_000:.2f}T"
    if cap >= 1_000_000_000:
        return f"${cap / 1_000_000_000:.1f}B"
    if cap >= 1_000_000:
        return f"${cap / 1_000_000:.1f}M"
    return f"${cap:,.0f}"
