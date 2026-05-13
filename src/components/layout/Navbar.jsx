import { FiBell, FiSearch } from 'react-icons/fi'
import { BiDna } from 'react-icons/bi'
import { NavLink, Link } from 'react-router-dom'
import { NAV_ITEMS } from './navigation.js'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `relative rounded-lg px-2 py-2 text-[13px] font-medium transition-colors duration-200 md:text-sm lg:px-3.5 ${
      isActive
        ? 'text-gold'
        : 'text-slate-400 hover:text-slate-100 hover:bg-ink-800'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:gap-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-gold to-gold-dim text-ink-950 glow-gold">
            <BiDna size={20} />
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-white md:block">
            Trade<span className="text-gold">DNA</span>
          </span>
        </Link>

        <div className="relative hidden w-60 xl:block">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search symbols, sectors…"
            className="w-full rounded-lg border border-line bg-ink-800 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-gold/50"
          />
        </div>

        <nav className="ml-auto flex items-center gap-0.5 sm:gap-1 lg:gap-1.5">
          {NAV_ITEMS.map(({ label, path }) => (
            <NavLink key={path} to={path} end={path === '/'} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-ink-800 hover:text-white"
          >
            <FiBell size={18} />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-gold" />
          </button>
          <Link
            to="/rankings"
            className="hidden rounded-lg bg-gradient-to-r from-gold to-gold-bright px-3 py-2 text-sm font-semibold text-ink-950 transition-transform duration-200 hover:scale-[1.03] sm:block lg:px-4"
          >
            Top Picks
          </Link>
        </div>
      </div>
    </header>
  )
}
