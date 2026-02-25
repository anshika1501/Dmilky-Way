import { useEffect, useState } from "react";
import { userAPI } from "../../api/axios";
import Navbar from "../../components/Navbar";

function UserHome() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getProducts();
            setProducts(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-theme animate-fade-in">
            <Navbar />

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <span className="hero-tag animate-fade-up">🥛 Freshness Delivered</span>
                    <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        The Purest Milk From <span>Local Farms</span> To Your Door
                    </h1>
                    <p className="hero-desc animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        Experience the taste of nature with our organic, non-pasteurized milk
                        delivered fresh every morning before you wake up.
                    </p>
                    <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
                        <button className="btn-primary" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
                            Shop Now
                        </button>
                    </div>
                </div>
            </section>

            <div className="container" style={{ paddingBottom: '80px' }}>
                <div className="section-header" style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '32px' }}>Choose Your Blend</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Select from our premium range of dairy products</p>
                </div>

                {loading ? (
                    <div className="product-grid">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="glass-card product-card">
                                <div className="skeleton" style={{ height: '240px' }}></div>
                                <div className="skeleton" style={{ height: '24px', width: '60%' }}></div>
                                <div className="skeleton" style={{ height: '32px', width: '40%' }}></div>
                                <div className="skeleton" style={{ height: '48px', marginTop: 'auto' }}></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>
                        <p>{error}</p>
                        <button className="btn-outline" style={{ marginTop: '20px' }} onClick={fetchProducts}>Retry</button>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.filter(p => p.is_active).map((product, index) => (
                            <div
                                key={product.id}
                                className="glass-card product-card animate-fade-up"
                                style={{ animationDelay: `${0.1 * index}s` }}
                            >
                                <div className="product-image-blank">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M7 3h10a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                                        <path d="M5 7h14" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <div className="product-price">₹ {product.price}</div>
                                </div>
                                <div className="product-meta">
                                    <span className={product.stock > 0 ? "badge badge-success" : "badge badge-danger"}>
                                        {product.stock > 0 ? `${product.stock} Left` : "Out of Stock"}
                                    </span>
                                    <span className="badge badge-success">Available</span>
                                </div>
                                <button
                                    className="btn-primary"
                                    style={{ marginTop: '16px' }}
                                    disabled={product.stock <= 0}
                                >
                                    {product.stock > 0 ? 'Subscribe Now' : 'Out of Stock'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserHome;
