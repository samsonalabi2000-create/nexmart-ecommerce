import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { productService, categoryService } from "@/services/api";
import { useCountdown, useIntersection } from "@/hooks";
import { SectionHeader, ProductCardSkeleton } from "@/components/ui/index";
import ProductCard from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

// ─── FeaturedCategories ───────────────────────────────────────────────────────
export function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const ref = useRef(null);
  const visible = useIntersection(ref);

  useEffect(() => { categoryService.getAll().then(setCategories); }, []);

  return (
    <section ref={ref} className="py-16 section-container">
      <SectionHeader label="Browse" title="Shop by" highlight="Category" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className={cn(
              "group flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-surface hover:border-gold/40 hover:bg-surface-elevated transition-all duration-300",
              visible ? "animate-slide-in-bottom opacity-100" : "opacity-0"
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
            <div className="text-center">
              <p className="text-xs font-display font-semibold text-foreground group-hover:text-gold transition-colors leading-tight">{cat.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{cat.count.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── BestSellers ──────────────────────────────────────────────────────────────
export function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getBestSellers().then((p) => { setProducts(p); setLoading(false); });
  }, []);

  return (
    <section className="py-16 bg-surface/50 border-y border-border">
      <div className="section-container">
        <SectionHeader
          label="Top Picks"
          title="Best"
          highlight="Sellers"
          subtitle="Our most loved products this month"
          action={<Link to="/products?sort=popular" className="text-sm text-gold hover:underline font-medium">View all →</Link>}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {loading
            ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </div>
    </section>
  );
}

// ─── FlashSales ───────────────────────────────────────────────────────────────
export function FlashSales() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const target = new Date(Date.now() + 8 * 3600 * 1000); // 8 hours from now
  const { hours, minutes, seconds } = useCountdown(target);

  useEffect(() => {
    productService.getFlashSales().then((p) => { setProducts(p); setLoading(false); });
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="py-16 section-container">
      {/* Header with countdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-destructive rounded-full" />
            <span className="text-xs font-mono font-semibold text-destructive uppercase tracking-widest">Limited Time</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            ⚡ Flash <span className="text-destructive">Sales</span>
          </h2>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Ends in:</span>
          {[pad(hours), pad(minutes), pad(seconds)].map((t, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center font-mono font-bold text-sm text-foreground">{t}</span>
              {i < 2 && <span className="text-muted-foreground font-bold text-sm">:</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading
          ? Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)
        }
      </div>

      <div className="text-center mt-8">
        <Link to="/products?sort=sale" className="btn-gold inline-flex items-center gap-2 h-11 px-8 rounded-xl text-sm font-display font-bold">
          View All Flash Sales →
        </Link>
      </div>
    </section>
  );
}

// ─── NewArrivals ──────────────────────────────────────────────────────────────
export function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getNewArrivals().then((p) => { setProducts(p); setLoading(false); });
  }, []);

  return (
    <section className="py-16 bg-surface/30 border-y border-border">
      <div className="section-container">
        <SectionHeader
          label="Just In"
          title="New"
          highlight="Arrivals"
          subtitle="Fresh drops — be the first to get them"
          action={<Link to="/products?sort=newest" className="text-sm text-gold hover:underline font-medium">View all →</Link>}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
import { TESTIMONIALS } from "@/lib/mockData";

export function Testimonials() {
  return (
    <section className="py-16 section-container">
      <SectionHeader label="Reviews" title="What Customers" highlight="Say" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {TESTIMONIALS.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-5 border border-border/50 hover:border-gold/20 transition-colors">
            <div className="flex mb-3">
              {Array(t.rating).fill(0).map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-gold fill-gold" viewBox="0 0 24 24">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="1" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.comment}"</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                <span className="text-xs font-display font-bold text-gold">{t.avatar}</span>
              </div>
              <div>
                <p className="text-xs font-semibold">{t.name}</p>
                <div className="flex items-center gap-1">
                  <p className="text-[10px] text-muted-foreground">{t.location}</p>
                  {t.verified && <span className="text-[10px] text-emerald-400 font-mono">✓ Verified</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── MarqueeBrands ────────────────────────────────────────────────────────────
const BRANDS_LIST = ["Apple", "Samsung", "Sony", "Nike", "Adidas", "Dyson", "LG", "Fenty Beauty", "PlayStation", "Bose", "Canon", "HP"];

export function MarqueeBrands() {
  return (
    <section className="py-10 border-y border-border overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {[...BRANDS_LIST, ...BRANDS_LIST].map((brand, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm font-display font-bold text-muted-foreground hover:text-foreground transition-colors cursor-default">
              <span className="w-1 h-1 bg-gold rounded-full" />
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── NewsletterSection ────────────────────────────────────────────────────────
export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) { setSubmitted(true); }
  };

  return (
    <section className="py-16 section-container">
      <div className="relative glass rounded-3xl p-10 md:p-16 border border-border overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(212,175,55,0.06),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-xs font-mono font-semibold text-gold uppercase tracking-widest mb-3">Stay in the loop</p>
          <h2 className="text-3xl md:text-4xl font-display font-black mb-3">
            Get Exclusive <span className="text-gold-gradient">Deals</span>
          </h2>
          <p className="text-muted-foreground mb-8">Subscribe for early access to flash sales, new arrivals, and up to 25% off your first order.</p>
          {submitted ? (
            <div className="flex items-center justify-center gap-2 py-3 text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="font-semibold">You're subscribed! Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="input-dark flex-1 h-11 text-sm"
              />
              <button type="submit" className="btn-gold px-5 h-11 rounded-xl text-sm font-semibold whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
