import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { userAPI } from "../../api/axios";
import Navbar from "../../components/Navbar";

// Subscription plan options for non-logged in users
const subscriptionPlans = [
    {
        id: 1,
        name: "Basic Plan",
        duration: "1 Month",
        price: 999,
        features: ["Daily delivery", "Any 1 product", "Free delivery", "Pause anytime"],
        popular: false
    },
    {
        id: 2,
        name: "Standard Plan",
        duration: "3 Months",
        price: 2499,
        originalPrice: 2997,
        features: ["Daily delivery", "Any 2 products", "Free delivery", "Pause anytime", "Priority support"],
        popular: true
    },
    {
        id: 3,
        name: "Premium Plan",
        duration: "6 Months",
        price: 4499,
        originalPrice: 5994,
        features: ["Daily delivery", "Unlimited products", "Free delivery", "Pause anytime", "Priority support", "Exclusive discounts"],
        popular: false
    }
];

function MySubscription() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            setIsLoggedIn(true);
            fetchSubscriptions();
            fetchProducts();
        } else {
            setIsLoggedIn(false);
            setLoading(false);
        }
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await userAPI.getProducts();
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await api.get("/subscriptions/");
            if (Array.isArray(response.data)) {
                setSubscriptions(response.data);
            } else {
                setSubscriptions([]);
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching subscriptions:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("access");
                setIsLoggedIn(false);
            } else {
                setError("Failed to load subscriptions");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (sub) => {
        setEditingId(sub.id);
        setEditForm({
            product: sub.product,
            quantity: sub.quantity,
            subscription_type: sub.subscription_type,
            is_active: sub.is_active,
            is_paused: sub.is_paused
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSaveEdit = async (id) => {
        try {
            await api.put(`/subscriptions/${id}/`, editForm);
            setEditingId(null);
            fetchSubscriptions();
        } catch (err) {
            console.error("Error updating subscription:", err);
            alert("Failed to update subscription");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this subscription?")) return;
        try {
            await api.delete(`/subscriptions/${id}/`);
            fetchSubscriptions();
        } catch (err) {
            console.error("Error deleting subscription:", err);
            alert("Failed to cancel subscription");
        }
    };

    // Non-logged in view - Show subscription plans
    if (!isLoggedIn) {
        return (
            <div className="user-theme animate-fade-in">
                <Navbar />

                <div className="container" style={{ paddingBottom: "80px" }}>
                    <header className="page-header" style={{ textAlign: "center", marginBottom: "48px" }}>
                        <h2 style={{ fontSize: "36px", marginBottom: "16px" }}>Subscription Plans</h2>
                        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
                            Choose a plan that suits your needs. Get fresh dairy products delivered to your doorstep every day.
                        </p>
                    </header>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", maxWidth: "1000px", margin: "0 auto" }}>
                        {subscriptionPlans.map((plan, index) => (
                            <div
                                key={plan.id}
                                className="glass-card animate-fade-up"
                                style={{
                                    padding: "32px",
                                    animationDelay: `${0.1 * index}s`,
                                    position: "relative",
                                    border: plan.popular ? "2px solid var(--primary)" : "1px solid rgba(255,255,255,0.1)"
                                }}
                            >
                                {plan.popular && (
                                    <span style={{
                                        position: "absolute",
                                        top: "-12px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "var(--primary)",
                                        color: "#000",
                                        padding: "4px 16px",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        fontWeight: "600"
                                    }}>
                                        Most Popular
                                    </span>
                                )}

                                <h3 style={{ fontSize: "24px", marginBottom: "8px" }}>{plan.name}</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "16px" }}>{plan.duration}</p>

                                <div style={{ marginBottom: "24px" }}>
                                    <span style={{ fontSize: "40px", fontWeight: "700", color: "var(--primary)" }}>₹{plan.price}</span>
                                    {plan.originalPrice && (
                                        <span style={{ fontSize: "18px", color: "var(--text-secondary)", textDecoration: "line-through", marginLeft: "8px" }}>
                                            ₹{plan.originalPrice}
                                        </span>
                                    )}
                                </div>

                                <ul style={{ listStyle: "none", marginBottom: "24px" }}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--text-secondary)" }}>
                                            <span style={{ color: "var(--success)" }}>✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={plan.popular ? "btn-primary" : "btn-outline"}
                                    style={{ width: "100%" }}
                                    onClick={() => navigate("/login")}
                                >
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card" style={{ padding: "32px", marginTop: "48px", textAlign: "center", maxWidth: "800px", margin: "48px auto 0" }}>
                        <h3 style={{ marginBottom: "16px" }}>Already have an account?</h3>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                            Login to view and manage your active subscriptions.
                        </p>
                        <button className="btn-primary" onClick={() => navigate("/login")}>
                            Login Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Logged in view - Show user's subscriptions with edit options
    return (
        <div className="user-theme animate-fade-in">
            <Navbar />

            <div className="container">
                <header className="page-header">
                    <h2 style={{ fontSize: "36px" }}>My Subscriptions</h2>
                    <p style={{ color: "var(--text-secondary)" }}>Manage your active and past milk delivery plans</p>
                </header>

                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card sub-card">
                                <div className="skeleton" style={{ height: "60px", width: "300px" }}></div>
                                <div className="skeleton" style={{ height: "40px", width: "120px" }}></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="glass-card" style={{ padding: "40px", textAlign: "center", color: "var(--danger)" }}>
                        <p>{error}</p>
                        <button className="btn-outline" style={{ marginTop: "20px" }} onClick={fetchSubscriptions}>Retry</button>
                    </div>
                ) : subscriptions.length === 0 ? (
                    <div className="glass-card" style={{ padding: "80px 40px", textAlign: "center" }}>
                        <div style={{ fontSize: "64px", marginBottom: "24px" }}>📦</div>
                        <h3>No Subscriptions Found</h3>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
                            You haven't subscribed to any products yet. Browse our shop to start!
                        </p>
                        <button className="btn-primary" onClick={() => navigate("/")}>
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "80px" }}>
                        {subscriptions.map((sub, index) => (
                            <div
                                key={sub.id}
                                className="glass-card animate-fade-up"
                                style={{ padding: "24px", animationDelay: `${0.1 * index}s` }}
                            >
                                {editingId === sub.id ? (
                                    // Edit Mode
                                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                        <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Edit Subscription</h3>

                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                                            <div>
                                                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>Product</label>
                                                <select
                                                    value={editForm.product}
                                                    onChange={(e) => setEditForm({ ...editForm, product: parseInt(e.target.value) })}
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 16px",
                                                        fontSize: "16px",
                                                        borderRadius: "8px",
                                                        border: "1px solid rgba(255,255,255,0.2)",
                                                        background: "var(--bg-glass)",
                                                        color: "var(--text-primary)"
                                                    }}
                                                >
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id} style={{ background: "#1e293b" }}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={editForm.quantity}
                                                    onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) })}
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 16px",
                                                        fontSize: "16px",
                                                        borderRadius: "8px",
                                                        border: "1px solid rgba(255,255,255,0.2)",
                                                        background: "var(--bg-glass)",
                                                        color: "var(--text-primary)"
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>Delivery Type</label>
                                                <select
                                                    value={editForm.subscription_type}
                                                    onChange={(e) => setEditForm({ ...editForm, subscription_type: e.target.value })}
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 16px",
                                                        fontSize: "16px",
                                                        borderRadius: "8px",
                                                        border: "1px solid rgba(255,255,255,0.2)",
                                                        background: "var(--bg-glass)",
                                                        color: "var(--text-primary)"
                                                    }}
                                                >
                                                    <option value="daily" style={{ background: "#1e293b" }}>Daily</option>
                                                    <option value="alternate" style={{ background: "#1e293b" }}>Alternate Day</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>Status</label>
                                                <select
                                                    value={editForm.is_paused ? "paused" : (editForm.is_active ? "active" : "inactive")}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setEditForm({
                                                            ...editForm,
                                                            is_active: val === "active",
                                                            is_paused: val === "paused"
                                                        });
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 16px",
                                                        fontSize: "16px",
                                                        borderRadius: "8px",
                                                        border: "1px solid rgba(255,255,255,0.2)",
                                                        background: "var(--bg-glass)",
                                                        color: "var(--text-primary)"
                                                    }}
                                                >
                                                    <option value="active" style={{ background: "#1e293b" }}>Active</option>
                                                    <option value="paused" style={{ background: "#1e293b" }}>Paused</option>
                                                    <option value="inactive" style={{ background: "#1e293b" }}>Inactive</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                                            <button className="btn-primary" style={{ padding: "10px 24px" }} onClick={() => handleSaveEdit(sub.id)}>
                                                Save Changes
                                            </button>
                                            <button className="btn-outline" style={{ padding: "10px 24px" }} onClick={handleCancelEdit}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                                        <div className="sub-info">
                                            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>{sub.product_name}</h3>
                                            <div style={{ display: "flex", gap: "16px", fontSize: "14px", color: "var(--text-secondary)", flexWrap: "wrap" }}>
                                                <span><strong>Plan:</strong> {sub.subscription_type}</span>
                                                <span><strong>Qty:</strong> {sub.quantity} units</span>
                                                <span><strong>Price:</strong> ₹{products.find(p => p.id === sub.product)?.price || "N/A"}/unit</span>
                                            </div>
                                            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                                                <strong>Active from:</strong> {sub.start_date} {sub.end_date && `to ${sub.end_date}`}
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <span className={`badge ${sub.is_paused ? "badge-warning" : (sub.is_active ? "badge-success" : "badge-danger")}`}>
                                                {sub.is_paused ? "Paused" : (sub.is_active ? "Active" : "Inactive")}
                                            </span>
                                            <button
                                                className="btn-outline"
                                                style={{ padding: "8px 16px", fontSize: "14px" }}
                                                onClick={() => handleEdit(sub)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-outline"
                                                style={{ padding: "8px 16px", fontSize: "14px", borderColor: "var(--danger)", color: "var(--danger)" }}
                                                onClick={() => handleDelete(sub.id)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MySubscription;
