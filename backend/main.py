from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from services.yfinance_client import (
    STOCK_UNIVERSE,
    fetch_stock_data,
    fetch_stock_history,
    fetch_market_index,
    format_volume,
    format_market_cap,
)
from services.feature_engine import get_latest_features, compute_signals_from_features
from models.stock_predictor import StockPredictor

predictor = StockPredictor()


@asynccontextmanager
async def lifespan(app: app):
    print(f"[backend] Model ready: {predictor.is_ready}")
    if predictor.is_ready:
        print(f"[backend] Using {predictor.model_name}")
    else:
        print("[backend] Running with fallback predictions")
    yield


app = FastAPI(title="TradeDNA API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def build_stock_response(symbol, data, prediction):
    meta = STOCK_UNIVERSE.get(symbol, {})
    currency = meta.get("currency", "USD")

    history_list = []
    if data and data["history"] is not None:
        hist = data["history"].tail(90)
        for date, row in hist.iterrows():
            history_list.append({
                "date": date.strftime("%Y-%m-%d"),
                "close": round(float(row["Close"]), 2),
            })

    return {
        "id": symbol.lower(),
        "symbol": symbol,
        "name": meta.get("name", symbol),
        "sector": meta.get("sector", "Unknown"),
        "currency": currency,
        "price": data["current_price"] if data else 0,
        "change": data["change"] if data else 0,
        "changePct": data["change_pct"] if data else 0,
        "rating": prediction["prediction"],
        "score": prediction["score"],
        "confidence": prediction["confidence"],
        "targets": {
            "low": round(data["current_price"] * 0.88, 2) if data else 0,
            "high": round(data["current_price"] * 1.15, 2) if data else 0,
            "consensus": round(data["current_price"] * 1.05, 2) if data else 0,
        },
        "volume": format_volume(data["volume"]) if data else "0",
        "marketCap": format_market_cap(data["market_cap"]) if data else "N/A",
        "pe": data["pe"] if data else 0,
        "signals": prediction.get("signals", {}),
        "strengths": [],
        "risks": [],
        "history": history_list,
        "probabilities": prediction.get("probabilities", {}),
    }


@app.get("/api/stocks")
async def get_stocks():
    results = []
    for symbol, meta in STOCK_UNIVERSE.items():
        data = fetch_stock_data(symbol, period="6mo")
        if data is None:
            continue

        features = get_latest_features(data["history"])
        signals = compute_signals_from_features(features.iloc[0])
        prediction = predictor.predict(features)
        prediction["signals"] = signals

        results.append(build_stock_response(symbol, data, prediction))

    results.sort(key=lambda x: x["score"], reverse=True)
    return {"data": results}


@app.get("/api/stocks/{symbol}")
async def get_stock(symbol: str):
    symbol = symbol.upper()
    if symbol not in STOCK_UNIVERSE:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")

    data = fetch_stock_data(symbol, period="1y")
    if data is None:
        raise HTTPException(status_code=502, detail=f"Failed to fetch data for {symbol}")

    features = get_latest_features(data["history"])
    signals = compute_signals_from_features(features.iloc[0])
    prediction = predictor.predict(features)
    prediction["signals"] = signals

    return {"data": build_stock_response(symbol, data, prediction)}


@app.get("/api/predict/{symbol}")
async def predict_stock(symbol: str):
    symbol = symbol.upper()
    if symbol not in STOCK_UNIVERSE:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")

    data = fetch_stock_data(symbol, period="1y")
    if data is None:
        raise HTTPException(status_code=502, detail=f"Failed to fetch data for {symbol}")

    features = get_latest_features(data["history"])
    signals = compute_signals_from_features(features.iloc[0])
    prediction = predictor.predict(features)
    prediction["signals"] = signals

    return {
        "data": {
            "symbol": symbol,
            "prediction": prediction["prediction"],
            "confidence": prediction["confidence"],
            "score": prediction["score"],
            "signals": signals,
            "probabilities": prediction.get("probabilities", {}),
            "model": predictor.model_name or "Fallback",
            "fallback": prediction.get("fallback", False),
        }
    }


@app.get("/api/rankings")
async def get_rankings():
    stocks_response = await get_stocks()
    return stocks_response


@app.get("/api/market/index")
async def get_market_index():
    data = fetch_market_index(period="1y")
    if data is None:
        return {"data": []}
    return {"data": data}


@app.get("/api/analysis/watchlist")
async def get_watchlist():
    watchlist = []
    for symbol, meta in STOCK_UNIVERSE.items():
        data = fetch_stock_data(symbol, period="5d")
        change_pct = data["change_pct"] if data else 0
        watchlist.append({
            "symbol": symbol,
            "name": meta["name"],
            "changePct": change_pct,
            "region": meta["region"],
        })
    return {"data": watchlist}


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "model_ready": predictor.is_ready,
        "model_name": predictor.model_name,
    }
