export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', position: 'prefix', decimals: 2, rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', position: 'prefix', decimals: 2, rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', position: 'prefix', decimals: 2, rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', position: 'prefix', decimals: 0, rate: 149.5 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', position: 'prefix', decimals: 2, rate: 82.5 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', position: 'prefix', decimals: 2, rate: 7.25 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', position: 'prefix', decimals: 2, rate: 1.54 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', position: 'prefix', decimals: 2, rate: 1.38 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', position: 'suffix', decimals: 2, rate: 0.88 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', position: 'prefix', decimals: 2, rate: 7.79 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', position: 'prefix', decimals: 2, rate: 1.34 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', position: 'prefix', decimals: 2, rate: 1.66 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', position: 'prefix', decimals: 0, rate: 1380 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', position: 'suffix', decimals: 2, rate: 10.4 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', position: 'suffix', decimals: 2, rate: 10.7 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', position: 'prefix', decimals: 2, rate: 17.2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', position: 'prefix', decimals: 2, rate: 5.05 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', position: 'suffix', decimals: 2, rate: 3.67 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', position: 'suffix', decimals: 2, rate: 18.9 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', position: 'prefix', decimals: 2, rate: 92.5 },
]

const CURRENCY_MAP = new Map(CURRENCIES.map((c) => [c.code, c]))

export function convertAmount(amount, from = 'USD', to = 'USD') {
  const fromRate = CURRENCY_MAP.get(from)?.rate ?? 1
  const toRate = CURRENCY_MAP.get(to)?.rate ?? 1
  return (Number(amount) / fromRate) * toRate
}

export function formatPrice(price, currency = 'USD') {
  const cur = CURRENCY_MAP.get(currency) ?? CURRENCY_MAP.get('USD')
  const formatted = Number(price).toLocaleString('en-US', {
    minimumFractionDigits: cur.decimals,
    maximumFractionDigits: cur.decimals,
  })
  return cur.position === 'suffix' ? `${formatted} ${cur.symbol}` : `${cur.symbol}${formatted}`
}