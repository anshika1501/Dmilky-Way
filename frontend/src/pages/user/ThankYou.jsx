import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const subscriptionPlans = {
    onetime: { name: "One-Time", discount: 0, days: 1 },
    "1month": { name: "1 Month", discount: 5, days: 30 },
    "3month": { name: "3 Months", discount: 10, days: 90 },
    "6month": { name: "6 Months", discount: 15, days: 180 },
};

function ThankYou() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderData;

    useEffect(() => {
        if (!orderData) {
            navigate("/");
        }
    }, [orderData, navigate]);

    if (!orderData) {
        return null;
    }

    const { items, total, orderNumber, orderDate } = orderData;

    return (
        <div className="user-theme animate-fade-in">
            <Navbar />

            <div className="container" style={{ padding: "100px 20px 40px", maxWidth: "700px", margin: "0 auto" }}>
                {/* Success Icon */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--success), var(--primary))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        animation: "pulse 2s infinite"
                    }}>
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: "36px", marginBottom: "12px", color: "var(--primary)" }}>
                        Thank You!
                    </h1>
                    <p style={{ fontSize: "18px", color: "var(--text-secondary)" }}>
                        Your order has been placed successfully
                    </p>
                </div>

                {/* Order Info */}
                <div className="glass-card" style={{ padding: "24px", marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                        <div>
                            <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block" }}>Order Number</span>
                            <span style={{ fontSize: "18px", fontWeight: "600" }}>#{orderNumber}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block" }}>Order Date</span>
                            <span style={{ fontSize: "16px" }}>{orderDate}</span>
                        </div>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
                        <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "var(--text-secondary)" }}>Order Details</h3>

                        {items.map((item, index) => {
                            const plan = subscriptionPlans[item.purchaseType] || subscriptionPlans.onetime;

                            return (
                                <div key={index} style={{
                                    display: "flex",
                                    gap: "16px",
                                    padding: "16px 0",
                                    borderBottom: index < items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                                }}>
                                    {item.image ? (
                                        <div style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                            flexShrink: 0
                                        }}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "8px",
                                            background: "rgba(255,255,255,0.05)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0
                                        }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <path d="m21 15-5-5L5 21" />
                                            </svg>
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: "600", marginBottom: "4px" }}>{item.name}</div>
                                        <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                            {item.quantity} × {item.weight}kg • {plan.name}
                                            {plan.days > 1 && ` • ${plan.days} days`}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: "600", color: "var(--primary)" }}>
                                        ₹{item.price.toFixed(0)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid rgba(255,255,255,0.1)"
                    }}>
                        <span style={{ fontSize: "18px", fontWeight: "600" }}>Total Paid</span>
                        <span style={{ fontSize: "28px", fontWeight: "700", color: "var(--primary)" }}>
                            ₹{total.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="glass-card" style={{ padding: "20px", marginBottom: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "rgba(0,212,170,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                                <path d="M5 18h14M5 14h14M5 10h14" />
                                <rect x="1" y="4" width="22" height="16" rx="2" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: "600" }}>Delivery starts tomorrow</div>
                            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                Fresh products will be delivered every morning before 7 AM
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <button
                        className="btn-primary"
                        style={{ flex: 1, minWidth: "200px", padding: "16px" }}
                        onClick={() => navigate("/")}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px", verticalAlign: "middle" }}>
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Back to Home
                    </button>
                    <button
                        className="btn-outline"
                        style={{ flex: 1, minWidth: "200px", padding: "16px" }}
                        onClick={() => navigate("/my-subscription")}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px", verticalAlign: "middle" }}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        View My Subscriptions
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(0, 212, 170, 0); }
                }
            `}</style>
        </div>
    );
}

export default ThankYou;
