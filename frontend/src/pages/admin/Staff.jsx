import { useEffect, useState } from "react";
import { adminAPI } from "../../api/axios";

function Staff() {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getStaff();
            setStaffs(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching staff:", err);
            setError("Failed to load staff");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await adminAPI.createStaff({ name, phone, role });
            setStaffs([...staffs, response.data]);
            setName("");
            setPhone("");
            setRole("");
        } catch (err) {
            console.error("Error creating staff:", err);
            alert("Failed to create staff");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this staff?")) return;
        try {
            await adminAPI.deleteStaff(id);
            setStaffs(staffs.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Error deleting staff:", err);
            alert("Failed to delete staff");
        }
    };

    const getRoleBadge = (role) => {
        const r = (role || "").toLowerCase();
        if (r.includes("manager")) return "badge-info";
        if (r.includes("delivery")) return "badge-warning";
        return "badge-success";
    };

    const filtered = staffs.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.phone && s.phone.includes(search)) ||
            (s.role && s.role.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <h2>
                    Staff Management
                    {!loading && <span className="page-header-count">({filtered.length})</span>}
                </h2>
                <div className="search-box">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, phone or role..."
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

            {/* Add Staff Form */}
            <div className="admin-form-card">
                <h3>
                    <svg className="form-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Add New Staff
                </h3>

                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Enter staff name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-form-group">
                        <label>Role</label>
                        <input
                            type="text"
                            placeholder="e.g. Delivery Boy / Manager"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Staff
                    </button>
                </form>
            </div>

            {/* Loading / Empty / Table */}
            {loading ? (
                <div className="admin-table-wrapper">
                    <div className="skeleton-table">
                        {[...Array(5)].map((_, i) => (
                            <div className="skeleton-row" key={i}>
                                <div className="skeleton-cell w-sm" />
                                <div className="skeleton-cell w-lg" />
                                <div className="skeleton-cell w-md" />
                                <div className="skeleton-cell w-md" />
                                <div className="skeleton-cell w-lg" />
                                <div className="skeleton-cell w-md" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="admin-table-wrapper">
                    <div className="empty-state">
                        <svg className="empty-state-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <h3>No staff found</h3>
                        <p>{search ? "Try a different search term" : "Add your first staff member using the form above"}</p>
                    </div>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((staff) => (
                                <tr key={staff.id}>
                                    <td><span className="cell-main">#{staff.id}</span></td>
                                    <td><span className="cell-main">{staff.name}</span></td>
                                    <td>{staff.phone}</td>
                                    <td>
                                        <span className={`badge ${getRoleBadge(staff.role)}`}>
                                            {staff.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="cell-sub">
                                            {new Date(staff.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-delete" onClick={() => handleDelete(staff.id)}>
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

export default Staff;