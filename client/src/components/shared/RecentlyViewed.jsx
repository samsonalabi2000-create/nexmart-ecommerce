import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice, cn } from "@/lib/utils";

// ── Hook — call on any product detail page to track views ─────────────────
export function useTrackRecentlyViewed(product) {
  useEffect(() => {
    if (!product) return;
    try {
      const raw   = localStorage.getItem("nx_recent") || "[]";
      const items = JSON.parse(raw).filter((p) => p.id !== product.id);
      items.unshift({
        id:           product.id,
        name:         product.name,
        price:        product.price,
        originalPrice:product.originalPrice,
        images:       product.images,
        category:     product.category,
        categoryName: product.categoryName,
        rating:       product.rating,
        badge:        product.badge,
      });
      localStorage.setItem("nx_recent", JSON.stringify(items.slice(0, 8)));
    } catch {}
  }, [product?.id]);
}

// ── Section component — shows last 6 viewed products ──────────────────────
export default function RecentlyViewed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nx_recent") || "[]";
      setItems(JSON.parse(raw).slice(0, 6));
    } catch {}
  }, []);

  if (items.length < 2) return null;

  return (
    <section className="py-14 section-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-0.5 bg-gold rounded-full" />
            <span className="text-xs font-mono font-semibold text-gold uppercase tracking-widest">
              Your History
            </span>
          </div>
          <h2 className="text-2xl font-display font-bold">
            Recently <span className="text-gold-gradient">Viewed</span>
          </h2>
        </div>
        <button
          onClick={() => { localStorage.removeItem("nx_recent"); setItems([]); }}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors font-mono">
          Clear history
        </button>
      </div>

      {/* Horizontal scroll strip */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {items.map((p) => (
          <Link key={p.id} to={`/products/${p.id}`}
            className="shrink-0 w-44 group">
            <div className="rounded-xl overflow-hidden border border-border bg-surface hover:border-gold/30 transition-all duration-300 hover:-translate-y-1">
              {/* Image */}
              <div className="h-36 overflow-hidden img-zoom bg-surface-elevated relative">
                <img src={p.images[0]} alt={p.name}
                  className="w-full h-full object-cover" />
                {p.badge && (
                  <span className={cn(
                    "absolute top-2 left-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
                    p.badge === "sale" ? "badge-sale" : p.badge === "hot" ? "badge-hot" : "badge-new"
                  )}>
                    {p.badge.toUpperCase()}
                  </span>
                )}
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide mb-1">
                  {p.categoryName}
                </p>
                <p className="text-xs font-display font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-2 leading-snug mb-2">
                  {p.name}
                </p>
                <p className="text-sm font-display font-black" style={{ color: "#D4AF37" }}>
                  {formatPrice(p.price)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}