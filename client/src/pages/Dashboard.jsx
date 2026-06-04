import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWishlistStore } from "@/store/useWishlistStore";
import { orderService } from "@/services/api";
import { formatPrice, cn } from "@/lib/utils";
import { StarRating } from "@/components/ui/index";
import ProductCard from "@/components/product/ProductCard";
import toast from "react-hot-toast";

const TABS = [
  { id: "overview",  label: "Overview",  icon: "📊" },
  { id: "orders",    label: "Orders",    icon: "📦" },
  { id: "wishlist",  label: "Wishlist",  icon: "❤️" },
  { id: "profile",   label: "Profile",   icon: "👤" },
];

const STATUS_STYLES = {
  processing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  shipped:    "bg-blue-500/20 text-blue-400 border-blue-500/30",
  delivered:  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled:  "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const { user, updateProfile } = useAuth();
  const { items: wishlistItems } = useWishlistStore();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name:  user?.name  || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    orderService.getOrders().then((o) => {
      setOrders(o);
      setOrdersLoading(false);
    });
  }, []);

  const switchTab = (id) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profileForm);
      toast.success("Profile updated!", {
        style: { background: "#1a1a1a", color: "#fff", border: "1px solid #D4AF37" },
      });
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="section-container py-10 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="w-full md:w-56 shrink-0">
          {/* User card */}
          <div className="glass rounded-2xl p-5 border border-border mb-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-display font-black text-gold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <p className="font-display font-bold text-sm">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <div className="mt-3 px-3 py-1.5 bg-gold/10 rounded-lg border border-gold/20">
              <p className="text-xs text-gold font-mono font-semibold">
                ⭐ {(user?.loyaltyPoints || 0).toLocaleString()} points
              </p>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="glass rounded-2xl border border-border overflow-hidden">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => switchTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left border-b border-border last:border-0",
                  activeTab === tab.id
                    ? "bg-gold/10 text-gold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}>
                <span>{tab.icon}</span>
                {tab.label}
                {tab.id === "wishlist" && wishlistItems.length > 0 && (
                  <span className="ml-auto w-5 h-5 bg-gold/20 text-gold rounded-full text-xs flex items-center justify-center font-mono">
                    {wishlistItems.length}
                  </span>
                )}
                {tab.id === "orders" && orders.length > 0 && (
                  <span className="ml-auto w-5 h-5 bg-gold/20 text-gold rounded-full text-xs flex items-center justify-center font-mono">
                    {orders.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main content ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-2xl font-display font-bold mb-6">
                Welcome back, {user?.name?.split(" ")[0]}! 👋
              </h1>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Orders",   value: orders.length,             icon: "📦", color: "text-blue-400" },
                  { label: "Wishlist Items",  value: wishlistItems.length,       icon: "❤️", color: "text-red-400" },
                  { label: "Loyalty Points",  value: (user?.loyaltyPoints || 0).toLocaleString(), icon: "⭐", color: "text-gold" },
                  { label: "Reviews Given",   value: "3",                        icon: "💬", color: "text-emerald-400" },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-5 border border-border">
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <p className={cn("text-2xl font-display font-black", s.color)}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent orders preview */}
              {orders.length > 0 && (
                <div className="glass rounded-2xl p-5 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-bold">Recent Orders</h2>
                    <button onClick={() => switchTab("orders")} className="text-xs text-gold hover:underline">View all →</button>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 2).map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-mono font-semibold">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                          <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full border", STATUS_STYLES[order.status])}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-display font-bold mb-6">Order History</h2>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[1,2].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 glass rounded-2xl border border-border">
                  <p className="text-4xl mb-3">📦</p>
                  <p className="font-display font-bold mb-2">No orders yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Your orders will appear here</p>
                  <Link to="/products" className="btn-gold inline-flex items-center h-10 px-6 rounded-xl text-sm font-semibold">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="glass rounded-2xl p-5 border border-border">
                      {/* Order header */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="font-mono font-bold text-sm">{order.id}</p>
                          <p className="text-xs text-muted-foreground">Placed on {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold">{formatPrice(order.total)}</p>
                          <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full border", STATUS_STYLES[order.status])}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="flex gap-2 flex-wrap mb-4">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <img key={i} src={item.images?.[0]} alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover border border-border" />
                        ))}
                      </div>

                      {/* Tracking */}
                      {order.trackingNumber && (
                        <p className="text-xs text-muted-foreground">
                          Tracking: <span className="font-mono text-foreground">{order.trackingNumber}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <div>
              <h2 className="text-xl font-display font-bold mb-6">
                My Wishlist <span className="text-muted-foreground font-mono text-base">({wishlistItems.length})</span>
              </h2>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-20 glass rounded-2xl border border-border">
                  <p className="text-4xl mb-3">❤️</p>
                  <p className="font-display font-bold mb-2">Your wishlist is empty</p>
                  <p className="text-sm text-muted-foreground mb-4">Save products you love</p>
                  <Link to="/products" className="btn-gold inline-flex items-center h-10 px-6 rounded-xl text-sm font-semibold">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {wishlistItems.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-display font-bold mb-6">Profile Settings</h2>
              <div className="glass rounded-2xl p-6 border border-border max-w-lg">
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {[
                    { label: "Full Name",     key: "name",  type: "text",  placeholder: "Your full name" },
                    { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
                    { label: "Phone Number",  key: "phone", type: "tel",   placeholder: "+234 800 000 0000" },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">{label}</label>
                      <input
                        type={type} value={profileForm[key]}
                        onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="input-dark h-11 w-full text-sm"
                      />
                    </div>
                  ))}

                  <button type="submit" disabled={savingProfile}
                    className="btn-gold w-full h-11 rounded-xl font-display font-bold text-sm">
                    {savingProfile ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </span>
                    ) : "Save Changes"}
                  </button>
                </form>

                {/* Loyalty points card */}
                <div className="mt-6 p-4 glass-gold rounded-xl border border-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-display font-bold">Loyalty Points</p>
                      <p className="text-xs text-muted-foreground">Earn points on every purchase</p>
                    </div>
                    <p className="text-2xl font-display font-black text-gold-gradient">
                      {(user?.loyaltyPoints || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-3 bg-background/50 rounded-full h-1.5">
                    <div className="bg-gold-gradient h-1.5 rounded-full" style={{ width: `${Math.min((user?.loyaltyPoints || 0) / 100, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {Math.max(0, 5000 - (user?.loyaltyPoints || 0)).toLocaleString()} points to Gold status
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
