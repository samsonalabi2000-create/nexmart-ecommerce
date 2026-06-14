import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import ExitIntentPopup from "@/components/shared/ExitIntentPopup";

export default function Layout({ children, noFooter = false }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}

      {/* Global floating features */}
      <ScrollToTop />
      <ExitIntentPopup />

      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a1a",
            color: "#f5f5f5",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            fontSize: "13px",
            fontFamily: '"Space Grotesk", sans-serif',
          },
        }}
      />
    </div>
  );
}