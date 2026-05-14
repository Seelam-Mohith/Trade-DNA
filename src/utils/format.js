export function formatPrice(price, currency = 'USD') {
  const prefix = currency === 'INR' ? '₹' : '$'
  return `${prefix}${Number(price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
