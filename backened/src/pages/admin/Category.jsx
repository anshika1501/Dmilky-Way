import { useEffect, useState } from "react";
import { adminAPI } from "../../api/axios";

function Category() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getCategories();
            setCategories(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await adminAPI.createCategory({ name, description });
            setCategories([...categories, response.data]);
            setName("");
            setDescription("");
        } catch (err) {
            console.error("Error creating category:", err);
            alert("Failed to create category");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await adminAPI.deleteCategory(id);
            setCategories(categories.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Error deleting category:", err);
            alert("Failed to delete category");
        }
    };

    const filtered = categories.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <h2>
                    Category Management
                    {!loading && <span className="page-header-count">({filtered.length})</span>}
                </h2>
                <div className="search-box">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Add Category Form */}
            <div className="admin-form-card">
                <h3>
                    <svg className="form-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Add New Category
                </h3>
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Category Name</label>
                        <input
                            type="text"
                            placeholder="Enter category name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="2"
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Category
                    </button>
                </form>
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
                        {[...Array(5)].map((_, i) => (
                            <div className="skeleton-row" key={i}>
                                <div className="skeleton-cell w-sm" />
                                <div className="skeleton-cell w-lg" />
                                <div className="skeleton-cell w-xl" />
                                <div className="skeleton-cell w-md" />
                                <div className="skeleton-cell w-md" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="admin-table-wrapper">
                    <div className="empty-state">
                        <svg className="empty-state-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                        <h3>No categories found</h3>
                        <p>{search ? "Try a different search term" : "Create your first category using the form above"}</p>
                    </div>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((cat) => (
                                <tr key={cat.id}>
                                    <td><span className="cell-main">#{cat.id}</span></td>
                                    <td><span className="cell-main">{cat.name}</span></td>
                                    <td>{cat.description || "—"}</td>
                                    <td>
                                        <span className={`badge ${cat.is_active ? "badge-success" : "badge-danger"}`}>
                                            {cat.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-delete" onClick={() => handleDelete(cat.id)}>
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

export default Category;