import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  "Quick Links": [
    { label: "Home", path: "/" },
    { label: "All Products", path: "/products" },
    { label: "Flash Sales", path: "/products?sort=sale" },
    { label: "New Arrivals", path: "/products?sort=newest" },
    { label: "Best Sellers", path: "/products?sort=popular" },
  ],
  "Customer Service": [
    { label: "My Account", path: "/dashboard" },
    { label: "Order History", path: "/dashboard?tab=orders" },
    { label: "Wishlist", path: "/dashboard?tab=wishlist" },
    { label: "Track Order", path: "/dashboard?tab=orders" },
    { label: "Returns & Refunds", path: "#" },
  ],
  "Company": [
    { label: "About Us", path: "#" },
    { label: "Contact Us", path: "#" },
    { label: "Careers", path: "#" },
    { label: "Privacy Policy", path: "#" },
    { label: "Terms of Service", path: "#" },
  ],
};

const TRUST_BADGES = [
  { icon: "🔒", label: "Secure Payment", sub: "256-bit SSL encryption" },
  { icon: "🚀", label: "Fast Delivery", sub: "2-5 business days" },
  { icon: "↩️", label: "Easy Returns", sub: "30-day return policy" },
  { icon: "💬", label: "24/7 Support", sub: "Always here to help" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-20">
      {/* Trust badges */}
      <div className="border-b border-border">
        <div className="section-container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-sm font-display font-semibold text-foreground">{b.label}</p>
                  <p className="text-xs text-muted-foreground">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center">
                <span className="font-display font-black text-sm text-[#0B0B0B]">N</span>
              </div>
              <span className="font-display font-bold text-lg">
                Nex<span className="text-gold-gradient">Mart</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Nigeria's premium online marketplace. Shop electronics, fashion, beauty, and more with confidence.
            </p>
            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold mb-2">Subscribe for exclusive deals</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="input-dark h-9 text-sm flex-1" />
                <button className="btn-gold px-4 py-2 text-xs rounded-lg font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-sm mb-4 text-foreground">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NexMart. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Visa", "Mastercard", "PayStack", "Flutterwave"].map((p) => (
              <span key={p} className="text-xs font-mono px-2 py-1 bg-secondary rounded text-muted-foreground">{p}</span>
            ))}
          </div>
          <div className="flex gap-4">
            {[
              { label: "Twitter", path: "#" },
              { label: "Instagram", path: "#" },
              { label: "Facebook", path: "#" },
            ].map((s) => (
              <a key={s.label} href={s.path} className="text-xs text-muted-foreground hover:text-gold transition-colors">{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
