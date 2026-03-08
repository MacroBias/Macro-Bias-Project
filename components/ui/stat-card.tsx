import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "positive" | "negative";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-all hover:border-border/80",
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <p
        className={cn(
          "mt-2 text-3xl font-bold tracking-tight",
          variant === "positive" && "text-positive",
          variant === "negative" && "text-negative",
          variant === "default" && "text-foreground"
        )}
      >
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
