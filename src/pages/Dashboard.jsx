import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiDollarSign,
  FiTrendingUp,
  FiPieChart,
  FiPlus,
  FiArrowRight,
} from 'react-icons/fi'
import { getPortfolio, getStocks } from '../services/api.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import ChangePill from '../components/ui/ChangePill.jsx'
import RatingBadge from '../components/ui/RatingBadge.jsx'
import Loader from '../components/ui/Loader.jsx'
import { ComparisonLine, AllocationDonut, Sparkline } from '../components/ui/Charts.jsx'

function formatMoney(n) {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null)
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([getPortfolio(), getStocks()]).then(([p, s]) => {
      if (!active) return
      setPortfolio(p.data)
      setStocks(s.data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  if (loading) return <Loader />

  const gain = portfolio.pnlPct
  const holdings = portfolio.watchlist
    .map((w) => ({ ...w, detail: stocks.find((s) => s.symbol === w.symbol) }))
    .filter((w) => w.detail)

  return (
    <div>
      <PageHeader
        eyebrow="dashboard"
        title="Portfolio Dashboard"
        subtitle="A live view of your holdings, model performance and what TradeDNA recommends next."
        badge={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-bright px-4 py-2 text-sm font-semibold text-ink-950 transition-transform duration-200 hover:scale-[1.03]"
          >
            <FiPlus />
            Add Holding
          </button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Portfolio Value"
          value={formatMoney(portfolio.currentValue)}
          icon={FiDollarSign}
          trend={gain}
          sub={`Invested ${formatMoney(portfolio.invested)}`}
        />
        <StatCard
          label="Total Return"
          value={formatMoney(portfolio.pnl)}
          icon={FiTrendingUp}
          trend={gain}
          sub="vs. benchmark +4.7%"
        />
        <StatCard
          label="Model Confidence"
          value="86%"
          icon={FiPieChart}
          trend={3.2}
          sub="Average signal confidence"
        />
        <StatCard
          label="Win Rate"
          value="71.4%"
          icon={FiTrendingUp}
          trend={1.8}
          sub="Recommended trades, 90d"
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold text-white">Performance vs. Benchmark</h2>
            <span className="chip bg-gold/10 text-gold">+11.78% YTD</span>
          </div>
          <ComparisonLine data={portfolio.performance} />
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-2 font-semibold text-white">Sector Allocation</h2>
          <AllocationDonut data={portfolio.allocation} />
          <ul className="mt-2 flex flex-wrap gap-2">
            {portfolio.allocation.map((a) => (
              <li key={a.name} className="flex items-center gap-1.5 text-xs text-mist">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: a.color }}
                />
                {a.name} {a.value}%
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="font-semibold text-white">Your Watchlist</h2>
          <Link
            to="/analysis"
            className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-bright"
          >
            Analyze more <FiArrowRight />
          </Link>
        </div>
        <div className="overflow-x-auto p-5">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-fog">
                <th className="pb-3 pr-4 font-semibold">Symbol</th>
                <th className="pb-3 pr-4 font-semibold">Price</th>
                <th className="pb-3 pr-4 font-semibold">24h</th>
                <th className="pb-3 pr-4 font-semibold">Trend</th>
                <th className="pb-3 pr-4 font-semibold">Rating</th>
                <th className="pb-3 text-right font-semibold">DNA Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {holdings.map((h) => (
                <tr key={h.symbol} className="group transition-colors hover:bg-ink-800/60">
                  <td className="py-3.5 pr-4">
                    <p className="font-bold text-white">{h.symbol}</p>
                    <p className="text-xs text-fog">{h.detail.name}</p>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-slate-300">
                    ${h.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 pr-4">
                    <ChangePill value={h.changePct} />
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="h-10 w-28">
                      <Sparkline
                        data={h.detail.history}
                        color={h.changePct >= 0 ? '#22c55e' : '#ef4444'}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <RatingBadge rating={h.rating} />
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="font-mono font-bold text-gold">
                      {h.detail.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
