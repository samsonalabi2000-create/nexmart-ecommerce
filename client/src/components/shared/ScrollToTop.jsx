import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollTop > 400);
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full transition-all duration-500 flex items-center justify-center group",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      style={{
        background: "linear-gradient(135deg, #0B0B0B, #1a1a2e)",
        border: "1px solid rgba(212,175,55,0.4)",
        boxShadow: "0 0 20px rgba(212,175,55,0.15)",
      }}
    >
      {/* Circular progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="2" />
        <circle
          cx="24" cy="24" r="21" fill="none"
          stroke="#D4AF37" strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 21}`}
          strokeDashoffset={`${2 * Math.PI * 21 * (1 - progress / 100)}`}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      {/* Arrow */}
      <svg className="w-4 h-4 text-gold relative z-10 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}