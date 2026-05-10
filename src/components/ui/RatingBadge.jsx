import { RATINGS } from '../../data/mockData.js'

const colorMap = {
  bull: 'bg-bull/15 text-bull ring-bull/30',
  bear: 'bg-bear/15 text-bear ring-bear/30',
  gold: 'bg-gold/15 text-gold ring-gold/30',
}

export default function RatingBadge({ rating, size = 'sm' }) {
  const meta = RATINGS[rating] || RATINGS.HOLD
  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ring-1 ring-inset ${px} ${colorMap[meta.color]}`}
    >
      {meta.label}
    </span>
  )
}
