import { FiTrendingUp, FiAward, FiCpu, FiShield } from 'react-icons/fi'

export default function PageHeader({ eyebrow, title, subtitle, badge }) {
  return (
    <div className="fade-up mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
              {eyebrow === 'dashboard' && <FiTrendingUp />}
              {eyebrow === 'analysis' && <FiCpu />}
              {eyebrow === 'rankings' && <FiAward />}
              {eyebrow === 'about' && <FiShield />}
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
              {subtitle}
            </p>
          )}
        </div>
        {badge}
      </div>
    </div>
  )
}
