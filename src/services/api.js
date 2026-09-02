import axios from 'axios'
import {
  mockStocks,
  marketIndex,
  rankings,
  aiInsights,
  analysisWatchlist,
} from '../data/mockData.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

async function mockWrap(payload, ms) {
  await delay(ms)
  return { data: payload }
}

async function withFallback(realCall, fallbackPayload, ms) {
  try {
    const res = await realCall()
    if (res.data && Array.isArray(res.data.data)) {
      return { data: res.data.data }
    }
    return { data: res.data?.data ?? res.data }
  } catch (err) {
    console.warn('[api] Backend unavailable, falling back to mock data:', err.message)
    return mockWrap(fallbackPayload, ms)
  }
}

export function getStocks() {
  if (USE_MOCKS) return mockWrap(mockStocks)
  return withFallback(() => client.get('/stocks'), mockStocks)
}

export async function getStockById(id) {
  if (USE_MOCKS) {
    await delay()
    return mockWrap(mockStocks.find((s) => s.id === id) || mockStocks[0])
  }
  return withFallback(() => client.get(`/stocks/${id}`), mockStocks.find((s) => s.id === id) || mockStocks[0])
}

export function getMarketIndex() {
  if (USE_MOCKS) return mockWrap(marketIndex)
  return withFallback(() => client.get('/market/index'), marketIndex)
}

export function getRankings() {
  if (USE_MOCKS) return mockWrap(rankings)
  return withFallback(() => client.get('/rankings'), rankings)
}

export function getInsights() {
  if (USE_MOCKS) return mockWrap(aiInsights)
  return withFallback(() => client.get('/insights'), aiInsights)
}

export function getAnalysisWatchlist() {
  if (USE_MOCKS) return mockWrap(analysisWatchlist)
  return withFallback(() => client.get('/analysis/watchlist'), analysisWatchlist)
}

export function getStockPrediction(symbol) {
  if (USE_MOCKS) {
    const stock = mockStocks.find((s) => s.symbol === symbol) || mockStocks[0]
    return mockWrap({
      symbol,
      prediction: stock.rating,
      confidence: stock.confidence,
      score: stock.score,
      signals: stock.signals,
      probabilities: {
        HOLD: stock.rating === 'HOLD' ? 0.6 : 0.25,
        BUY: stock.rating === 'BUY' || stock.rating === 'STRONG_BUY' ? 0.75 : 0.3,
        SELL: stock.rating === 'SELL' || stock.rating === 'STRONG_SELL' ? 0.7 : 0.15,
      },
      model: 'Mock',
      fallback: true,
    })
  }
  const stock = mockStocks.find((s) => s.symbol === symbol) || mockStocks[0]
  return withFallback(() => client.get(`/predict/${symbol}`), {
    symbol,
    prediction: stock.rating,
    confidence: stock.confidence,
    score: stock.score,
    signals: stock.signals,
    probabilities: {},
    model: 'Mock',
    fallback: true,
  })
}

export function getHealth() {
  if (USE_MOCKS) return mockWrap({ status: 'ok', model_ready: true })
  return withFallback(() => client.get('/health'), { status: 'ok', model_ready: true })
}

export default client
