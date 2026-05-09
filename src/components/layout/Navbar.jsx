import { FiMenu, FiBell, FiSearch } from 'react-icons/fi'
import { BiDna } from 'react-icons/bi'
import { NavLink, Link } from 'react-router-dom'
import { NAV_ITEMS } from './navigation.js'

export default function Navbar({ onMenuClick }) {
  const linkClass = ({ isActive }) =>
    `relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-gold'
        : 'text-slate-400 hover:text-slate-100 hover:bg-ink-800'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-ink-800 hover:text-white lg:hidden"
        >
          <FiMenu size={20} />
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-gold to-gold-dim text-ink-950 glow-gold">
            <BiDna size={20} />
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-white sm:block">
            Trade<span className="text-gold">DNA</span>
          </span>
        </Link>

        <div className="relative ml-2 hidden w-64 md:block">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search symbols, sectors…"
            className="w-full rounded-lg border border-line bg-ink-800 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-gold/50"
          />
        </div>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map(({ label, path }) => (
            <NavLink key={path} to={path} end={path === '/'} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
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
            className="hidden rounded-lg bg-gradient-to-r from-gold to-gold-bright px-4 py-2 text-sm font-semibold text-ink-950 transition-transform duration-200 hover:scale-[1.03] sm:block"
          >
            Top Picks
          </Link>
        </div>
      </div>
    </header>
  )
}
