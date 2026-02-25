import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";

function MySubscription() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchSubscriptions();
    }, [navigate]);

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
                navigate("/login");
            } else {
                setError("Failed to load subscriptions");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-theme animate-fade-in">
            <Navbar />

            <div className="container">
                <header className="page-header">
                    <h2 style={{ fontSize: '36px' }}>My Subscriptions</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your active and past milk delivery plans</p>
                </header>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card sub-card">
                                <div className="skeleton" style={{ height: '60px', width: '300px' }}></div>
                                <div className="skeleton" style={{ height: '40px', width: '120px' }}></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>
                        <p>{error}</p>
                        <button className="btn-outline" style={{ marginTop: '20px' }} onClick={fetchSubscriptions}>Retry</button>
                    </div>
                ) : subscriptions.length === 0 ? (
                    <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', marginBottom: '24px' }}>📦</div>
                        <h3>No Subscriptions Found</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                            You haven't subscribed to any products yet. Browse our shop to start!
                        </p>
                        <button className="btn-primary" onClick={() => navigate('/')}>
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '80px' }}>
                        {subscriptions.map((sub, index) => (
                            <div
                                key={sub.id}
                                className="glass-card sub-card animate-fade-up"
                                style={{ animationDelay: `${0.1 * index}s` }}
                            >
                                <div className="sub-info">
                                    <h3 style={{ fontSize: '20px' }}>{sub.product_name}</h3>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        <span><strong>Plan:</strong> {sub.subscription_type}</span>
                                        <span><strong>Qty:</strong> {sub.quantity} units</span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        <strong>Active from:</strong> {sub.start_date} {sub.end_date && `to ${sub.end_date}`}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div className="sub-status">
                                        <span className={`status-indicator ${sub.is_active ? 'active' : ''}`}></span>
                                        <span className={`badge ${sub.is_active ? 'badge-success' : 'badge-danger'}`}>
                                            {sub.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '14px' }}>
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MySubscription;
