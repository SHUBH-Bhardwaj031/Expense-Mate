// utils/parseFilters.js
export function parsePrice(value) {
  if (value === undefined) return null;
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
}

// Parse date string in either full ISO or YYYY-MM-DD.
// If dateOnly (YYYY-MM-DD) we construct a local date to avoid cross-browser ambiguity.
// If endOfDay true, set time to 23:59:59.999 to make "dateTo" inclusive.
export function parseDate(value, endOfDay = false) {
  if (!value) return null;

  const dateOnlyRe = /^\d{4}-\d{2}-\d{2}$/;
  let d;
  if (dateOnlyRe.test(value)) {
    const [y, m, day] = value.split("-").map(Number);
    d = new Date(y, m - 1, day); // local midnight
  } else {
    d = new Date(value);
  }
  if (isNaN(d.getTime())) return null;
  if (endOfDay) d.setHours(23, 59, 59, 999);
  return d;
}

