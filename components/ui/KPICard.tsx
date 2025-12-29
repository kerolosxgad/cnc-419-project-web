import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/helpers";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "purple" | "cyan" | "red" | "orange" | "yellow" | "green";
  className?: string;
}

const colorClasses = {
  blue: "text-accent-blue bg-accent-blue/20",
  purple: "text-accent-purple bg-accent-purple/20",
  cyan: "text-accent-cyan bg-accent-cyan/20",
  red: "text-severity-critical bg-severity-critical/20",
  orange: "text-severity-high bg-severity-high/20",
  yellow: "text-severity-medium bg-severity-medium/20",
  green: "text-severity-low bg-severity-low/20",
};

export function KPICard({ title, value, icon: Icon, trend, color = "blue", className }: KPICardProps) {
  return (
    <div className={cn("card", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-lg", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn("text-sm font-medium", trend.isPositive ? "text-severity-low" : "text-severity-critical")}>
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
