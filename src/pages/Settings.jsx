import { useState } from 'react'
import {
  FiBell,
  FiCheck,
  FiDollarSign,
  FiGlobe,
  FiRotateCcw,
  FiSliders,
  FiZap,
} from 'react-icons/fi'
import PageHeader from '../components/ui/PageHeader.jsx'

const REFRESH_OPTIONS = [
  { value: '5m', label: 'Every 5 minutes' },
  { value: '15m', label: 'Every 15 minutes' },
  { value: '1h', label: 'Every hour' },
  { value: 'manual', label: 'Manual only' },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? 'bg-gold' : 'bg-ink-700'
      }`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-ink-950 transition-transform duration-200 ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function SettingRow({ icon: Icon, title, desc, control }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-ink-700 text-gold">
          <Icon size={16} />
        </span>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-mist">{desc}</p>
        </div>
      </div>
      {control}
    </div>
  )
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <section className="card fade-up p-6">
      <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-white">
        <span className="grid size-8 place-items-center rounded-lg bg-gold/10 text-gold">
          <Icon size={16} />
        </span>
        {title}
      </h2>
      <div className="mt-3 divide-y divide-line">{children}</div>
    </section>
  )
}

export default function Settings() {
  const [currency, setCurrency] = useState('USD')
  const [refresh, setRefresh] = useState('15m')
  const [notifyRating, setNotifyRating] = useState(true)
  const [notifyPrice, setNotifyPrice] = useState(true)
  const [notifyDaily, setNotifyDaily] = useState(false)
  const [compactDensity, setCompactDensity] = useState(false)
  const [saved, setSaved] = useState(false)

  function resetDefaults() {
    setCurrency('USD')
    setRefresh('15m')
    setNotifyRating(true)
    setNotifyPrice(true)
    setNotifyDaily(false)
    setCompactDensity(false)
  }

  return (
    <div>
      <PageHeader
        eyebrow="settings"
        title="Settings"
        subtitle="Tune how TradeDNA looks and behaves. Preferences are stored locally for now."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard icon={FiSliders} title="Preferences">
          <SettingRow
            icon={FiGlobe}
            title="Default currency"
            desc="How prices and targets are formatted across the app."
            control={
              <div className="flex rounded-lg border border-line bg-ink-800 p-0.5">
                {['USD', 'INR'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      currency === c
                        ? 'bg-gold text-ink-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {c === 'USD' ? '$ USD' : '₹ INR'}
                  </button>
                ))}
              </div>
            }
          />
          <SettingRow
            icon={FiZap}
            title="Signal refresh"
            desc="How often the DNA scores should refresh."
            control={
              <select
                value={refresh}
                onChange={(e) => setRefresh(e.target.value)}
                className="rounded-lg border border-line bg-ink-800 px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-gold/50"
              >
                {REFRESH_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            }
          />
        </SectionCard>

        <SectionCard icon={FiBell} title="Notifications">
          <SettingRow
            icon={FiDollarSign}
            title="Price alerts"
            desc="Get notified when a watchlist name breaks a level."
            control={<Toggle checked={notifyPrice} onChange={setNotifyPrice} />}
          />
          <SettingRow
            icon={FiSliders}
            title="Rating changes"
            desc="Alerts when a security's DNA rating moves up or down."
            control={<Toggle checked={notifyRating} onChange={setNotifyRating} />}
          />
          <SettingRow
            icon={FiBell}
            title="Daily digest"
            desc="A daily summary of top-ranked names and AI insights."
            control={<Toggle checked={notifyDaily} onChange={setNotifyDaily} />}
          />
        </SectionCard>

        <SectionCard icon={FiSliders} title="Display">
          <SettingRow
            icon={FiSliders}
            title="Compact density"
            desc="Show more rows per screen in rankings and watchlists."
            control={<Toggle checked={compactDensity} onChange={setCompactDensity} />}
          />
        </SectionCard>

        <div className="card fade-up flex flex-col justify-between gap-6 p-6">
          <div>
            <h2 className="text-base font-semibold text-white">Save changes</h2>
            <p className="mt-1 text-xs leading-relaxed text-mist">
              Settings currently live in browser local state. A backend-backed
              profile sync is planned.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-bright px-4 py-2.5 text-sm font-semibold text-ink-950 transition-transform duration-200 hover:scale-[1.03]"
            >
              {saved ? <FiCheck /> : <FiGlobe />}
              {saved ? 'Saved' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-gold/40 hover:text-gold"
            >
              <FiRotateCcw /> Reset defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}