/**
 * Format number to Indonesian Rupiah currency
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format number to short IDR (e.g., Rp 19.000)
 * @param {number} amount
 * @returns {string}
 */
export function formatPrice(amount) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`
}
