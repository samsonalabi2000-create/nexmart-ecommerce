import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useUIStore } from "@/store/useUIStore";
import { useAuth } from "@/context/AuthContext";
import { useScrollTop } from "@/hooks";
import { productService } from "@/services/api";
import { cn, formatPrice } from "@/lib/utils";
import { CATEGORIES } from "@/lib/mockData";

const NAV_LINKS = [
  { label: "Home",        path: "/" },
  { label: "Products",    path: "/products" },
  { label: "Electronics", path: "/products?category=electronics" },
  { label: "Fashion",     path: "/products?category=fashion" },
  { label: "Deals",       path: "/products?sort=sale" },
];

// ── Icon helpers ──────────────────────────────────────────────────────────────
function SunIcon()  {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navbar() {
  const scrolled                    = useScrollTop();
  const { user, logout }            = useAuth();
  const { itemCount, items }        = useCartStore();
  const { items: wishlistItems }    = useWishlistStore();
  const { setSearchOpen, toggleTheme, theme } = useUIStore();
  const [searchQuery, setSearchQuery]   = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [megaMenu, setMegaMenu]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartPreview, setCartPreview] = useState(false);
  const [userMenu, setUserMenu]     = useState(false);
  const searchRef                   = useRef(null);
  const navigate                    = useNavigate();
  const location                    = useLocation();
  const isDark                      = theme === "dark";

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMegaMenu(false);
    setUserMenu(false);
    setCartPreview(false);
  }, [location]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) return setSearchResults([]);
    const t = setTimeout(async () => {
      const res = await productService.search(searchQuery);
      setSearchResults(res.slice(0, 6));
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  return (
    <>
      {/* Promo bar */}
      <div className="bg-gold text-[#0B0B0B] text-center py-2 text-xs font-display font-semibold tracking-wide">
        🚀 Free shipping on orders over ₦50,000 · Use code <strong>NEXMART10</strong> for 10% off
      </div>

      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass shadow-lg shadow-black/20 border-b border-border/50"
          : "bg-background border-b border-border"
      )}>
        <div className="section-container">
          <div className="flex h-16 items-center gap-2">

            {/* ── Logo ────────────────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
              <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center">
                <span className="font-display font-black text-sm text-[#0B0B0B]">N</span>
              </div>
              <span className="font-display font-bold text-lg hidden sm:block">
                Nex<span className="text-gold-gradient">Mart</span>
              </span>
            </Link>

            {/* ── Desktop nav (lg+) ────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              <div
                className="relative"
                onMouseEnter={() => setMegaMenu(true)}
                onMouseLeave={() => setMegaMenu(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-gold hover:bg-secondary transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                  Categories
                  <svg className={cn("w-3 h-3 transition-transform", megaMenu && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {megaMenu && (
                  <div className="absolute top-full left-0 mt-1 w-[480px] glass rounded-2xl border border-border/50 p-4 shadow-2xl shadow-black/40">
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <Link key={cat.id} to={`/products?category=${cat.id}`}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary transition-colors group">
                          <span className="text-2xl">{cat.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">{cat.count.toLocaleString()} products</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {NAV_LINKS.slice(1).map((link) => (
                <Link key={link.path} to={link.path}
                  className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "text-gold bg-gold/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Desktop search (md+) ─────────────────────────────── */}
            <div className="hidden md:flex flex-1 max-w-sm relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                  </svg>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="input-dark h-9 pl-9 pr-4 text-sm w-full"
                  />
                </div>
              </form>
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 glass rounded-xl border border-border shadow-xl z-50 overflow-hidden">
                  {searchResults.map((p) => (
                    <Link key={p.id} to={`/products/${p.id}`} className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors">
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-gold font-mono">{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  ))}
                  <button onClick={handleSearch} className="w-full p-2.5 text-xs text-center text-gold hover:bg-secondary border-t border-border">
                    View all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </div>

            {/* ── Right icons ──────────────────────────────────────── */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Theme toggle — desktop only (sm+). On mobile it lives in the hamburger menu */}
              <button
                onClick={toggleTheme}
                className="hidden sm:flex p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* Wishlist — sm+ */}
              <Link to="/dashboard?tab=wishlist" className="relative hidden sm:flex p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center font-mono">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart — always visible */}
              <div className="relative" onMouseEnter={() => setCartPreview(true)} onMouseLeave={() => setCartPreview(false)}>
                <Link to="/cart" className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6" strokeWidth={1.5}/>
                    <path strokeLinecap="round" d="M16 10a4 4 0 0 1-8 0" strokeWidth={1.5}/>
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-[#0B0B0B] text-[10px] rounded-full flex items-center justify-center font-mono font-bold">
                      {itemCount}
                    </span>
                  )}
                </Link>
                {cartPreview && items.length > 0 && (
                  <div className="absolute top-full right-0 mt-1 w-72 glass rounded-xl border border-border shadow-2xl z-50 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">{itemCount} item{itemCount !== 1 ? "s" : ""} in cart</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {items.slice(0, 3).map((item) => (
                        <div key={item.cartId} className="flex gap-2 items-center">
                          <img src={item.images[0]} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{item.name}</p>
                            <p className="text-xs text-gold font-mono">{formatPrice(item.price)} × {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border mt-2 pt-2">
                      <Link to="/cart" className="block w-full text-center py-2 bg-gold text-[#0B0B0B] rounded-lg text-xs font-semibold">
                        View Cart & Checkout
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar — always visible */}
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                    <span className="text-xs font-display font-bold text-gold">
                      {user ? user.name[0].toUpperCase() : "?"}
                    </span>
                  </div>
                </button>
                {userMenu && (
                  <div className="absolute top-full right-0 mt-1 w-48 glass rounded-xl border border-border shadow-xl z-50 overflow-hidden">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          Dashboard
                        </Link>
                        <Link to="/dashboard?tab=orders" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                          Orders
                        </Link>
                        <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors border-t border-border">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition-colors">Sign In</Link>
                        <Link to="/register" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gold hover:bg-secondary transition-colors border-t border-border">Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* ── Hamburger — mobile only (< lg) ───────────────────
                  This is a TWO-PART button row on mobile:
                  [theme-icon]  [hamburger]
                  Both always visible below lg breakpoint.           */}
              <div className="flex items-center lg:hidden">
                {/* Theme toggle — right beside the hamburger, always tappable */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark
                    ? (
                      /* Sun — tap to go light */
                      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1"  x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1"  y1="12" x2="3"  y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                      </svg>
                    ) : (
                      /* Moon — tap to go dark */
                      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      </svg>
                    )
                  }
                </button>

                {/* Hamburger */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  aria-label="Open menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileOpen
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                    }
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── Mobile drawer ──────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="section-container py-4 space-y-4">

              {/* Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                  </svg>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="input-dark h-10 pl-9 text-sm w-full"
                  />
                </div>
              </form>

              {/* Nav links */}
              <nav className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link key={link.path} to={link.path}
                    className={cn(
                      "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === link.path
                        ? "text-gold bg-gold/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}>
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Category grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <Link key={cat.id} to={`/products?category=${cat.id}`}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-secondary transition-colors text-center">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-[11px] text-muted-foreground">{cat.name.split(" ")[0]}</span>
                  </Link>
                ))}
              </div>

              {/* Theme row — also inside drawer as a labelled row for clarity */}
              <div className="pt-2 border-t border-border">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border hover:border-gold/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {isDark
                      ? <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                      : <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    }
                    <span className="text-sm font-semibold text-foreground">
                      {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-gold/10 text-gold border border-gold/20">
                    {isDark ? "☀️ Light" : "🌙 Dark"}
                  </span>
                </button>
              </div>

            </div>
          </div>
        )}
      </header>
    </>
  );
}
