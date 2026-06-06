import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUIStore } from "@/store/useUIStore";

// ─────────────────────────────────────────────────────────────────────────────
// useCountUp — counts from 0 to target on every mount (every page load/refresh)
// Handles: "50K+" → counts 0..50 then appends "K+"
//          "4.9★" → counts 0.0..4.9 (1 decimal) then appends "★"
//          "2-Day"→ counts 0..2 then appends "-Day"
// ─────────────────────────────────────────────────────────────────────────────
function useCountUp(raw, duration = 1800) {
  const [value, setValue] = useState("");
  const rafRef = useRef(null);

  useEffect(() => {
    const str      = String(raw);
    const isFloat  = str.includes(".");
    // Extract leading number — e.g. "50K+" → 50, "4.9★" → 4.9, "2-Day" → 2
    const match    = str.match(/^(\d+\.?\d*)(.*)/);
    if (!match) { setValue(str); return; }

    const numeric  = parseFloat(match[1]); // 50 | 4.9 | 2
    const suffix   = match[2];             // "K+" | "★" | "-Day"
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * numeric;
      const formatted = isFloat ? current.toFixed(1) : Math.floor(current);
      setValue(formatted + suffix);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // ← empty deps = fires fresh on every mount

  return value || raw;
}

// ─────────────────────────────────────────────────────────────────────────────
// ShineText — gold light sweeps across text continuously
// Uses a self-contained <style> tag so it never conflicts with Tailwind classes
// ─────────────────────────────────────────────────────────────────────────────
function ShineText({ children }) {
  return (
    <>
      <style>{`
        @keyframes nx-shine {
          0%   { background-position: -250% center; }
          100% { background-position: 250% center; }
        }
        .nx-shine-text {
          display: inline-block;
          background-image: linear-gradient(
            110deg,
            #8B6914 0%,
            #D4AF37 20%,
            #F7E98E 38%,
            #ffffff 50%,
            #F7E98E 62%,
            #D4AF37 80%,
            #8B6914 100%
          );
          background-size: 250% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: nx-shine 6s linear infinite;
        }
      `}</style>
      <span className="nx-shine-text">{children}</span>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatItem — single animated counter pill
// ─────────────────────────────────────────────────────────────────────────────
function StatItem({ raw, label, duration }) {
  const counted = useCountUp(raw, duration);
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Plain gold color — NOT text-gold-gradient which would kill the counter */}
      <span
        className="text-2xl md:text-3xl font-display font-black"
        style={{ color: "#D4AF37" }}
      >
        {counted}
      </span>
      <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

const STATS = [
  { raw: "50K+",  label: "Products",  duration: 3000 },
  { raw: "200K+", label: "Customers", duration: 3500 },
  { raw: "4.9★",  label: "Rating",    duration: 2500 },
  { raw: "2-Day", label: "Delivery",  duration: 2000 },
];

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const { theme } = useUIStore();
  const isDark    = theme === "dark";

  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center bg-background">

      {/* ── Background ─────────────────────────────────────────────── */}
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0B] via-[#111118] to-[#0B0B0B]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,175,55,0.08),transparent)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(212,175,55,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.5) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f6f0] via-[#faf8f2] to-[#f5f3ec]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,175,55,0.12),transparent)]" />
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "linear-gradient(rgba(180,140,20,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(180,140,20,0.5) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </>
      )}

      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />

      <div className="section-container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left copy ──────────────────────────────────────────── */}
          <div className="animate-slide-in-bottom">

            {/* Label pill */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 glass-gold rounded-full border border-gold/20">
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                <span className="text-xs font-mono font-semibold text-gold">Nigeria's #1 Premium Marketplace</span>
              </div>
            </div>

            {/* ── Headline ─────────────────────────────────────────── */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[1.0] mb-6">
              {/* "Shop" — plain theme-aware color */}
              <span className={isDark ? "text-white" : "text-gray-900"}>Shop</span>

              {/* "Premium" — moving gold shine sweep */}
              <span className="block">
                <ShineText>Premium</ShineText>
              </span>

              {/* "Products" — plain theme-aware color */}
              <span className={`block ${isDark ? "text-white" : "text-gray-900"}`}>Products</span>
            </h1>

            {/* Subheadline */}
            <p className={`text-lg leading-relaxed mb-10 max-w-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Electronics, fashion, beauty &amp; more — delivered to your door in days.
              Quality guaranteed, prices unmatched.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/products"
                className="btn-gold inline-flex items-center gap-2 h-12 px-8 rounded-xl text-sm font-display font-bold shadow-xl shadow-gold/20"
              >
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/products?sort=sale"
                className={`inline-flex items-center gap-2 h-12 px-8 rounded-xl text-sm font-display font-semibold border border-border hover:border-gold/40 hover:text-gold transition-all ${isDark ? "text-white" : "text-gray-900"}`}
              >
                View Deals
                <span className="px-1.5 py-0.5 bg-destructive/20 text-destructive text-xs rounded font-mono">SALE</span>
              </Link>
            </div>

            {/* ── Animated stats ─────────────────────────────────────── */}
            <div className="flex gap-6 sm:gap-10 flex-wrap">
              {STATS.map((s) => (
                <StatItem key={s.label} raw={s.raw} label={s.label} duration={s.duration} />
              ))}
            </div>
          </div>

          {/* ── Right product showcase ─────────────────────────────── */}
          <div className="relative hidden lg:flex items-center justify-center">

            {/* Main product card */}
            <div className={`relative z-10 rounded-3xl p-6 border shadow-2xl w-72 ${
              isDark ? "glass border-white/10" : "bg-white/80 backdrop-blur-xl border-black/8 shadow-black/10"
            }`}>
              <div className="aspect-square rounded-2xl overflow-hidden bg-surface-elevated mb-4 img-zoom">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
                  alt="Featured product"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">Electronics</p>
              <h3 className="font-display font-bold text-sm mb-2 leading-snug text-foreground">
                Sony WH-1000XM5 Wireless Headphones
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-display font-black" style={{ color: "#D4AF37" }}>₦185,000</span>
                <span className="badge-sale text-xs">-24%</span>
              </div>
            </div>

            {/* Floating mini card — Nike */}
            <div className={`absolute -left-8 top-10 rounded-2xl p-3 border shadow-xl w-44 animate-float ${
              isDark ? "glass border-white/10" : "bg-white/90 backdrop-blur-xl border-black/8"
            }`} style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80" alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-[10px] font-semibold leading-tight text-foreground">Nike Air Jordan 1</p>
                  <p className="text-[10px] font-mono" style={{ color: "#D4AF37" }}>₦95,000</p>
                </div>
              </div>
            </div>

            {/* Floating mini card — PS5 */}
            <div className={`absolute -right-6 bottom-16 rounded-2xl p-3 border shadow-xl w-44 animate-float ${
              isDark ? "glass border-white/10" : "bg-white/90 backdrop-blur-xl border-black/8"
            }`} style={{ animationDelay: "2s" }}>
              <div className="flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=100&q=80" alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-[10px] font-semibold leading-tight text-foreground">PlayStation 5</p>
                  <p className="text-[10px] font-mono" style={{ color: "#D4AF37" }}>₦450,000</p>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className={`absolute top-0 right-4 rounded-xl px-3 py-2 border ${
              isDark ? "glass border-white/10" : "bg-white/90 backdrop-blur-xl border-black/8"
            }`}>
              <p className="text-[10px] text-emerald-500 font-mono font-semibold">✓ Verified Authentic</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}