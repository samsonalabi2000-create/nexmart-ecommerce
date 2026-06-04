import { cn } from "@/lib/utils";

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "default", className }) {
  const v = {
    default: "bg-secondary text-secondary-foreground",
    sale: "badge-sale",
    new: "badge-new",
    hot: "badge-hot",
    gold: "bg-gold text-[#0B0B0B]",
    outline: "border border-border text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide", v[variant], className)}>
      {children}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-4",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg hover:shadow-black/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }) {
  return <div className={cn("skeleton h-4 w-full", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <Skeleton className="h-60 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

// ─── StarRating ───────────────────────────────────────────────────────────────
export function StarRating({ rating, reviewCount, size = "sm", showCount = true }) {
  const s = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div className={cn("flex items-center gap-1", s)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className={cn("w-3.5 h-3.5", star <= Math.round(rating) ? "text-gold fill-gold" : "text-muted fill-none")} viewBox="0 0 24 24">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        ))}
      </div>
      <span className="text-[11px] font-mono text-muted-foreground">{rating.toFixed(1)}</span>
      {showCount && reviewCount && (
        <span className="text-[11px] text-muted-foreground">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = "md", className }) {
  const s = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
  return (
    <div className={cn("animate-spin rounded-full border-2 border-border border-t-gold", s[size], className)} />
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider({ label, className }) {
  if (!label) return <hr className={cn("border-border", className)} />;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <hr className="flex-1 border-border" />
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <hr className="flex-1 border-border" />
    </div>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({ label, title, highlight, subtitle, action }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        {label && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-gold rounded-full" />
            <span className="text-xs font-mono font-semibold text-gold uppercase tracking-widest">{label}</span>
          </div>
        )}
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          {title}{" "}
          {highlight && <span className="text-gold-gradient">{highlight}</span>}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && action}
    </div>
  );
}
