import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save where they were going so we redirect back after login
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"               element={<Home />} />
      <Route path="/home"           element={<Home />} />
      <Route path="/products"       element={<Products />} />
      <Route path="/products/:id"   element={<ProductDetails />} />
      <Route path="/cart"           element={<Cart />} />
      <Route path="/login"          element={<Login />} />
      <Route path="/register"       element={<Register />} />

      {/* Protected routes — must be logged in */}
      <Route path="/checkout" element={
        <ProtectedRoute><Checkout /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      {/* Catch-all — redirect unknown URLs to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
