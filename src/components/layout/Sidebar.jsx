import { NavLink, Link } from 'react-router-dom'
import { FiX, FiTrendingUp, FiAward, FiZap } from 'react-icons/fi'
import { NAV_ITEMS } from './navigation.js'

const MARKET_SNAPSHOT = [
  { symbol: 'NVDA', price: 178.42, changePct: 1.21 },
  { symbol: 'AAPL', price: 242.16, changePct: -0.44 },
  { symbol: 'TSLA', price: 348.71, changePct: 3.7 },
]

export default function Sidebar({ open, onClose }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-ink-800 text-gold'
        : 'text-slate-400 hover:bg-ink-800 hover:text-slate-100'
    }`

  const content = (
    <div className="flex h-full flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between lg:hidden">
        <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-gold to-gold-dim text-ink-950">
            <FiTrendingUp />
          </span>
          <span className="text-lg font-bold text-white">
            Trade<span className="text-gold">DNA</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="rounded-lg p-2 text-slate-400 hover:bg-ink-800 hover:text-white"
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        <p className="px-3.5 pb-2 text-xs font-semibold uppercase tracking-widest text-fog">
          Menu
        </p>
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={onClose}
            className={linkClass}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div className="card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <FiZap className="text-gold" />
            Market Snapshot
          </div>
          <ul className="flex flex-col gap-2.5">
            {MARKET_SNAPSHOT.map((t) => (
              <li key={t.symbol} className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-300">{t.symbol}</span>
                <span className="flex items-center gap-2 font-mono text-slate-400">
                  ${t.price}
                  <span
                    className={
                      t.changePct >= 0 ? 'text-bull' : 'text-bear'
                    }
                  >
                    {t.changePct >= 0 ? '+' : ''}
                    {t.changePct}%
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card flex items-center gap-3 p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
            <FiAward />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Pro Signal</p>
            <p className="text-xs text-mist">
              Unlock the full AI model suite
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-ink-900 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>

      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  )
}
