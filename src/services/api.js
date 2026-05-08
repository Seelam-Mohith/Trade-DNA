import axios from 'axios'
import {
  mockStocks,
  marketIndex,
  portfolio,
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

export async function getStocks() {
  if (USE_MOCKS) return mockWrap(mockStocks)
  return client.get('/stocks')
}

export async function getStockById(id) {
  if (USE_MOCKS) {
    await delay()
    return mockWrap(mockStocks.find((s) => s.id === id) || mockStocks[0])
  }
  return client.get(`/stocks/${id}`)
}

export async function getMarketIndex() {
  if (USE_MOCKS) return mockWrap(marketIndex)
  return client.get('/market/index')
}

export async function getPortfolio() {
  if (USE_MOCKS) return mockWrap(portfolio)
  return client.get('/portfolio')
}

export async function getRankings() {
  if (USE_MOCKS) return mockWrap(rankings)
  return client.get('/rankings')
}

export async function getInsights() {
  if (USE_MOCKS) return mockWrap(aiInsights)
  return client.get('/insights')
}

export async function getAnalysisWatchlist() {
  if (USE_MOCKS) return mockWrap(analysisWatchlist)
  return client.get('/analysis/watchlist')
}

export default client
