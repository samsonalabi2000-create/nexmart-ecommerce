import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, cn } from "@/lib/utils";

export default function Cart() {
  const { items, total, updateQuantity, removeItem, itemCount } = useCartStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const shipping = total > 50000 ? 0 : 3500;
  const tax = Math.round(total * 0.075);
  const orderTotal = total + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="section-container py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center mb-6 mx-auto">
          <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some amazing products to get started</p>
        <Link to="/products" className="btn-gold inline-flex items-center gap-2 h-11 px-8 rounded-xl text-sm font-semibold">
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container py-10 min-h-screen">
      <h1 className="text-2xl font-display font-bold mb-8">
        Shopping Cart <span className="text-muted-foreground font-mono text-base">({itemCount} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.cartId} className="glass rounded-2xl p-4 border border-border flex gap-4 group">
              {/* Image */}
              <Link to={`/products/${item.id}`} className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-surface-elevated img-zoom">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link to={`/products/${item.id}`} className="text-sm font-display font-semibold hover:text-gold transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </Link>
                  <button onClick={() => removeItem(item.cartId)}
                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                <p className="text-xs text-muted-foreground font-mono mb-3">{item.categoryName} · {item.brand}</p>

                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                      className="w-8 h-7 flex items-center justify-center hover:bg-secondary transition-colors text-sm font-bold">−</button>
                    <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      className="w-8 h-7 flex items-center justify-center hover:bg-secondary transition-colors text-sm font-bold">+</button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-display font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    {item.quantity > 1 && (
                      <p className="text-[11px] text-muted-foreground font-mono">{formatPrice(item.price)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue shopping */}
          <div className="pt-2">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="glass rounded-2xl p-6 border border-border sticky top-24">
            <h2 className="font-display font-bold text-lg mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className={cn("font-mono", shipping === 0 && "text-emerald-400")}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT (7.5%)</span>
                <span className="font-mono">{formatPrice(tax)}</span>
              </div>
              {total < 50000 && (
                <p className="text-xs text-gold bg-gold/10 rounded-lg p-2 border border-gold/20">
                  Add {formatPrice(50000 - total)} more for FREE shipping!
                </p>
              )}
              <div className="pt-3 border-t border-border flex justify-between font-display font-bold">
                <span>Total</span>
                <span className="text-lg text-gold-gradient">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-5">
              <input type="text" placeholder="Coupon code" className="input-dark h-9 text-xs flex-1" />
              <button className="h-9 px-3 rounded-lg border border-border text-xs hover:bg-secondary transition-colors font-semibold whitespace-nowrap">Apply</button>
            </div>

            <button onClick={handleCheckout}
              className="btn-gold w-full h-12 rounded-xl font-display font-bold text-sm">
              {isAuthenticated ? "Proceed to Checkout" : "Sign In to Checkout"}
              <span className="ml-2">→</span>
            </button>

            <div className="flex items-center justify-center gap-2 mt-4">
              <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span className="text-xs text-muted-foreground">Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
