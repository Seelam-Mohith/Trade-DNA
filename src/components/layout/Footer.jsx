import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'
import { BiDna } from 'react-icons/bi'
import { NAV_ITEMS } from './navigation.js'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-950/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-gold to-gold-dim text-ink-950">
              <BiDna />
            </span>
            <span className="text-lg font-bold text-white">
              Trade<span className="text-gold">DNA</span>
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mist">
            AI-powered stock recommendations built on quantitative signals,
            technical analysis and sentiment — so you can invest with clarity.
          </p>
          <div className="flex items-center gap-2">
            {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="rounded-lg border border-line p-2 text-slate-400 transition-colors hover:border-gold/40 hover:text-gold"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-fog">
            Navigate
          </p>
          <ul className="grid grid-cols-2 gap-2.5">
            {NAV_ITEMS.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-sm text-slate-400 transition-colors hover:text-gold"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-fog">
            Disclaimer
          </p>
          <p className="text-sm leading-relaxed text-mist">
            TradeDNA provides research and analytics for informational purposes
            only. Nothing here is financial advice. Always do your own
            diligence before trading.
          </p>
        </div>
      </div>

      <div className="border-t border-line py-5 text-center text-xs text-fog">
        © {new Date().getFullYear()} TradeDNA. Crafted for the long-term
        investor.
      </div>
    </footer>
  )
}
