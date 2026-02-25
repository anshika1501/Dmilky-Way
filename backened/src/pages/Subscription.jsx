import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import "../Customer.css";

function Subscription() {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/subscriptions/")
            .then((res) => res.json())
            .then((data) => setSubscriptions(data))
            .catch((error) => console.error("Error:", error));
    }, []);
    const handleDelete = (id) => {
        fetch(`http://127.0.0.1:8000/subscriptions/${id}/`, {
            method: "DELETE",
        })
            .then(() => {
                setSubscriptions(
                    subscriptions.filter((sub) => sub.id !== id)
                );
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <DashboardLayout>
            <div className="table-wrapper">
                <h2 className="page-heading">Subscription Management</h2>

                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {subscriptions.map((sub) => (
                            <tr key={sub.id}>
                                <td>{sub.id}</td>
                                <td>{sub.customer_name}</td>
                                <td>{sub.product_name}</td>
                                <td>{sub.subscription_type}</td>
                                <td>{sub.quantity}</td>
                                <td>{sub.start_date}</td>
                                <td>{sub.end_date ? sub.end_date : "Ongoing"}</td>
                                <td>
                                    <span
                                        className={
                                            sub.is_active
                                                ? "status-badge status-active"
                                                : "status-badge status-inactive"
                                        }
                                    >
                                        {sub.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(sub.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default Subscription;