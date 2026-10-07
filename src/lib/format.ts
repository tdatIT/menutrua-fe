const vndFormatter = new Intl.NumberFormat('vi-VN');

/** 45000 → "45.000đ" */
export function formatPrice(amount: number): string {
  return `${vndFormatter.format(amount)}đ`;
}

export function percent(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}
