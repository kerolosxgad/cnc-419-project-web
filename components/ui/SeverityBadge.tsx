import { cn, getSeverityBadgeClass } from "@/utils/helpers";
import type { SeverityLevel } from "@/types";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span className={cn("badge", getSeverityBadgeClass(severity), className)}>
      {severity.toUpperCase()}
    </span>
  );
}
