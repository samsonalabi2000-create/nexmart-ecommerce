import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price, currency = "₦") {
  return `${currency}${price.toLocaleString("en-NG")}`;
}

export function formatDiscount(original, sale) {
  return Math.round(((original - sale) / original) * 100);
}

export function truncate(str, length = 50) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));