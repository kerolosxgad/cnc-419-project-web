import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SeverityLevel, IOCType } from "@/types";

/**
 * Utility to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get color for severity level
 */
export function getSeverityColor(severity: SeverityLevel): string {
  const colors: Record<SeverityLevel, string> = {
    critical: "#DC2626",
    high: "#F97316",
    medium: "#FBBF24",
    low: "#10B981",
    info: "#06B6D4",
  };
  return colors[severity] || colors.info;
}

/**
 * Get severity badge class
 */
export function getSeverityBadgeClass(severity: SeverityLevel): string {
  const classes: Record<SeverityLevel, string> = {
    critical: "badge-critical",
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
    info: "badge-info",
  };
  return classes[severity] || classes.info;
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Get IOC type display name
 */
export function getIOCTypeLabel(type: IOCType): string {
  const labels: Record<IOCType, string> = {
    ipv4: "IPv4",
    domain: "Domain",
    url: "URL",
    md5: "MD5 Hash",
    sha256: "SHA256 Hash",
    email: "Email",
    hostname: "Hostname",
    yara: "YARA Rule",
    cve: "CVE",
  };
  return labels[type] || type.toUpperCase();
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}

/**
 * Calculate severity score (0-100)
 */
export function calculateSeverityScore(severity: SeverityLevel): number {
  const scores: Record<SeverityLevel, number> = {
    critical: 90,
    high: 70,
    medium: 50,
    low: 30,
    info: 10,
  };
  return scores[severity] || 0;
}

/**
 * Export data to CSV
 */
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent =
    headers.join(",") +
    "\n" +
    data.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to JSON
 */
export function exportToJSON(data: any, filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.json`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parse tags from JSON string
 */
export function parseTags(tags: string | string[]): string[] {
  if (Array.isArray(tags)) return tags;
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}
