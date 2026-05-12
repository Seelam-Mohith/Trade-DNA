# TradeDNA — AI-Powered Stock Recommendation System

A modern, responsive React frontend for TradeDNA, an AI-powered stock
recommendation engine that condenses market data into a single explainable
DNA score per security.

## Tech Stack

- **React 18** (JavaScript, functional components + hooks)
- **React Router** for navigation
- **Tailwind CSS v4** for styling (dark financial dashboard theme)
- **Axios** (API layer prepared, mock data used for now)
- **Recharts** for charts (trends, donut allocation, sparklines)
- **React Icons**

## Pages

- **Home** — landing page with market overview and top recommendations
- **Dashboard** — portfolio value, performance vs benchmark, sector allocation, watchlist
- **Analysis** — per-ticker deep dive: DNA score, factor signals, strengths/risks, price targets
- **Rankings** — full universe ranked by DNA score with sector/query filters
- **About** — how the model works and what TradeDNA values

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build & Verify

```bash
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

`npm run build` compiles all modules and validates the Tailwind theme; any
import or syntax error fails the build.

## Project Structure

```
src/
├── components/
│   ├── layout/     Navbar, Sidebar, Footer, Layout, navigation config
│   └── ui/         RatingBadge, ChangePill, StatCard, PageHeader, Loader, Charts
├── pages/          Home, Dashboard, Analysis, Rankings, About
├── data/           mockData.js (stocks, market index, portfolio, insights)
├── services/       api.js (axios client, mock-backed)
├── App.jsx         React Router routes
└── main.jsx        app entry
```

## API Integration

All data flows through `src/services/api.js`. It currently resolves to mock
data so the UI works without a backend. Set `VITE_USE_MOCKS=false` and point
`VITE_API_BASE_URL` at a real API to switch over.

## Disclaimer

For research and informational purposes only — not financial advice.
