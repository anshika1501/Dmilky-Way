import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MySubscription() {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/subscriptions/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`
            }
        })
            .then(res => res.json())
            .then(data => setSubscriptions(data));
    }, []);

    return (
        <>
            <Navbar />

            <div style={{ padding: "30px" }}>
                <h2>My Subscription</h2>

                {subscriptions.length === 0 ? (
                    <p>No subscription found.</p>
                ) : (
                    subscriptions.map(sub => (
                        <div key={sub.id} style={cardStyle}>
                            <p><strong>Product:</strong> {sub.product_name}</p>
                            <p><strong>Type:</strong> {sub.subscription_type}</p>
                            <p><strong>Quantity:</strong> {sub.quantity}</p>
                            <p><strong>Status:</strong> {sub.is_active ? "Active" : "Inactive"}</p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

const cardStyle = {
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px"
};

export default MySubscription;