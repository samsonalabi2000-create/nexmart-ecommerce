import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";
import Layout from "@/components/layout/Layout";
import AppRoutes from "@/assets/routes/AppRoutes";

export default function App() {
  const { theme } = useUIStore();

  // Apply theme class to <html> on mount and on theme change
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}
