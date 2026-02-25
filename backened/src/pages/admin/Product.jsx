import { useEffect, useState } from "react";
import { adminAPI } from "../../api/axios";

function Product() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    // Form states
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                adminAPI.getProducts(),
                adminAPI.getCategories()
            ]);
            setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
            setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await adminAPI.createProduct({
                name,
                category: parseInt(category),
                price: parseFloat(price),
                stock: parseInt(stock)
            });
            setProducts([...products, response.data]);
            setName("");
            setCategory("");
            setPrice("");
            setStock("");
        } catch (err) {
            console.error("Error creating product:", err);
            alert("Failed to create product");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await adminAPI.deleteProduct(id);
            setProducts(products.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product");
        }
    };

    const getCategoryName = (categoryId) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat ? cat.name : "N/A";
    };

    const filtered = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            getCategoryName(p.category).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <h2>
                    Product Management
                    {!loading && <span className="page-header-count">({filtered.length})</span>}
                </h2>
                <div className="search-box">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search products or categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Add Product Form */}
            <div className="admin-form-card">
                <h3>
                    <svg className="form-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Add New Product
                </h3>
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="admin-form-group">
                        <label>Price (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Stock</label>
                        <input
                            type="number"
                            placeholder="Enter stock quantity"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Product
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
                                <div className="skeleton-cell w-md" />
                                <div className="skeleton-cell w-md" />
                                <div className="skeleton-cell w-sm" />
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
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        <h3>No products found</h3>
                        <p>{search ? "Try a different search term" : "Add your first product using the form above"}</p>
                    </div>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => (
                                <tr key={p.id}>
                                    <td><span className="cell-main">#{p.id}</span></td>
                                    <td><span className="cell-main">{p.name}</span></td>
                                    <td>
                                        <span className="badge badge-info">
                                            {getCategoryName(p.category)}
                                        </span>
                                    </td>
                                    <td><span className="price-tag">₹{p.price}</span></td>
                                    <td>
                                        <span className={`badge ${p.stock > 0 ? "badge-success" : "badge-warning"}`}>
                                            {p.stock} units
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${p.is_active ? "badge-success" : "badge-danger"}`}>
                                            {p.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-delete" onClick={() => handleDelete(p.id)}>
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

export default Product;