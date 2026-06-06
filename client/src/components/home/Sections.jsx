import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { productService, categoryService } from "@/services/api";
import { useCountdown, useIntersection } from "@/hooks";
import { SectionHeader, ProductCardSkeleton } from "@/components/ui/index";
import ProductCard from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import { TESTIMONIALS } from "@/lib/mockData";

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

// ─── MarqueeBrands ────────────────────────────────────────────────────────────
const BRANDS_ROW1 = [
  { name: "Apple",        icon: "🍎" },
  { name: "Samsung",      icon: "📱" },
  { name: "Sony",         icon: "🎵" },
  { name: "Nike",         icon: "✔" },
  { name: "Adidas",       icon: "⭐" },
  { name: "Dyson",        icon: "💨" },
  { name: "LG",           icon: "📺" },
  { name: "Fenty Beauty", icon: "💄" },
  { name: "PlayStation",  icon: "🎮" },
  { name: "Bose",         icon: "🎧" },
  { name: "Canon",        icon: "📷" },
  { name: "HP",           icon: "💻" },
];
const BRANDS_ROW2 = [
  { name: "Rolex",        icon: "⌚" },
  { name: "Gucci",        icon: "👜" },
  { name: "Prada",        icon: "👒" },
  { name: "Microsoft",    icon: "🖥️" },
  { name: "Nikon",        icon: "📸" },
  { name: "Asus",         icon: "⌨️" },
  { name: "Xiaomi",       icon: "📲" },
  { name: "Charlotte Tilbury", icon: "💋" },
  { name: "Versace",      icon: "🦅" },
  { name: "GoPro",        icon: "🎬" },
  { name: "Logitech",     icon: "🖱️" },
  { name: "Intel",        icon: "🔵" },
];

export function MarqueeBrands() {
  return (
    <section className="py-8 border-y border-border overflow-hidden bg-surface/30 select-none">
      {/* Row 1 — scrolls left */}
      <div className="relative overflow-hidden mb-3">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex whitespace-nowrap animate-marquee">
          {[...BRANDS_ROW1, ...BRANDS_ROW1, ...BRANDS_ROW1].map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2.5 mx-6 py-2 px-4 rounded-full border border-border/50 bg-surface text-sm font-display font-semibold text-muted-foreground hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all duration-300 cursor-default"
            >
              <span className="text-base leading-none">{b.icon}</span>
              {b.name}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right (reverse) */}
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {[...BRANDS_ROW2, ...BRANDS_ROW2, ...BRANDS_ROW2].map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2.5 mx-6 py-2 px-4 rounded-full border border-border/50 bg-surface text-sm font-display font-semibold text-muted-foreground hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all duration-300 cursor-default"
            >
              <span className="text-base leading-none">{b.icon}</span>
              {b.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials — 3D Space/Particle Section ────────────────────────────────

const EXTENDED_REVIEWS = [
  ...TESTIMONIALS,
  {
    id: 5,
    name: "Blessing Okonkwo",
    location: "Enugu, Nigeria",
    rating: 5,
    comment: "I've been shopping on NexMart for 6 months. Every single order has been perfect. The quality checks are real.",
    avatar: "BO",
    verified: true,
    date: "1 month ago",
    product: "iPhone 15 Pro Max",
  },
  {
    id: 6,
    name: "Yusuf Musa",
    location: "Kaduna, Nigeria",
    rating: 5,
    comment: "Ordered PS5 during the flash sale — saved ₦50,000. Delivered in 48 hours. This is the future of Nigerian e-commerce.",
    avatar: "YM",
    verified: true,
    date: "1 month ago",
    product: "PlayStation 5",
  },
];

// Particle canvas — animated star field
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate stars
    const stars = Array.from({ length: 120 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.15 + 0.03,
      alpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    }));

    // Shooting stars
    const shoots = [];
    const addShoot = () => {
      shoots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 3),
        len: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 4,
        alpha: 1,
        angle: Math.PI / 6,
      });
    };
    const shootInterval = setInterval(() => {
      if (Math.random() < 0.4) addShoot();
    }, 2200);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha >= 0.8 || s.alpha <= 0.1) s.twinkleDir *= -1;
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${s.alpha * 0.7})`;
        ctx.fill();

        // Occasional white star
        if (s.r > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
          ctx.fill();
        }
      });

      // Shooting stars
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i];
        const dx = Math.cos(sh.angle) * sh.len;
        const dy = Math.sin(sh.angle) * sh.len;
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x + dx, sh.y + dy);
        grad.addColorStop(0, `rgba(255,255,255,${sh.alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x + dx, sh.y + dy);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        sh.x += Math.cos(sh.angle) * sh.speed;
        sh.y += Math.sin(sh.angle) * sh.speed;
        sh.alpha -= 0.018;
        if (sh.alpha <= 0) shoots.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(shootInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  );
}

// Single review card with 3D tilt on hover
function ReviewCard({ review, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX =  ((y - cy) / cy) * -10;
    const rotY =  ((x - cx) / cx) *  10;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px) scale(1.02)`;
    // Shine layer
    const shine = card.querySelector(".card-shine");
    if (shine) {
      const pct = (x / rect.width) * 100;
      shine.style.background = `radial-gradient(circle at ${pct}% ${(y / rect.height) * 100}%, rgba(212,175,55,0.12) 0%, transparent 70%)`;
      shine.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)";
    const shine = card.querySelector(".card-shine");
    if (shine) shine.style.opacity = "0";
  };

  const floatDelay = `${index * 0.4}s`;
  const floatDuration = `${4 + index * 0.5}s`;

  return (
    <div
      style={{
        animation: `float ${floatDuration} ease-in-out infinite`,
        animationDelay: floatDelay,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transition: "transform 0.15s ease-out", willChange: "transform" }}
        className="relative rounded-2xl border border-white/10 overflow-hidden cursor-default"
      >
        {/* Card background — deep glass with gold tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/90 via-[#0f0f1a]/80 to-[#1a1a0a]/90 backdrop-blur-xl" />
        <div className="absolute inset-0 border border-gold/10 rounded-2xl" />

        {/* Shine layer — appears on hover */}
        <div
          className="card-shine absolute inset-0 rounded-2xl pointer-events-none"
          style={{ opacity: 0, transition: "opacity 0.3s" }}
        />

        {/* Top accent line */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="relative z-10 p-5">
          {/* Stars */}
          <div className="flex gap-0.5 mb-3">
            {Array(5).fill(0).map((_, i) => (
              <svg key={i} className={cn("w-3.5 h-3.5", i < review.rating ? "text-gold fill-gold" : "text-white/20 fill-white/10")} viewBox="0 0 24 24">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            ))}
            <span className="ml-auto text-[10px] font-mono text-white/30">{review.date}</span>
          </div>

          {/* Quote */}
          <div className="relative mb-4">
            <span className="absolute -top-1 -left-1 text-3xl font-serif text-gold/20 leading-none select-none">"</span>
            <p className="text-sm text-white/75 leading-relaxed pl-4 line-clamp-4">
              {review.comment}
            </p>
          </div>

          {/* Product tag */}
          {review.product && (
            <div className="mb-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                Purchased: {review.product}
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            {/* Avatar with gold ring */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 flex items-center justify-center">
                <span className="text-xs font-display font-black text-gold">{review.avatar}</span>
              </div>
              {/* Orbit dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0f0f1a]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display font-semibold text-white truncate">{review.name}</p>
              <p className="text-[10px] text-white/40 truncate">{review.location}</p>
            </div>
            {review.verified && (
              <div className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
                <span className="text-[9px] font-mono text-emerald-400">Verified</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const sectionRef = useRef(null);
  const isVisible = useIntersection(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0B0B0B 0%, #0a0a18 40%, #0B0B0B 100%)" }}
    >
      {/* Particle canvas — full section background */}
      <ParticleCanvas />

      {/* Deep space radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,175,55,0.04),transparent)] pointer-events-none" />

      {/* Nebula blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-900/8 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-900/8 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDuration: "10s", animationDelay: "3s" }} />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold" />
            <span className="text-xs font-mono font-semibold text-gold uppercase tracking-[0.25em]">From Our Customers</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-3">
            Voices from the{" "}
            <span className="text-gold-gradient">Community</span>
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Real shoppers. Real experiences. Over 200,000 happy customers across Nigeria.
          </p>

          {/* Floating stat pills */}
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            {[
              { value: "4.9/5", label: "Average Rating" },
              { value: "98%", label: "Satisfaction" },
              { value: "200K+", label: "Reviews" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                <span className="text-sm font-display font-black text-gold">{s.value}</span>
                <span className="text-xs text-white/40">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cards grid — 3D tilt cards with float animation */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {EXTENDED_REVIEWS.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
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