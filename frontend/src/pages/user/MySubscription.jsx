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
        <>
            <Navbar />

            <div style={styles.container}>
                <h2>My Subscriptions</h2>

                {loading && <p>Loading...</p>}
                {error && <p style={styles.error}>{error}</p>}

                {!loading && subscriptions.length === 0 ? (
                    <p>No subscriptions found. Browse products to subscribe!</p>
                ) : (
                    <div style={styles.grid}>
                        {subscriptions.map(sub => (
                            <div key={sub.id} style={styles.card}>
                                <h3>{sub.product_name}</h3>
                                <p><strong>Type:</strong> {sub.subscription_type}</p>
                                <p><strong>Quantity:</strong> {sub.quantity}</p>
                                <p><strong>Start Date:</strong> {sub.start_date}</p>
                                {sub.end_date && <p><strong>End Date:</strong> {sub.end_date}</p>}
                                <span style={sub.is_active ? styles.active : styles.inactive}>
                                    {sub.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

const styles = {
    container: {
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
        marginTop: "20px"
    },
    card: {
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff"
    },
    active: {
        display: "inline-block",
        padding: "4px 8px",
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        borderRadius: "4px",
        fontSize: "12px"
    },
    inactive: {
        display: "inline-block",
        padding: "4px 8px",
        backgroundColor: "#ffebee",
        color: "#c62828",
        borderRadius: "4px",
        fontSize: "12px"
    },
    error: {
        color: "red"
    }
};

export default MySubscription;