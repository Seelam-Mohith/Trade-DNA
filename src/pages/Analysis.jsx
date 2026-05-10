import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FiTarget,
  FiBarChart2,
  FiThumbsUp,
  FiAlertTriangle,
  FiChevronDown,
} from 'react-icons/fi'
import { getStocks, getAnalysisWatchlist } from '../services/api.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import ChangePill from '../components/ui/ChangePill.jsx'
import RatingBadge from '../components/ui/RatingBadge.jsx'
import Loader from '../components/ui/Loader.jsx'
import { TrendLine } from '../components/ui/Charts.jsx'

function SignalBar({ label, value, color }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-mist">{label}</span>
        <span className="font-mono font-bold text-slate-200">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-700">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function Analysis() {
  const [params, setParams] = useSearchParams()
  const [stocks, setStocks] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([getStocks(), getAnalysisWatchlist()]).then(([s, w]) => {
      if (!alive) return
      setStocks(s.data)
      setWatchlist(w.data)
      const fromUrl = params.get('symbol')
      const found = s.data.find((x) => x.symbol === fromUrl) || s.data[0]
      setActive(found)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  function select(symbol) {
    const found = stocks.find((x) => x.symbol === symbol)
    if (found) {
      setActive(found)
      setParams({ symbol }, { replace: true })
    }
  }

  if (loading || !active) return <Loader />

  const { signals } = active

  return (
    <div>
      <PageHeader
        eyebrow="analysis"
        title="Stock Analysis"
        subtitle="Deep-dive the DNA score behind every recommendation — signal by signal."
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <div className="card p-4 lg:col-span-1">
          <h2 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wider text-fog">
            Watchlist
          </h2>
          <ul className="flex flex-col gap-1">
            {watchlist.map((w) => (
              <li key={w.symbol}>
                <button
                  type="button"
                  onClick={() => select(w.symbol)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                    active.symbol === w.symbol
                      ? 'bg-ink-800 text-gold'
                      : 'text-slate-400 hover:bg-ink-800 hover:text-slate-100'
                  }`}
                >
                  <span>
                    <span className="block font-semibold">{w.symbol}</span>
                    <span className="block text-xs text-fog">{w.name}</span>
                  </span>
                  <span
                    className={`font-mono text-sm ${
                      w.changePct >= 0 ? 'text-bull' : 'text-bear'
                    }`}
                  >
                    {w.changePct >= 0 ? '+' : ''}
                    {w.changePct.toFixed(2)}%
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card flex flex-col gap-5 p-5 lg:col-span-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-white">{active.symbol}</h2>
                <span className="text-sm text-fog">{active.name}</span>
                <span className="chip bg-ink-700 text-slate-300">
                  {active.sector}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <p className="font-mono text-3xl font-bold text-white">
                  ${active.price.toFixed(2)}
                </p>
                <ChangePill value={active.changePct} />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <RatingBadge rating={active.rating} size="md" />
              <span className="text-xs text-fog">
                Confidence{' '}
                <span className="font-bold text-gold">
                  {(active.confidence * 100).toFixed(0)}%
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-mist">
                <FiBarChart2 className="text-gold" /> Vol {active.volume}
              </span>
              <span className="flex items-center gap-1.5 text-mist">
                <FiTarget className="text-gold" /> Mkt cap {active.marketCap}
              </span>
              <span className="flex items-center gap-1.5 text-mist">
                <FiTarget className="text-gold" /> P/E {active.pe}
              </span>
            </div>
            <div className="hidden items-center gap-2 text-xs text-fog sm:flex">
              <span className="text-bull">▼ {active.targets.low}</span>
              <span>Consensus ${active.targets.consensus}</span>
              <span className="text-bull">▲ {active.targets.high}</span>
            </div>
          </div>

          <TrendLine
            data={active.history}
            xKey="date"
            yKey="close"
            color={active.changePct >= 0 ? '#22c55e' : '#ef4444'}
            height={300}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-lg border border-line bg-ink-800/60 p-4">
              <h3 className="text-sm font-semibold text-white">Factor Signals</h3>
              <SignalBar label="Momentum" value={signals.momentum} color="#f0b90b" />
              <SignalBar label="Growth" value={signals.growth} color="#22c55e" />
              <SignalBar label="Value" value={signals.value} color="#3b82f6" />
              <SignalBar label="Sentiment" value={signals.sentiment} color="#a78bfa" />
              <SignalBar label="Volatility (risk)" value={signals.volatility} color="#ef4444" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-bull/25 bg-bull/5 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-bull">
                  <FiThumbsUp /> Strengths
                </h3>
                <ul className="flex flex-col gap-1.5 text-sm text-slate-300">
                  {active.strengths.map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-bull" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-bear/25 bg-bear/5 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-bear">
                  <FiAlertTriangle /> Risks
                </h3>
                <ul className="flex flex-col gap-1.5 text-sm text-slate-300">
                  {active.risks.map((r) => (
                    <li key={r} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-bear" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-lg border border-line bg-ink-800/60 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <FiTarget className="text-gold" /> Price Targets
            </h3>
            <div className="flex flex-col gap-2">
              <div className="h-2.5 overflow-hidden rounded-full bg-ink-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-bear via-gold to-bull"
                  style={{
                    width: `${Math.min(
                      100,
                      ((active.targets.high - active.targets.low) /
                        (active.targets.high - active.targets.low)) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-mist">Low ${active.targets.low}</span>
                <span className="font-semibold text-gold">
                  Consensus ${active.targets.consensus}
                </span>
                <span className="text-mist">High ${active.targets.high}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-bright px-4 py-2 text-sm font-semibold text-ink-950 transition-transform duration-200 hover:scale-[1.03]"
            style={{ boxShadow: '0 0 0 rgba(0,0,0,0)' }}
          >
            Run Full AI Model
            <FiChevronDown className="hidden" />
          </button>
        </div>
      </section>
    </div>
  )
}
