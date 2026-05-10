import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'

export default function ChangePill({ value, withIcon = true }) {
  const positive = value >= 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
        positive ? 'bg-bull/15 text-bull' : 'bg-bear/15 text-bear'
      }`}
    >
      {withIcon &&
        (positive ? <FiArrowUpRight size={13} /> : <FiArrowDownRight size={13} />)}
      {positive ? '+' : ''}
      {value.toFixed(2)}%
    </span>
  )
}
