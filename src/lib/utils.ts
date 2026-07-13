// ─── Currency Formatting ─────────────────────────────────────

/**
 * Formats a number as Egyptian Pounds.
 * @example formatEGP(1200) → "EGP 1,200"
 * @example formatEGP(1200.5) → "EGP 1,200.50"
 */
export function formatEGP(amount: number, showDecimals = false): string {
  return `EGP ${amount.toLocaleString('en-EG', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })}`;
}

/**
 * Calculates discount percentage between original and sale price.
 * @returns integer percentage (e.g. 21)
 */
export function calcDiscount(price: number, originalPrice: number): number {
  return Math.round((1 - price / originalPrice) * 100);
}

/**
 * Clamps a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}


// ─── Format Relative Date ────────────────────────────────────

export function relativeDate(dateStr: string): string {
  return dateStr; // placeholder until real dates are added
}

// ─── Slug ────────────────────────────────────────────────────

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
