import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/api";
import { formatPrice, cn } from "@/lib/utils";
import toast from "react-hot-toast";

const STEPS = ["Cart", "Shipping", "Payment", "Confirmation"];

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = total > 50000 ? 0 : 3500;
  const tax = Math.round(total * 0.075);
  const orderTotal = total + shipping + tax;

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const order = await orderService.createOrder({
        items,
        total: orderTotal,
        shipping: shippingInfo,
        payment: { method: paymentInfo.method },
      });
      await clearCart();
      setCompletedOrder(order);
      setStep(3);
    } catch {
      toast.error("Order placement failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Step 3 — success screen
  if (step === 3 && completedOrder) {
    return (
      <div className="section-container py-20 text-center min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" strokeWidth={2} strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-3xl font-display font-black mb-3">Order Confirmed! 🎉</h1>
        <p className="text-muted-foreground mb-2">Your order <span className="font-mono text-foreground">{completedOrder.id}</span> has been placed.</p>
        <p className="text-sm text-muted-foreground mb-8">You'll receive a confirmation email at <strong>{shippingInfo.email}</strong></p>
        <div className="flex gap-4">
          <Link to="/dashboard?tab=orders" className="btn-gold h-11 px-8 rounded-xl text-sm font-semibold inline-flex items-center">Track Order</Link>
          <Link to="/products" className="h-11 px-8 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors inline-flex items-center">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-10 min-h-screen">
      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.slice(0, 3).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors",
              i < step ? "bg-gold text-[#0B0B0B]" : i === step ? "border-2 border-gold text-gold" : "border border-border text-muted-foreground"
            )}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={cn("text-xs font-medium hidden sm:block", i <= step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            {i < 2 && <div className={cn("w-12 h-0.5 rounded-full", i < step ? "bg-gold" : "bg-border")} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form area */}
        <div className="lg:col-span-2">
          {/* Step 1 — Shipping */}
          {step === 1 && (
            <div className="glass rounded-2xl p-6 border border-border">
              <h2 className="font-display font-bold text-lg mb-6">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {[["firstName","First Name"],["lastName","Last Name"]].map(([k,l]) => (
                  <div key={k}>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">{l}</label>
                    <input value={shippingInfo[k]} onChange={(e) => setShippingInfo((s) => ({...s,[k]:e.target.value}))}
                      className="input-dark h-10 text-sm w-full" placeholder={l} />
                  </div>
                ))}
                {[["email","Email Address"],["phone","Phone Number"]].map(([k,l]) => (
                  <div key={k}>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">{l}</label>
                    <input value={shippingInfo[k]} onChange={(e) => setShippingInfo((s) => ({...s,[k]:e.target.value}))}
                      className="input-dark h-10 text-sm w-full" placeholder={l} type={k === "email" ? "email" : "tel"} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Street Address</label>
                  <input value={shippingInfo.address} onChange={(e) => setShippingInfo((s) => ({...s,address:e.target.value}))}
                    className="input-dark h-10 text-sm w-full" placeholder="House number, street name, area" />
                </div>
                {[["city","City"],["state","State"],["zip","Postal Code"]].map(([k,l]) => (
                  <div key={k}>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">{l}</label>
                    <input value={shippingInfo[k]} onChange={(e) => setShippingInfo((s) => ({...s,[k]:e.target.value}))}
                      className="input-dark h-10 text-sm w-full" placeholder={l} />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)}
                className="btn-gold w-full h-11 rounded-xl font-semibold text-sm mt-6">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div className="glass rounded-2xl p-6 border border-border">
              <h2 className="font-display font-bold text-lg mb-6">Payment Method</h2>

              {/* Payment method selection */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[["card","💳 Card"],["transfer","🏦 Transfer"],["crypto","₿ Crypto"]].map(([m,l]) => (
                  <button key={m} onClick={() => setPaymentInfo((p) => ({...p,method:m}))}
                    className={cn("p-3 rounded-xl border text-xs font-medium transition-colors",
                      paymentInfo.method === m ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-muted")}>
                    {l}
                  </button>
                ))}
              </div>

              {paymentInfo.method === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">Cardholder Name</label>
                    <input value={paymentInfo.cardName} onChange={(e) => setPaymentInfo((p) => ({...p,cardName:e.target.value}))}
                      className="input-dark h-10 text-sm w-full" placeholder="Name as it appears on card" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">Card Number</label>
                    <input value={paymentInfo.cardNumber} onChange={(e) => setPaymentInfo((p) => ({...p,cardNumber:e.target.value}))}
                      className="input-dark h-10 text-sm w-full font-mono" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">Expiry Date</label>
                      <input value={paymentInfo.expiryDate} onChange={(e) => setPaymentInfo((p) => ({...p,expiryDate:e.target.value}))}
                        className="input-dark h-10 text-sm w-full font-mono" placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">CVV</label>
                      <input value={paymentInfo.cvv} onChange={(e) => setPaymentInfo((p) => ({...p,cvv:e.target.value}))}
                        className="input-dark h-10 text-sm w-full font-mono" placeholder="123" maxLength={4} type="password" />
                    </div>
                  </div>
                </div>
              )}

              {paymentInfo.method === "transfer" && (
                <div className="glass-gold rounded-xl p-5 border border-gold/20">
                  <p className="text-sm font-semibold mb-3">Bank Transfer Details</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span className="font-mono">First Bank Nigeria</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Account Number</span><span className="font-mono">3094561782</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Account Name</span><span className="font-mono">NexMart Ltd</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-mono text-gold">{formatPrice(orderTotal)}</span></div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="h-11 px-5 rounded-xl border border-border text-sm hover:bg-secondary transition-colors">← Back</button>
                <button onClick={handlePlaceOrder} disabled={processing}
                  className="btn-gold flex-1 h-11 rounded-xl font-semibold text-sm">
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </span>
                  ) : `Place Order · ${formatPrice(orderTotal)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div>
          <div className="glass rounded-2xl p-5 border border-border sticky top-24">
            <h3 className="font-display font-bold mb-4">Your Order</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.cartId} className="flex gap-3 items-center">
                  <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                  </div>
                  <span className="text-xs font-mono font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-xs border-t border-border pt-4">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="font-mono">{formatPrice(total)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className={cn("font-mono", shipping === 0 && "text-emerald-400")}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>VAT</span><span className="font-mono">{formatPrice(tax)}</span></div>
              <div className="flex justify-between font-display font-bold text-sm pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-gold-gradient">{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
