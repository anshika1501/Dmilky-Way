import { useEffect, useState } from "react";
import { adminAPI } from "../../api/axios";

function Customer() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getCustomers();
            setCustomers(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching customers:", err);
            setError("Failed to load customers");
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;
        try {
            await adminAPI.deleteCustomer(id);
            setCustomers(customers.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Error deleting customer:", err);
            alert("Failed to delete customer");
        }
    };

    const filtered = customers.filter(
        (c) =>
            `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
            (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
            (c.phone && c.phone.includes(search))
    );

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <h2>
                    Customer Management
                    {!loading && <span className="page-header-count">({filtered.length})</span>}
                </h2>
                <div className="search-box">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
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

            {/* Loading Skeleton */}
            {loading ? (
                <div className="admin-table-wrapper">
                    <div className="skeleton-table">
                        {[...Array(6)].map((_, i) => (
                            <div className="skeleton-row" key={i}>
                                <div className="skeleton-cell w-sm" />
                                <div className="skeleton-cell w-lg" />
                                <div className="skeleton-cell w-xl" />
                                <div className="skeleton-cell w-md" />
                                <div className="skeleton-cell w-lg" />
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
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="18" y1="8" x2="23" y2="13" />
                            <line x1="23" y1="8" x2="18" y2="13" />
                        </svg>
                        <h3>No customers found</h3>
                        <p>{search ? "Try a different search term" : "Customers will appear here once they register"}</p>
                    </div>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c) => (
                                <tr key={c.id}>
                                    <td><span className="cell-main">#{c.id}</span></td>
                                    <td><span className="cell-main">{c.first_name} {c.last_name}</span></td>
                                    <td>{c.email}</td>
                                    <td>{c.phone || "—"}</td>
                                    <td>{c.address || "—"}</td>
                                    <td>
                                        <span className={`badge ${c.is_active ? "badge-success" : "badge-danger"}`}>
                                            {c.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-delete" onClick={() => handleDelete(c.id)}>
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

export default Customer;