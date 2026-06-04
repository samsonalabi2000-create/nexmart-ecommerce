import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useUIStore } from "@/store/useUIStore";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, noFooter = false }) {
  const { theme } = useUIStore();

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: { background: "#1a1a1a", color: "#f5f5f5", border: "1px solid #2a2a2a", borderRadius: "12px", fontSize: "13px" },
        }}
      />
    </div>
  );
}
