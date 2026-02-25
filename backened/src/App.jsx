import { BrowserRouter, Routes, Route } from "react-router-dom";
import Customer from "./pages/Customer";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Subscription from "./pages/Subscription";
import Staff from "./pages/Staff";
import UserHome from "./user/UserHome";
import Login from "./user/Login";
import MySubscription from "./user/MySubscription";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Customer />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/ca tegory" element={<Category />} />
        <Route path="/product" element={<Product />} />
        <Route path="/subscriptions" element={<Subscription />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/" element={<UserHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/subscription" element={<MySubscription />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;