import os
import joblib
import numpy as np
import pandas as pd

MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved")


class StockPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.model_name = None
        self.label_map = {0: "HOLD", 1: "BUY", 2: "SELL"}
        self._load_model()

    def _load_model(self):
        candidates = [
            ("xgboost_model.pkl", "XGBoost"),
            ("lightgbm_model.pkl", "LightGBM"),
            ("xgboost_model.joblib", "XGBoost"),
            ("lightgbm_model.joblib", "LightGBM"),
            ("model.pkl", "Model"),
            ("model.joblib", "Model"),
        ]

        for filename, name in candidates:
            path = os.path.join(MODEL_DIR, filename)
            if os.path.exists(path):
                try:
                    loaded = joblib.load(path)
                    if isinstance(loaded, dict):
                        self.model = loaded.get("model", loaded.get("clf"))
                        self.scaler = loaded.get("scaler", None)
                    else:
                        self.model = loaded
                    self.model_name = name
                    print(f"[predictor] Loaded {name} model from {filename}")
                    return
                except Exception as e:
                    print(f"[predictor] Failed to load {filename}: {e}")

        print("[predictor] No trained model found. Using fallback predictions.")

    @property
    def is_ready(self):
        return self.model is not None

    def predict(self, features_df):
        if not self.is_ready:
            return self._fallback_predict(features_df)

        try:
            feature_cols = features_df.columns.tolist()
            X = features_df.values

            if self.scaler is not None:
                X = self.scaler.transform(X)

            proba = self.model.predict_proba(X)[0]
            class_idx = int(np.argmax(proba))
            prediction = self.label_map.get(class_idx, "HOLD")
            confidence = float(proba[class_idx])

            score = self._compute_score(proba)

            return {
                "prediction": prediction,
                "confidence": round(confidence, 3),
                "score": score,
                "probabilities": {
                    "HOLD": round(float(proba[0]), 3),
                    "BUY": round(float(proba[1]), 3),
                    "SELL": round(float(proba[2]), 3),
                },
            }
        except Exception as e:
            print(f"[predictor] Prediction error: {e}")
            return self._fallback_predict(features_df)

    def _compute_score(self, proba):
        buy_prob = proba[1]
        sell_prob = proba[2]
        hold_prob = proba[0]

        raw = (buy_prob * 80 + hold_prob * 50 + sell_prob * 20)
        return max(0, min(100, int(raw)))

    def _fallback_predict(self, features_df):
        rsi = 50
        if "rsi_14" in features_df.columns:
            val = features_df["rsi_14"].iloc[0]
            if not pd.isna(val):
                rsi = float(val)

        ret_20d = 0
        if "return_20d" in features_df.columns:
            val = features_df["return_20d"].iloc[0]
            if not pd.isna(val):
                ret_20d = float(val)

        if rsi < 30 or ret_20d > 0.05:
            prediction = "BUY"
            score = 72
        elif rsi > 70 or ret_20d < -0.05:
            prediction = "SELL"
            score = 35
        else:
            prediction = "HOLD"
            score = 52

        return {
            "prediction": prediction,
            "confidence": 0.45,
            "score": score,
            "probabilities": {
                "HOLD": 0.40,
                "BUY": 0.35,
                "SELL": 0.25,
            },
            "fallback": True,
        }
