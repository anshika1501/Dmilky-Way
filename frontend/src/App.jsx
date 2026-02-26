import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

// Admin Layout
import DashboardLayout from "./layout/DashboardLayout";

// Admin Pages
import Customer from "./pages/admin/Customer";
import Category from "./pages/admin/Category";
import Product from "./pages/admin/Product";
import Subscription from "./pages/admin/Subscription";
import Staff from "./pages/admin/Staff";

// User Pages
import UserHome from "./pages/user/UserHome";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import MySubscription from "./pages/user/MySubscription";
import Checkout from "./pages/user/Checkout";
import Cart from "./pages/user/Cart";
import ThankYou from "./pages/user/ThankYou";


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* ── User Routes (root) ── */}
          <Route path="/" element={<UserHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-subscription" element={<MySubscription />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/thank-you" element={<ThankYou />} />

          {/* ── Admin Routes (nested under /admin) ── */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Customer />} />
            <Route path="customer" element={<Customer />} />
            <Route path="category" element={<Category />} />
            <Route path="product" element={<Product />} />
            <Route path="subscriptions" element={<Subscription />} />
            <Route path="staff" element={<Staff />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;