import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const weightOptions = [
    { value: 0.5, label: "Half kg (500g)" },
    { value: 1, label: "1 kg" },
    { value: 1.5, label: "1.5 kg" },
    { value: 2, label: "2 kg" },
    { value: 5, label: "5 kg" },
];

const subscriptionPlans = [
    { id: "onetime", name: "One-Time Purchase", duration: "", discount: 0, days: 1 },
    { id: "1month", name: "1 Month Subscription", duration: "30 days", discount: 5, days: 30 },
    { id: "3month", name: "3 Months Subscription", duration: "90 days", discount: 10, days: 90 },
    { id: "6month", name: "6 Months Subscription", duration: "180 days", discount: 15, days: 180 },
];

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [weight, setWeight] = useState(1);
    const [purchaseType, setPurchaseType] = useState("onetime");
    const [loading, setLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const isLoggedIn = () => !!localStorage.getItem("access");

    useEffect(() => {
        if (location.state?.product) {
            setProduct(location.state.product);
        } else {
            // No product data, redirect back to home
            navigate("/");
        }
    }, [location, navigate]);

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= (product?.stock || 1)) {
            setQuantity(newQty);
        }
    };

    const handleCheckout = async () => {
        // Check if user is logged in
        if (!isLoggedIn()) {
            setShowAuthModal(true);
            return;
        }

        setLoading(true);
        // Simulate checkout process
        setTimeout(() => {
            const orderData = {
                items: [{
                    name: product.name,
                    image: product.image,
                    quantity,
                    weight,
                    purchaseType,
                    price: parseFloat(totalPrice)
                }],
                total: parseFloat(totalPrice),
                orderNumber: Math.random().toString(36).substring(2, 10).toUpperCase(),
                orderDate: new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            };
            setLoading(false);
            navigate("/thank-you", { state: { orderData } });
        }, 1500);
    };

    if (!product) {
        return (
            <div className="user-theme animate-fade-in">
                <Navbar />
                <div className="container" style={{ padding: "120px 20px 80px", textAlign: "center" }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    const selectedPlan = subscriptionPlans.find(p => p.id === purchaseType);
    const basePrice = product.price * quantity * weight * selectedPlan.days;
    const discountAmount = (basePrice * selectedPlan.discount / 100);
    const totalPrice = (basePrice - discountAmount).toFixed(2);

    return (
        <div className="user-theme animate-fade-in">
            <Navbar />

            <div className="container" style={{ padding: "100px 20px 40px", maxWidth: "800px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "32px", marginBottom: "32px" }}>Checkout</h1>

                <div className="glass-card" style={{ padding: "32px" }}>
                    {/* Product Details */}
                    <div style={{ display: "flex", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
                        {product.image ? (
                            <div style={{ width: "150px", height: "150px", flexShrink: 0, borderRadius: "12px", overflow: "hidden" }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                        ) : (
                            <div className="product-image-blank" style={{ width: "150px", height: "150px", flexShrink: 0 }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M7 3h10a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                                    <path d="M5 7h14" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
                        )}
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <span className="badge" style={{ background: 'rgba(0,212,170,0.2)', color: 'var(--primary)', marginBottom: '8px', display: 'inline-block' }}>
                                {product.category_name || 'Uncategorized'}
                            </span>
                            <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>{product.name}</h2>
                            <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
                                {product.description || "Fresh dairy product from local farms"}
                            </p>
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                <span className={product.stock > 0 ? "badge badge-success" : "badge badge-danger"}>
                                    {product.stock > 0 ? `${product.stock} in Stock` : "Out of Stock"}
                                </span>
                                <span className="badge badge-success">Available</span>
                            </div>
                        </div>
                    </div>

                    {/* Price & Quantity */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Unit Price</span>
                            <span style={{ fontSize: "20px", fontWeight: "600" }}>₹ {product.price} / kg</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Weight</span>
                            <select
                                value={weight}
                                onChange={(e) => setWeight(parseFloat(e.target.value))}
                                style={{
                                    padding: "10px 16px",
                                    fontSize: "16px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    background: "var(--bg-glass)",
                                    color: "var(--text-primary)",
                                    cursor: "pointer",
                                    minWidth: "150px"
                                }}
                            >
                                {weightOptions.map((option) => (
                                    <option key={option.value} value={option.value} style={{ background: "#1e293b" }}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Purchase Type Selection */}
                        <div style={{ marginBottom: "16px" }}>
                            <span style={{ color: "var(--text-secondary)", display: "block", marginBottom: "12px" }}>Purchase Type</span>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                                {subscriptionPlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setPurchaseType(plan.id)}
                                        style={{
                                            padding: "16px",
                                            borderRadius: "12px",
                                            border: purchaseType === plan.id
                                                ? "2px solid var(--primary)"
                                                : "1px solid rgba(255,255,255,0.1)",
                                            background: purchaseType === plan.id
                                                ? "rgba(0,212,170,0.1)"
                                                : "rgba(255,255,255,0.03)",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                                            <span style={{ fontWeight: "600", fontSize: "14px" }}>{plan.name}</span>
                                            {plan.discount > 0 && (
                                                <span className="badge badge-warning" style={{ fontSize: "11px" }}>
                                                    {plan.discount}% OFF
                                                </span>
                                            )}
                                        </div>
                                        {plan.duration && (
                                            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                                Daily delivery for {plan.duration}
                                            </span>
                                        )}
                                        {plan.id === "onetime" && (
                                            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                                Single delivery
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Quantity</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <button
                                    className="btn-outline"
                                    style={{ width: "40px", height: "40px", padding: 0 }}
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span style={{ fontSize: "18px", fontWeight: "600", minWidth: "40px", textAlign: "center" }}>
                                    {quantity}
                                </span>
                                <button
                                    className="btn-outline"
                                    style={{ width: "40px", height: "40px", padding: 0 }}
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stock}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px",
                            paddingTop: "16px",
                            borderTop: "1px solid rgba(255,255,255,0.1)"
                        }}>
                            <span style={{ fontSize: "18px", fontWeight: "600" }}>Total</span>
                            <span style={{ fontSize: "28px", fontWeight: "700", color: "var(--primary)" }}>
                                ₹ {totalPrice}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                            <button
                                className="btn-outline"
                                style={{ flex: 1, minWidth: "120px" }}
                                onClick={() => navigate("/")}
                            >
                                Back to Shop
                            </button>
                            <button
                                className="btn-primary"
                                style={{ flex: 2, minWidth: "200px" }}
                                onClick={handleCheckout}
                                disabled={loading || product.stock <= 0}
                            >
                                {loading ? "Processing..." : "Confirm Purchase"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="glass-card" style={{ padding: "24px", marginTop: "24px" }}>
                    <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Order Summary</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Product</span>
                            <span>{product.name}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Weight</span>
                            <span>{weightOptions.find(w => w.value === weight)?.label}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Quantity (per day)</span>
                            <span>{quantity}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Purchase Type</span>
                            <span>{selectedPlan.name}</span>
                        </div>
                        {selectedPlan.days > 1 && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--text-secondary)" }}>Duration</span>
                                <span>{selectedPlan.days} days</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-secondary)" }}>
                                {selectedPlan.days > 1 ? "Total before discount" : "Subtotal"}
                            </span>
                            <span>₹ {basePrice.toFixed(2)}</span>
                        </div>
                        {selectedPlan.discount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--success)" }}>Subscription Discount ({selectedPlan.discount}%)</span>
                                <span style={{ color: "var(--success)" }}>- ₹ {discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Delivery</span>
                            <span style={{ color: "var(--success)" }}>Free</span>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingTop: "12px",
                            borderTop: "1px solid rgba(255,255,255,0.1)",
                            fontWeight: "600"
                        }}>
                            <span>Grand Total</span>
                            <span style={{ color: "var(--primary)" }}>₹ {totalPrice}</span>
                        </div>
                        {selectedPlan.days > 1 && (
                            <div style={{
                                fontSize: "13px",
                                color: "var(--text-secondary)",
                                textAlign: "right",
                                marginTop: "-4px"
                            }}>
                                ≈ ₹ {(parseFloat(totalPrice) / selectedPlan.days).toFixed(2)} per day
                            </div>
                        )}
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
                                onClick={() => navigate("/login", { state: { from: "/checkout", product } })}
                            >
                                Sign In
                            </button>
                            <button
                                className="btn-outline"
                                style={{ width: "100%", padding: "14px" }}
                                onClick={() => navigate("/register", { state: { from: "/checkout", product } })}
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

export default Checkout;
