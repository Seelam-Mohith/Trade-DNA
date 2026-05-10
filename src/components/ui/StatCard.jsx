export default function StatCard({ label, value, sub, icon: Icon, trend }) {
  const trendPositive = trend >= 0
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-mist">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>
        {Icon && (
          <span className="grid size-10 place-items-center rounded-lg bg-gold/10 text-gold">
            <Icon size={18} />
          </span>
        )}
      </div>
      {trend !== undefined && (
        <p
          className={`mt-3 text-sm font-semibold ${
            trendPositive ? 'text-bull' : 'text-bear'
          }`}
        >
          {trendPositive ? '+' : ''}
          {trend}%
        </p>
      )}
      {sub && <p className="mt-1 text-xs text-fog">{sub}</p>}
    </div>
  )
}
