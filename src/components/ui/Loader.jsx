import { FiCpu } from 'react-icons/fi'

export default function Loader({ label = 'Crunching market data…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-mist">
      <FiCpu className="animate-pulse text-gold" size={28} />
      <p className="text-sm">{label}</p>
    </div>
  )
}
