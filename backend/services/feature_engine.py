import pandas as pd
import numpy as np


def compute_rsi(series, period=14):
    delta = series.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)
    avg_gain = gain.rolling(window=period, min_periods=period).mean()
    avg_loss = loss.rolling(window=period, min_periods=period).mean()
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))


def compute_macd(series, fast=12, slow=26, signal=9):
    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line
    return macd_line, signal_line, histogram


def compute_bollinger(series, period=20, std_dev=2):
    sma = series.rolling(window=period).mean()
    std = series.rolling(window=period).std()
    upper = sma + (std * std_dev)
    lower = sma - (std * std_dev)
    return upper, sma, lower


def compute_atr(high, low, close, period=14):
    tr1 = high - low
    tr2 = (high - close.shift()).abs()
    tr3 = (low - close.shift()).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    return tr.rolling(window=period).mean()


def build_features(df):
    close = df["Close"]
    high = df["High"]
    low = df["Low"]
    volume = df["Volume"]

    features = pd.DataFrame(index=df.index)

    features["return_1d"] = close.pct_change(1)
    features["return_5d"] = close.pct_change(5)
    features["return_20d"] = close.pct_change(20)
    features["log_return"] = np.log(close / close.shift(1))

    features["sma_20"] = close.rolling(20).mean()
    features["sma_50"] = close.rolling(50).mean()
    features["sma_200"] = close.rolling(200).mean()
    features["ema_12"] = close.ewm(span=12, adjust=False).mean()
    features["ema_26"] = close.ewm(span=26, adjust=False).mean()

    features["price_to_sma20"] = close / features["sma_20"]
    features["price_to_sma50"] = close / features["sma_50"]
    features["sma20_to_sma50"] = features["sma_20"] / features["sma_50"]

    features["rsi_14"] = compute_rsi(close, 14)
    macd_line, signal_line, macd_hist = compute_macd(close)
    features["macd"] = macd_line
    features["macd_signal"] = signal_line
    features["macd_hist"] = macd_hist

    bb_upper, bb_mid, bb_lower = compute_bollinger(close)
    features["bb_upper"] = bb_upper
    features["bb_lower"] = bb_lower
    features["bb_width"] = (bb_upper - bb_lower) / bb_mid
    features["bb_position"] = (close - bb_lower) / (bb_upper - bb_lower)

    features["atr_14"] = compute_atr(high, low, close, 14)
    features["volatility_20d"] = close.pct_change().rolling(20).std()
    features["volatility_60d"] = close.pct_change().rolling(60).std()

    vol_sma = volume.rolling(20).mean()
    features["volume_ratio"] = volume / vol_sma
    features["volume_change"] = volume.pct_change()

    obv = (np.sign(close.diff()) * volume).fillna(0).cumsum()
    features["obv"] = obv
    features["obv_slope"] = obv.diff(5) / 5

    features["high_low_range"] = (high - low) / close
    features["close_to_high"] = (high - close) / close
    features["close_to_low"] = (close - low) / close

    return features


def get_latest_features(df):
    features = build_features(df)
    latest = features.iloc[-1:].copy()
    latest = latest.replace([np.inf, -np.inf], np.nan)
    return latest


def compute_signals_from_features(features_row):
    rsi = features_row.get("rsi_14", 50)
    if pd.isna(rsi):
        rsi = 50
    momentum = max(0, min(100, int(rsi)))

    ret_20d = features_row.get("return_20d", 0)
    if pd.isna(ret_20d):
        ret_20d = 0
    growth = max(0, min(100, int(50 + ret_20d * 500)))

    bb_pos = features_row.get("bb_position", 0.5)
    if pd.isna(bb_pos):
        bb_pos = 0.5
    value = max(0, min(100, int((1 - bb_pos) * 100)))

    vol_20d = features_row.get("volatility_20d", 0.02)
    if pd.isna(vol_20d):
        vol_20d = 0.02
    volatility = max(0, min(100, int(vol_20d * 1000)))

    vol_ratio = features_row.get("volume_ratio", 1.0)
    if pd.isna(vol_ratio):
        vol_ratio = 1.0
    sentiment = max(0, min(100, int(50 + (vol_ratio - 1) * 50)))

    return {
        "momentum": momentum,
        "growth": growth,
        "value": value,
        "volatility": volatility,
        "sentiment": sentiment,
    }
