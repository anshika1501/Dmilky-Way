import { useEffect, useState } from "react";
import { adminAPI } from "../../api/axios";

function Subscription() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getSubscriptions();
            setSubscriptions(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching subscriptions:", err);
            setError("Failed to load subscriptions");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subscription?")) return;
        try {
            await adminAPI.deleteSubscription(id);
            setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
        } catch (err) {
            console.error("Error deleting subscription:", err);
            alert("Failed to delete subscription");
        }
    };

    const getTypeBadge = (type) => {
        const t = (type || "").toLowerCase();
        if (t.includes("daily")) return "badge-success";
        if (t.includes("weekly")) return "badge-info";
        if (t.includes("monthly")) return "badge-warning";
        return "badge-info";
    };

    const filtered = subscriptions.filter(
        (sub) =>
            (sub.customer_name && sub.customer_name.toLowerCase().includes(search.toLowerCase())) ||
            (sub.product_name && sub.product_name.toLowerCase().includes(search.toLowerCase())) ||
            (sub.subscription_type && sub.subscription_type.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <h2>
                    Subscription Management
                    {!loading && <span className="page-header-count">({filtered.length})</span>}
                </h2>
                <div className="search-box">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by customer, product or type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="admin-error">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Loading / Empty / Table */}
            {loading ? (
                <div className="admin-table-wrapper">
                    <div className="skeleton-table">
                        {[...Array(6)].map((_, i) => (
                            <div className="skeleton-row" key={i}>
                                <div className="skeleton-cell w-sm" />
                                <div className="skeleton-cell w-lg" />
                                <div className="skeleton-cell w-lg" />
                                <div className="skeleton-cell w-md" />
                                <div className="skeleton-cell w-sm" />
                                <div className="skeleton-cell w-md" />
                                <div className="skeleton-cell w-md" />
                                <div className="skeleton-cell w-sm" />
                                <div className="skeleton-cell w-md" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="admin-table-wrapper">
                    <div className="empty-state">
                        <svg className="empty-state-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <h3>No subscriptions found</h3>
                        <p>{search ? "Try a different search term" : "Subscriptions will appear here once customers subscribe"}</p>
                    </div>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Type</th>
                                <th>Qty</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((sub) => (
                                <tr key={sub.id}>
                                    <td><span className="cell-main">#{sub.id}</span></td>
                                    <td><span className="cell-main">{sub.customer_name}</span></td>
                                    <td>{sub.product_name}</td>
                                    <td>
                                        <span className={`badge ${getTypeBadge(sub.subscription_type)}`}>
                                            {sub.subscription_type}
                                        </span>
                                    </td>
                                    <td><span className="cell-main">{sub.quantity}</span></td>
                                    <td>
                                        <span className="cell-sub">
                                            {new Date(sub.start_date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="cell-sub">
                                            {sub.end_date
                                                ? new Date(sub.end_date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })
                                                : "Ongoing"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${sub.is_active ? "badge-success" : "badge-danger"}`}>
                                            {sub.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-delete" onClick={() => handleDelete(sub.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default Subscription;