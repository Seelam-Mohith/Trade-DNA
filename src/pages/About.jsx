import { Link } from 'react-router-dom'
import {
  FiCpu,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiArrowRight,
  FiLayers,
  FiBarChart2,
  FiHeart,
  FiEye,
} from 'react-icons/fi'
import PageHeader from '../components/ui/PageHeader.jsx'

const MODEL_STEPS = [
  {
    icon: FiLayers,
    title: 'Data Ingestion',
    desc: 'Price, volume, fundamentals and news are collected across a universe of 12,000+ securities daily.',
  },
  {
    icon: FiBarChart2,
    title: 'Signal Computation',
    desc: 'Five factor families — momentum, growth, value, volatility and sentiment — are scored per ticker.',
  },
  {
    icon: FiCpu,
    title: 'Ensemble Scoring',
    desc: 'A weighted ensemble blends the factors into a single 0–100 DNA score and confidence estimate.',
  },
  {
    icon: FiTrendingUp,
    title: 'Recommendations',
    desc: 'Scores map to Strong Buy / Buy / Hold / Sell signals that update as new data arrives.',
  },
]

const VALUES = [
  { icon: FiShield, title: 'Transparency', desc: 'Every score is explainable factor-by-factor. No black boxes.' },
  { icon: FiZap, title: 'Speed', desc: 'Signals refresh continuously so you act on the latest picture.' },
  { icon: FiHeart, title: 'Risk Honesty', desc: 'We surface the downside as clearly as the upside.' },
  { icon: FiEye, title: 'Clarity', desc: 'Actionable output, not a wall of raw data.' },
]

export default function About() {
  return (
    <div>
      <PageHeader
        eyebrow="about"
        title="About TradeDNA"
        subtitle="TradeDNA is an AI-powered stock recommendation engine built for investors who want signal, not noise."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card fade-up flex flex-col gap-4 p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-white">Our Mission</h2>
          <p className="leading-relaxed text-slate-300">
            Markets produce far more information than any human can process.
            TradeDNA condenses that flood into a single, explainable score for
            every stock — then turns the score into a clear recommendation.
          </p>
          <p className="leading-relaxed text-mist">
            The model is built on the same building blocks professional quants
            use: momentum persistence, growth quality, valuation discipline,
            volatility awareness and market sentiment. The difference is that
            we package it into an interface anyone can read at a glance.
          </p>
        </div>

        <div className="card fade-up flex flex-col justify-center gap-6 p-6">
          <div>
            <p className="text-sm font-medium text-mist">Model universe</p>
            <p className="mt-1 text-3xl font-bold text-white">12,400+</p>
          </div>
          <div>
            <p className="text-sm font-medium text-mist">Signal refresh</p>
            <p className="mt-1 text-3xl font-bold text-white">Continuous</p>
          </div>
          <div>
            <p className="text-sm font-medium text-mist">Backtest win rate</p>
            <p className="mt-1 text-3xl font-bold text-bull">71.4%</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-6 text-xl font-bold text-white">How the Model Works</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODEL_STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="card card-hover fade-up p-5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-gold/10 text-gold">
                  <Icon size={20} />
                </span>
                <span className="font-mono text-sm text-fog">0{i + 1}</span>
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-6 text-xl font-bold text-white">What We Value</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="card fade-up p-5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="mb-3 grid size-10 place-items-center rounded-lg bg-ink-700 text-gold">
                <Icon size={18} />
              </span>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card mt-10 flex flex-col items-center gap-5 p-8 text-center">
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Ready to let the model do the heavy lifting?
        </h2>
        <p className="max-w-md text-sm text-mist">
          Explore live rankings or open the analyzer and unpack the DNA of any
          ticker.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/rankings"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-bright px-6 py-3 text-sm font-semibold text-ink-950 transition-transform duration-200 hover:scale-[1.03]"
          >
            See Rankings <FiArrowRight />
          </Link>
          <Link
            to="/analysis"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-gold/40 hover:text-gold"
          >
            Analyze Stocks
          </Link>
        </div>
      </section>
    </div>
  )
}
