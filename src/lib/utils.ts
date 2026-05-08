import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number) {
  return format(new Date(date), "PPP");
}

export function truncate(str: string, length = 140) {
  if (str.length <= length) return str;
  return `${str.slice(0, Math.max(0, length - 1))}…`;
}

export function generateUsername(email: string) {
  const [name] = email.split("@");
  return (name || "user")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20);
}

