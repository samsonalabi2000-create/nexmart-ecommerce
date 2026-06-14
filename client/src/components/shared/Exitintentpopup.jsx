import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [claimed, setClaimed] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("nx_exit_shown")) return;

    const onMouseLeave = (e) => {
      if (e.clientY <= 10 && !fired.current) {
        fired.current = true;
        setTimeout(() => setVisible(true), 400);
        sessionStorage.setItem("nx_exit_shown", "1");
      }
    };

    // Also show after 45s on mobile (no mouse leave)
    const timer = setTimeout(() => {
      if (!fired.current && !sessionStorage.getItem("nx_exit_shown")) {
        fired.current = true;
        setVisible(true);
        sessionStorage.setItem("nx_exit_shown", "1");
      }
    }, 45000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const handleClaim = (e) => {
    e.preventDefault();
    if (email) setClaimed(true);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
         style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>

      <div className={cn(
        "relative w-full max-w-md rounded-3xl overflow-hidden",
        "animate-slide-in-bottom"
      )}
        style={{
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a0a 100%)",
          border: "1px solid rgba(212,175,55,0.25)",
          boxShadow: "0 0 60px rgba(212,175,55,0.15), 0 25px 80px rgba(0,0,0,0.6)",
        }}>

        {/* Top gold line */}
        <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />

        {/* Close */}
        <button onClick={() => setVisible(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {!claimed ? (
            <>
              {/* Badge */}
              <div className="flex justify-center mb-5">
                <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest"
                  style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}>
                  ⚡ Wait! Before You Go
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-display text-3xl font-black text-white text-center mb-2 leading-tight">
                Get <span className="nx-shine-text" style={{
                  background: "linear-gradient(110deg,#8B6914,#D4AF37,#F7E98E,#fff,#F7E98E,#D4AF37,#8B6914)",
                  backgroundSize: "250% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>15% OFF</span> Your First Order
              </h2>
              <p className="text-white/50 text-sm text-center mb-6 font-body">
                Join 200,000+ Nigerians saving big on NexMart. Exclusive deals, flash sales & free delivery.
              </p>

              {/* Code box */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-6"
                style={{ background: "rgba(212,175,55,0.08)", border: "1px dashed rgba(212,175,55,0.4)" }}>
                <span className="font-mono text-lg font-bold tracking-widest text-gold">NEXMART15</span>
                <button
                  onClick={() => navigator.clipboard?.writeText("NEXMART15")}
                  className="text-xs font-mono text-gold/60 hover:text-gold transition-colors">
                  Copy
                </button>
              </div>

              <form onSubmit={handleClaim} className="flex gap-2">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="input-dark flex-1 h-11 text-sm"
                />
                <button type="submit"
                  className="btn-gold h-11 px-5 rounded-xl font-display font-bold text-sm whitespace-nowrap">
                  Claim Deal
                </button>
              </form>

              <p className="text-white/25 text-[11px] text-center mt-3 font-mono">
                No spam. Unsubscribe anytime.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}>
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" strokeWidth={2} strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-black text-white mb-2">You're In! 🎉</h3>
              <p className="text-white/50 text-sm mb-6">Your 15% code has been sent. Use <span className="text-gold font-mono">NEXMART15</span> at checkout.</p>
              <Link to="/products" onClick={() => setVisible(false)}
                className="btn-gold inline-flex items-center gap-2 h-11 px-8 rounded-xl font-display font-bold text-sm">
                Shop Now →
              </Link>
            </div>
          )}
        </div>

        {/* Bottom glow */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }} />
      </div>
    </div>
  );
}