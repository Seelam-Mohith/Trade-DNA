import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiArrowUpRight, FiChevronRight } from 'react-icons/fi'
import { getRankings } from '../services/api.js'
import { formatPrice } from '../utils/format.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import ChangePill from '../components/ui/ChangePill.jsx'
import RatingBadge from '../components/ui/RatingBadge.jsx'
import Loader from '../components/ui/Loader.jsx'

const SECTORS = [
  'All',
  'Semiconductors',
  'Software',
  'E-Commerce & Cloud',
  'Financials',
  'Automotive',
  'Internet & Media',
  'Energy',
  'Consumer Electronics',
  'Oil & Gas',
  'IT Services',
  'Banking',
  'Telecom',
  'Consumer Goods',
]

export default function Rankings() {
  const [rankings, setRankings] = useState([])
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRankings().then((r) => {
      setRankings(r.data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    return rankings.filter((s) => {
      const matchQuery =
        !query ||
        s.symbol.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
      const matchSector = sector === 'All' || s.sector === sector
      return matchQuery && matchSector
    })
  }, [rankings, query, sector])

  if (loading) return <Loader />

  const bestScore = Math.max(...rankings.map((s) => s.score))

  return (
    <div>
      <PageHeader
        eyebrow="rankings"
        title="Stock Rankings"
        subtitle="Every name in our universe, ranked by TradeDNA score. The higher the score, the stronger the model conviction."
        badge={
          <span className="chip bg-gold/10 text-gold ring-1 ring-inset ring-gold/30">
            {filtered.length} securities
          </span>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticker or company…"
            className="w-full rounded-lg border border-line bg-ink-800 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-gold/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSector(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                sector === s
                  ? 'bg-gold text-ink-950'
                  : 'border border-line text-slate-400 hover:border-gold/40 hover:text-gold'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-ink-800/50 text-xs uppercase tracking-wider text-fog">
                <th className="px-5 py-3.5 font-semibold">#</th>
                <th className="px-4 py-3.5 font-semibold">Security</th>
                <th className="px-4 py-3.5 font-semibold">Sector</th>
                <th className="px-4 py-3.5 font-semibold">Price</th>
                <th className="px-4 py-3.5 font-semibold">24h</th>
                <th className="px-4 py-3.5 font-semibold">Rating</th>
                <th className="px-4 py-3.5 font-semibold">Target</th>
                <th className="px-5 py-3.5 text-right font-semibold">DNA Score</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((s, i) => (
                <tr
                  key={s.symbol}
                  className="group transition-colors hover:bg-ink-800/60"
                >
                  <td className="px-5 py-4 font-mono text-fog">
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-lg bg-ink-700 text-xs font-bold text-gold">
                        {s.symbol.slice(0, 3)}
                      </span>
                      <div>
                        <p className="font-bold text-white">{s.symbol}</p>
                        <p className="text-xs text-fog">{s.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-mist">{s.sector}</td>
                  <td className="px-4 py-4 font-mono text-slate-300">
                    {formatPrice(s.price, s.currency)}
                  </td>
                  <td className="px-4 py-4">
                    <ChangePill value={s.changePct} />
                  </td>
                  <td className="px-4 py-4">
                    <RatingBadge rating={s.rating} />
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-400">
                    {formatPrice(s.targets.consensus, s.currency)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold-dim to-gold"
                          style={{ width: `${(s.score / bestScore) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 font-mono font-bold text-gold">
                        {s.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/analysis?symbol=${s.symbol}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      Analyze <FiArrowUpRight />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-mist">
            No securities match your filters.
          </p>
        )}
      </div>

      <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="text-sm text-mist">
          <span className="font-semibold text-gold">Tip:</span> filter by sector
          to surface opportunities in the themes you care about.
        </p>
        <Link
          to="/analysis"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-bright"
        >
          Open analyzer <FiChevronRight />
        </Link>
      </div>
    </div>
  )
}
