import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css"
import Layout from "./components/layout";
import LoadingSpinner from "./components/ui/loading-spinner";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/home"));
const ProductsPage = lazy(() => import("./pages/products"));
const ProductDetailPage = lazy(() => import("./pages/product-detail"));
const CartPage = lazy(() => import("./pages/cart"));
const CheckoutPage = lazy(() => import("./pages/checkout"));
const CheckoutSuccessPage = lazy(() => import("./pages/checkout-success"));
const AccountPage = lazy(() => import("./pages/account"));
const LoginPage = lazy(() => import("./pages/login"));
const RegisterPage = lazy(() => import("./pages/register"));
const ForgotPasswordPage = lazy(() => import("./pages/forgot-password"));
const ResetPasswordPage = lazy(() => import("./pages/reset-password"));
const NotFoundPage = lazy(() => import("./pages/not-found"));

// Admin pages
const AdminLayout = lazy(() => import("./components/admin-layout"));
const AdminDashboardPage = lazy(() => import("./pages/admin/dashboard"));
const AdminProductsPage = lazy(() => import("./pages/admin/produucts"));
const AdminNewProductPage = lazy(() => import("./pages/admin/new-product"));
const AdminOrdersPage = lazy(() => import("./pages/admin/orders"));
const AdminCustomersPage = lazy(() => import("./pages/admin/customers"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="account/*" element={<AccountPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminNewProductPage />} />
          <Route path="products/:id" element={<AdminNewProductPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
