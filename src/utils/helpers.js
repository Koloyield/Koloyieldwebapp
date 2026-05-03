export function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// export function daysUntil(ts) {
//   const d = Math.ceil((ts - Date.now()) / 86400000);
//   return d > 0 ? d : 0;
// }

export function shortAddr(a) {
  return a.length > 10 ? a.slice(0, 6) + "…" + a.slice(-4) : a;
}

export const fmt    = (n) => parseFloat(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
export const fmtAmt = (n) => "$" + fmt(n);
export const shortA = (a) => a ? a.slice(0, 6) + "…" + a.slice(-4) : "";
export const fmtDate = (ts) => new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
export const daysUntil = (ts) => Math.max(0, Math.ceil((ts - Date.now()) / 86400000));