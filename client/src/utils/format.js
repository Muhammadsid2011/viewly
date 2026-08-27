// Formatting helpers shared across the app. The API returns raw numbers and ISO
// timestamps; the UI wants human-friendly strings ("1.2M views", "12:45", "3 days ago").

export function formatDuration(seconds) {
  const total = Math.floor(Number(seconds) || 0);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  const ss = String(s).padStart(2, "0");
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${ss}`;
  }
  return `${m}:${ss}`;
}

export function formatCount(value) {
  const n = Number(value) || 0;
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) {
    const v = n / 1000;
    return `${v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")}K`;
  }
  if (n < 1_000_000_000) {
    const v = n / 1_000_000;
    return `${v.toFixed(1).replace(/\.0$/, "")}M`;
  }
  const v = n / 1_000_000_000;
  return `${v.toFixed(1).replace(/\.0$/, "")}B`;
}

export function formatViews(value) {
  const n = Number(value) || 0;
  return `${formatCount(n)} ${n === 1 ? "view" : "views"}`;
}

export function timeAgo(date) {
  if (!date) return "";
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, (Date.now() - then) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const v = Math.floor(diff / secs);
    if (v >= 1) return `${v} ${name}${v > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {

  const data = error?.response?.data;

  if (data) {

    if (typeof data === "string") {

      if (!data.trim().startsWith("<")) return data;

    } else if (typeof data === "object") {

      if (data.message) return data.message;
      
      if (data.error && typeof data.error === "string") return data.error;
      
      if (data.errors) {
      
        if (Array.isArray(data.errors)) {
      
          const first = data.errors[0];
      
          if (typeof first === "string") return first;
          if (first?.message) return first.message;
        } else if (typeof data.errors === "object") {
          const first = Object.values(data.errors)[0];

          if (typeof first === "string") return first;
          if (Array.isArray(first) && first[0]) return first[0];
          if (first?.message) return first.message;
        }
      }
    }
  }
  if (error?.message && error.message !== "Network Error") return error.message;
  if (error?.message === "Network Error") return "Cannot reach the server. Is it running?";
  return fallback;
}
