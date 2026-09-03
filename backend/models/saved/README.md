# Trained Models

Drop your trained XGBoost or LightGBM model here as one of:

- `xgboost_model.pkl` / `xgboost_model.joblib`
- `lightgbm_model.pkl` / `lightgbm_model.joblib`
- `model.pkl` / `model.joblib`

The predictor tries these in order and uses the first one it finds.

If you saved a full pipeline (e.g. with a scaler), save it as a dict:

```python
import joblib

joblib.dump({
    "model": model,      # the fitted XGBoost/LightGBM classifier
    "scaler": scaler,    # optional preprocessor
}, "backend/models/saved/xgboost_model.pkl")
```

## Expected output

The classifier should produce 3 classes in this order:
`0 = HOLD`, `1 = BUY`, `2 = SELL`

It must expose `predict_proba(X)` returning a shape `(n_samples, 3)` array.

Until a model file is added, the backend runs with rule-based fallback predictions so
the site still works.
