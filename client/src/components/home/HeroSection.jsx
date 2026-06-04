import { Link } from "react-router-dom";

const STATS = [
  { value: "50K+", label: "Products" },
  { value: "200K+", label: "Customers" },
  { value: "4.9★", label: "Rating" },
  { value: "2-Day", label: "Delivery" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0B] via-[#111118] to-[#0B0B0B]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,175,55,0.08),transparent)]" />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />

      <div className="section-container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="animate-slide-in-bottom">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 glass-gold rounded-full border border-gold/20">
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                <span className="text-xs font-mono font-semibold text-gold">Nigeria's #1 Premium Marketplace</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[1.0] mb-6">
              Shop
              <span className="block text-gold-gradient">Premium</span>
              <span className="block text-foreground">Products</span>
            </h1>

            {/* Subheadline */}
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg">
              Electronics, fashion, beauty & more — delivered to your door in days. Quality guaranteed, prices unmatched.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/products" className="btn-gold inline-flex items-center gap-2 h-12 px-8 rounded-xl text-sm font-display font-bold shadow-xl shadow-gold/20">
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Link>
              <Link to="/products?sort=sale" className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-sm font-display font-semibold border border-border hover:border-gold/40 hover:text-gold transition-all">
                View Deals
                <span className="px-1.5 py-0.5 bg-destructive/20 text-destructive text-xs rounded font-mono">SALE</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-display font-black text-gold-gradient">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-mono">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product showcase */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Main product card */}
            <div className="relative z-10 glass rounded-3xl p-6 border border-white/10 shadow-2xl w-72">
              <div className="aspect-square rounded-2xl overflow-hidden bg-surface-elevated mb-4 img-zoom">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
                  alt="Featured product"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">Electronics</p>
              <h3 className="font-display font-bold text-sm mb-2 leading-snug">Sony WH-1000XM5 Wireless Headphones</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-display font-black text-gold-gradient">₦185,000</span>
                <span className="badge-sale text-xs">-24%</span>
              </div>
            </div>

            {/* Floating mini cards */}
            <div className="absolute -left-8 top-10 glass rounded-2xl p-3 border border-white/10 shadow-xl w-44 animate-float" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80" alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-[10px] font-semibold leading-tight">Nike Air Jordan 1</p>
                  <p className="text-[10px] text-gold font-mono">₦95,000</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 bottom-16 glass rounded-2xl p-3 border border-white/10 shadow-xl w-44 animate-float" style={{ animationDelay: "2s" }}>
              <div className="flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=100&q=80" alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-[10px] font-semibold leading-tight">PlayStation 5</p>
                  <p className="text-[10px] text-gold font-mono">₦450,000</p>
                </div>
              </div>
            </div>

            {/* Trust badge floating */}
            <div className="absolute top-0 right-4 glass rounded-xl px-3 py-2 border border-white/10">
              <p className="text-[10px] text-emerald-400 font-mono font-semibold">✓ Verified Authentic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
