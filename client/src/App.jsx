import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";
import Layout from "@/components/layout/Layout";
import AppRoutes from "@/assets/routes/AppRoutes";

export default function App() {
  const { theme } = useUIStore();

  // Apply theme class on first mount only.
  // All subsequent changes are handled directly in useUIStore.toggleTheme()
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, []); // empty deps — runs once on mount

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}
