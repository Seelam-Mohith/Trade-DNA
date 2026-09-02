import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiCpu,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiActivity,
} from 'react-icons/fi'
import { mockStocks, marketIndex, aiInsights } from '../data/mockData.js'
import { getStocks, getMarketIndex } from '../services/api.js'
import { formatPrice } from '../utils/format.js'
import ChangePill from '../components/ui/ChangePill.jsx'
import RatingBadge from '../components/ui/RatingBadge.jsx'
import { Sparkline, TrendLine } from '../components/ui/Charts.jsx'

const FEATURES = [
  {
    icon: FiCpu,
    title: 'AI Signal Engine',
    desc: 'A multi-factor model blends momentum, growth, value and sentiment into a single DNA score.',
  },
  {
    icon: FiTrendingUp,
    title: 'Actionable Ratings',
    desc: 'Clear Strong Buy / Buy / Hold / Sell signals backed by confidence scores — no noise.',
  },
  {
    icon: FiShield,
    title: 'Risk-Aware',
    desc: 'Volatility and drawdown analysis keep recommendations honest about the downside.',
  },
  {
    icon: FiZap,
    title: 'Real-Time Watchlists',
    desc: 'Track curated stock sets and see rating shifts the moment the model updates.',
  },
]

export default function Home() {
  const [stocks, setStocks] = useState([])
  const [index, setIndex] = useState(marketIndex)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([getStocks(), getMarketIndex()])
      .then(([s, m]) => {
        if (!alive) return
        if (s.data && s.data.length) setStocks(s.data)
        if (m.data && m.data.length) setIndex(m.data)
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const topThree = (stocks.length ? stocks : mockStocks)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-16">
      <section className="fade-up grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="chip bg-gold/10 text-gold ring-1 ring-inset ring-gold/30">
            <FiActivity />
            AI-powered stock intelligence
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Decode the market with{' '}
            <span className="bg-gradient-to-r from-gold via-gold-bright to-gold bg-clip-text text-transparent">
              TradeDNA
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
            Turn raw market data into clear recommendations. TradeDNA scores
            hundreds of stocks daily and hands you the few that matter.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/rankings"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-bright px-6 py-3 text-sm font-semibold text-ink-950 transition-transform duration-200 hover:scale-[1.03]"
            >
              View Rankings
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-gold/40 hover:text-gold"
            >
              Learn More
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { k: '12.4K', v: 'Stocks scored' },
              { k: '94%', v: 'Signal clarity' },
              { k: '4.2', v: 'Momentum edge' },
            ].map((s) => (
              <div key={s.v}>
                <dt className="text-2xl font-bold text-white">{s.k}</dt>
                <dd className="text-xs text-fog">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="card fade-up p-5" style={{ animationDelay: '120ms' }}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mist">S&P 500 Index</p>
              <p className="text-2xl font-bold text-white">
                {loading
                  ? '—'
                  : index.length
                    ? index[index.length - 1].value.toLocaleString()
                    : '—'}
              </p>
            </div>
            <ChangePill value={2.36} />
          </div>
          <TrendLine data={index} yKey="value" height={280} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            className="card card-hover fade-up p-5"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="mb-4 grid size-11 place-items-center rounded-xl bg-gold/10 text-gold">
              <Icon size={20} />
            </span>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">{desc}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Today's Top Recommendations
            </h2>
            <p className="mt-1 text-sm text-mist">
              Highest-scoring opportunities across our model universe.
            </p>
          </div>
          <Link
            to="/rankings"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold-bright"
          >
            Full rankings <FiArrowRight />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {topThree.map((s) => (
            <Link
              key={s.id}
              to={`/analysis?symbol=${s.symbol}`}
              className="card card-hover fade-up group p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-white">{s.symbol}</p>
                  <p className="text-xs text-fog">{s.name}</p>
                </div>
                <RatingBadge rating={s.rating} />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <p className="font-mono text-xl font-bold text-white">
                  {formatPrice(s.price, s.currency)}
                </p>
                <ChangePill value={s.changePct} />
              </div>
              <div className="mt-3">
                <Sparkline data={s.history} color={s.changePct >= 0 ? '#22c55e' : '#ef4444'} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-mist">DNA Score</span>
                <span className="font-mono font-bold text-gold">{s.score}/100</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-white">Live AI Insights</h2>
            <p className="mt-1 text-sm text-mist">
              What the model is watching right now.
            </p>
            <ul className="mt-6 flex flex-col gap-4">
              {aiInsights.map((insight) => (
                <li
                  key={insight.id}
                  className="rounded-lg border border-line bg-ink-800/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-100">{insight.title}</p>
                    <span
                      className={`chip shrink-0 ${
                        insight.signal === 'bull'
                          ? 'bg-bull/15 text-bull'
                          : 'bg-gold/15 text-gold'
                      }`}
                    >
                      {insight.signal === 'bull' ? 'Bullish' : 'Neutral'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    {insight.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div>
              <h2 className="text-xl font-bold text-white">How it works</h2>
              <ol className="mt-6 flex flex-col gap-5">
                {[
                  'Collect price, volume and fundamentals across thousands of securities.',
                  'Score each name on momentum, growth, value, volatility and sentiment.',
                  'Blend signals into a DNA score and confidence-rated recommendation.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold/10 font-mono text-sm font-bold text-gold">
                      {i + 1}
                    </span>
                    <p className="pt-1 text-sm leading-relaxed text-slate-300">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <Link
              to="/about"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-bright"
            >
              Learn more about TradeDNA <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
