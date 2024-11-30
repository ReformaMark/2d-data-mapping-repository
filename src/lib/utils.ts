import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateToMonthYear(dateString: string | undefined) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export function formatDate({
  convexDate
}: {
  convexDate: number
}) {
  const roundedTimestamp = Math.floor(convexDate);
  const readableDate = new Date(roundedTimestamp);
  const now = new Date();
  const diffInSeconds = (now.getTime() - readableDate.getTime()) / 1000;

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'yesterday';

  return readableDate.toLocaleString();
}