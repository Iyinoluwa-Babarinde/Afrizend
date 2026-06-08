import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
const EXCHANGE_RATES_TO_NGN = {
    NGN: 1,
    USD: 1360.54,
    GBP: 1818.18,
    KES: 10.53,
    GHS: 115.12,
    EUR: 1569.47
};

export function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    const fromRateToNGN = EXCHANGE_RATES_TO_NGN[fromCurrency || "NGN"] || 1;
    const toRateToNGN = EXCHANGE_RATES_TO_NGN[toCurrency || "NGN"] || 1;
    const amountInNGN = amount * fromRateToNGN;
    return Number((amountInNGN / toRateToNGN).toFixed(2));
}

export function formatCurrency(amount, currency = "NGN") {
    const localeMap = {
        "USD": "en-US",
        "GBP": "en-GB",
        "NGN": "en-NG",
        "KES": "en-KE",
        "GHS": "en-GH"
    };
    const locale = localeMap[currency] || "en-US";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
}
export function formatDate(dateStr) {
    if (!dateStr)
        return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}
export function formatRelativeTime(dateStr) {
    if (!dateStr)
        return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
        return "Today";
    if (diffDays === 1)
        return "Tomorrow";
    if (diffDays === -1)
        return "Yesterday";
    if (diffDays > 1)
        return `in ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
}
export function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
export function getInitials(name) {
    if (!name)
        return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.substring(0, 2)).toUpperCase();
}
export function verdictColor(status) {
    switch (status) {
        case "APPROVED": return "hsl(145 65% 50%)";
        case "NEEDS_REVISION": return "hsl(0 84% 60%)";
        case "ESCALATED": return "hsl(38 92% 60%)";
        case "UNDER_REVIEW": return "hsl(200 100% 60%)";
        case "IN_PROGRESS": return "hsl(217 91% 65%)";
        default: return "hsl(220 15% 45%)";
    }
}
