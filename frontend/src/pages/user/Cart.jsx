import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar";

const weightOptions = [
    { value: 0.5, label: "Half kg" },
    { value: 1, label: "1 kg" },
    { value: 1.5, label: "1.5 kg" },
    { value: 2, label: "2 kg" },
    { value: 5, label: "5 kg" },
];

const subscriptionPlans = {
    onetime: { name: "One-Time", discount: 0, days: 1 },
    "1month": { name: "1 Month", discount: 5, days: 30 },
    "3month": { name: "3 Months", discount: 10, days: 90 },
    "6month": { name: "6 Months", discount: 15, days: 180 },
};

function Cart() {
    const navigate = useNavigate();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        updateWeight,
        updatePurchaseType,
        clearCart,
        getCartTotal,
    } = useCart();
    const [loading, setLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const isLoggedIn = () => !!localStorage.getItem("access");

    const calculateItemPrice = (item) => {
        const plan = subscriptionPlans[item.purchaseType] || subscriptionPlans.onetime;
        const basePrice = item.product.price * item.quantity * item.weight * plan.days;
        const discount = (basePrice * plan.discount) / 100;
        return basePrice - discount;
    };

    const handleCheckout = () => {
        if (!isLoggedIn()) {
            setShowAuthModal(true);
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const orderData = {
                items: cartItems.map(item => ({
                    name: item.product.name,
                    image: item.product.image,
                    quantity: item.quantity,
                    weight: item.weight,
                    purchaseType: item.purchaseType,
                    price: calculateItemPrice(item)
                })),
                total: getCartTotal(),
                orderNumber: Math.random().toString(36).substring(2, 10).toUpperCase(),
                orderDate: new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            };
            clearCart();
            setLoading(false);
            navigate("/thank-you", { state: { orderData } });
        }, 1500);
    };

    if (cartItems.length === 0) {
        return (
            <div className="user-theme animate-fade-in">
                <Navbar />
                <div className="container" style={{ padding: "120px 20px 80px", textAlign: "center" }}>
                    <div className="glass-card" style={{ padding: "60px 40px", maxWidth: "500px", margin: "0 auto" }}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1" style={{ margin: "0 auto 24px" }}>
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <h2 style={{ marginBottom: "12px" }}>Your Cart is Empty</h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                            Add some products to your cart and they will appear here
                        </p>
                        <button className="btn-primary" onClick={() => navigate("/")}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-theme animate-fade-in">
            <Navbar />

            <div className="container" style={{ padding: "100px 20px 40px", maxWidth: "1000px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "32px" }}>Shopping Cart</h1>
                    <button
                        className="btn-outline"
                        style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                        onClick={() => {
                            if (window.confirm("Clear all items from cart?")) clearCart();
                        }}
                    >
                        Clear Cart
                    </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "32px", alignItems: "flex-start" }}>
                    {/* Cart Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {cartItems.map((item, index) => {
                            const plan = subscriptionPlans[item.purchaseType] || subscriptionPlans.onetime;
                            const itemPrice = calculateItemPrice(item);

                            return (
                                <div key={index} className="glass-card" style={{ padding: "20px" }}>
                                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                                        {/* Product Image */}
                                        {item.product.image ? (
                                            <div style={{ width: "100px", height: "100px", borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{
                                                width: "100px",
                                                height: "100px",
                                                borderRadius: "12px",
                                                background: "rgba(255,255,255,0.05)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0
                                            }}>
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <path d="m21 15-5-5L5 21" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Product Details */}
                                        <div style={{ flex: 1, minWidth: "200px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                                                <div>
                                                    <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>{item.product.name}</h3>
                                                    <span className="badge" style={{ background: "rgba(0,212,170,0.2)", color: "var(--primary)", fontSize: "11px" }}>
                                                        {item.product.category_name || "Uncategorized"}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(index)}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "var(--danger)",
                                                        cursor: "pointer",
                                                        padding: "4px"
                                                    }}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M3 6h18" />
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
                                                {/* Quantity */}
                                                <div>
                                                    <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Qty</label>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <button
                                                            className="btn-outline"
                                                            style={{ width: "32px", height: "32px", padding: 0, fontSize: "16px" }}
                                                            onClick={() => updateQuantity(index, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span style={{ minWidth: "24px", textAlign: "center" }}>{item.quantity}</span>
                                                        <button
                                                            className="btn-outline"
                                                            style={{ width: "32px", height: "32px", padding: 0, fontSize: "16px" }}
                                                            onClick={() => updateQuantity(index, item.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Weight */}
                                                <div>
                                                    <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Weight</label>
                                                    <select
                                                        value={item.weight}
                                                        onChange={(e) => updateWeight(index, parseFloat(e.target.value))}
                                                        style={{
                                                            padding: "6px 12px",
                                                            borderRadius: "8px",
                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                            background: "var(--bg-glass)",
                                                            color: "var(--text-primary)",
                                                            fontSize: "14px"
                                                        }}
                                                    >
                                                        {weightOptions.map((opt) => (
                                                            <option key={opt.value} value={opt.value} style={{ background: "#1e293b" }}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Plan */}
                                                <div>
                                                    <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Plan</label>
                                                    <select
                                                        value={item.purchaseType}
                                                        onChange={(e) => updatePurchaseType(index, e.target.value)}
                                                        style={{
                                                            padding: "6px 12px",
                                                            borderRadius: "8px",
                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                            background: "var(--bg-glass)",
                                                            color: "var(--text-primary)",
                                                            fontSize: "14px"
                                                        }}
                                                    >
                                                        {Object.entries(subscriptionPlans).map(([key, p]) => (
                                                            <option key={key} value={key} style={{ background: "#1e293b" }}>
                                                                {p.name} {p.discount > 0 ? `(${p.discount}% off)` : ""}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                                    ₹{item.product.price}/kg × {item.quantity} × {item.weight}kg × {plan.days} days
                                                    {plan.discount > 0 && <span style={{ color: "var(--success)" }}> (-{plan.discount}%)</span>}
                                                </span>
                                                <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary)" }}>
                                                    ₹{itemPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="glass-card" style={{ padding: "24px", position: "sticky", top: "100px" }}>
                        <h3 style={{ fontSize: "20px", marginBottom: "20px" }}>Order Summary</h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                            {cartItems.map((item, index) => (
                                <div key={index} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>
                                        {item.product.name} ({subscriptionPlans[item.purchaseType]?.name})
                                    </span>
                                    <span>₹{calculateItemPrice(item).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px", marginBottom: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                                <span>₹{getCartTotal().toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "var(--text-secondary)" }}>Delivery</span>
                                <span style={{ color: "var(--success)" }}>Free</span>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingTop: "16px",
                            borderTop: "1px solid rgba(255,255,255,0.1)",
                            fontWeight: "700",
                            fontSize: "18px"
                        }}>
                            <span>Total</span>
                            <span style={{ color: "var(--primary)" }}>₹{getCartTotal().toFixed(2)}</span>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: "100%", marginTop: "24px", padding: "16px" }}
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Proceed to Checkout"}
                        </button>

                        <button
                            className="btn-outline"
                            style={{ width: "100%", marginTop: "12px" }}
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    padding: "20px"
                }}>
                    <div className="glass-card" style={{
                        padding: "40px",
                        maxWidth: "400px",
                        width: "100%",
                        textAlign: "center"
                    }}>
                        <div style={{ marginBottom: "24px" }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" style={{ margin: "0 auto" }}>
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                                <path d="M6 21v-2c0-2.21 1.79-4 4-4h4c2.21 0 4 1.79 4 4v2" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Sign In Required</h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "32px", lineHeight: "1.6" }}>
                            Please sign in or create an account to complete your purchase
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <button
                                className="btn-primary"
                                style={{ width: "100%", padding: "14px" }}
                                onClick={() => navigate("/login", { state: { from: "/cart" } })}
                            >
                                Sign In
                            </button>
                            <button
                                className="btn-outline"
                                style={{ width: "100%", padding: "14px" }}
                                onClick={() => navigate("/register", { state: { from: "/cart" } })}
                            >
                                Create Account
                            </button>
                            <button
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--text-secondary)",
                                    padding: "12px",
                                    cursor: "pointer",
                                    marginTop: "8px"
                                }}
                                onClick={() => setShowAuthModal(false)}
                            >
                                Continue Browsing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
