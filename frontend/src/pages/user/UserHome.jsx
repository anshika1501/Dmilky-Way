import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../api/axios";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar";

// Subscription plans
const subscriptionPlans = [
    { id: "onetime", name: "One-Time Purchase", duration: "Single delivery", discount: 0, days: 1 },
    { id: "1month", name: "1 Month Subscription", duration: "Daily delivery for 30 days", discount: 5, days: 30 },
    { id: "3month", name: "3 Months Subscription", duration: "Daily delivery for 90 days", discount: 10, days: 90 },
    { id: "6month", name: "6 Months Subscription", duration: "Daily delivery for 180 days", discount: 15, days: 180 },
];

// Calculate subscription prices with discounts
const getSubscriptionPrices = (dailyPrice) => {
    const price = parseFloat(dailyPrice);
    return {
        daily: price,
        monthly1: (price * 30 * 0.95).toFixed(0),  // 5% off for 1 month
        monthly3: (price * 30 * 0.90).toFixed(0),  // 10% off for 3 months
        monthly6: (price * 30 * 0.85).toFixed(0),  // 15% off for 6 months
    };
};

function UserHome() {
    const navigate = useNavigate();
    const { addToCart, cartItems, cartCount, getCartTotal } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [recentlyAdded, setRecentlyAdded] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Check if product is in cart
    const isInCart = (productId) => {
        return cartItems.some(item => item.product.id === productId);
    };

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

    const handleAddToCart = (product, purchaseType = "onetime") => {
        addToCart(product, 1, 1, purchaseType);
        setRecentlyAdded(product.id);
        setTimeout(() => setRecentlyAdded(null), 1500);
        setShowPlanModal(false);
    };

    const openPlanModal = (product) => {
        setSelectedProduct(product);
        setShowPlanModal(true);
    };

    return (
        <div className="user-theme animate-fade-in">
            <Navbar />

            {/* Announcement Banner */}
            <div className="announcement-banner">
                <div className="marquee">
                    <div className="marquee-content">
                        <span>🎉 Welcome to E-Milk Shop! Free delivery on your first order. Use code: FIRSTFREE</span>
                        <span>⭐ Premium quality, organic milk from local farms.</span>
                        <span>🚚 Delivered to your doorstep everyday before 7 AM.</span>
                    </div>
                    {/* Duplicate for seamless scrolling */}
                    <div className="marquee-content" aria-hidden="true">
                        <span>🎉 Welcome to E-Milk Shop! Free delivery on your first order. Use code: FIRSTFREE</span>
                        <span>⭐ Premium quality, organic milk from local farms.</span>
                        <span>🚚 Delivered to your doorstep everyday before 7 AM.</span>
                    </div>
                </div>
            </div>

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

                    {/* Floating Offer Card */}
                    <div className="floating-offer animate-float" style={{ animationDelay: '0.4s' }}>
                        <div className="offer-pulse"></div>
                        <span className="offer-text">Special Offer: 15% OFF on 6-Month Subscriptions!</span>
                    </div>

                    <div className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
                        <button className="btn-primary btn-glow" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
                            Shop Now
                        </button>
                    </div>
                </div>
            </section>

            <div className="container" style={{ paddingBottom: cartCount > 0 ? '120px' : '40px' }}>
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
                                {product.image ? (
                                    <div className="product-image" style={{ height: '200px', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="product-image-blank">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M7 3h10a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                                            <path d="M5 7h14" />
                                            <path d="m9 12 2 2 4-4" />
                                        </svg>
                                    </div>
                                )}
                                <div className="product-info">
                                    <span className="badge" style={{ background: 'rgba(0,212,170,0.2)', color: 'var(--primary)', marginBottom: '8px' }}>
                                        {product.category_name || 'Uncategorized'}
                                    </span>
                                    <h3>{product.name}</h3>
                                    <div style={{ marginTop: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Daily:</span>
                                            <span style={{ fontSize: '18px', fontWeight: '600' }}>₹{product.price}/kg</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Monthly:</span>
                                            <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
                                                ₹{getSubscriptionPrices(product.price).monthly1}
                                            </span>
                                            <span style={{ fontSize: '12px', background: 'var(--success)', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                                                5% OFF
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="product-meta">
                                    <span className={product.stock > 0 ? "badge badge-success" : "badge badge-danger"}>
                                        {product.stock > 0 ? `${product.stock} Left` : "Out of Stock"}
                                    </span>
                                    <span className="badge badge-success">Available</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                                    <button
                                        className="btn-outline"
                                        style={{ flex: 1, minWidth: '100px', fontSize: '13px', padding: '10px 8px' }}
                                        onClick={() => openPlanModal(product)}
                                    >
                                        View Plans
                                    </button>
                                    <button
                                        className="btn-outline"
                                        style={{
                                            flex: 1,
                                            minWidth: '100px',
                                            fontSize: '13px',
                                            padding: '10px 8px',
                                            background: isInCart(product.id) ? 'var(--success)' : recentlyAdded === product.id ? 'var(--primary)' : undefined,
                                            borderColor: isInCart(product.id) ? 'var(--success)' : recentlyAdded === product.id ? 'var(--primary)' : undefined,
                                            color: isInCart(product.id) || recentlyAdded === product.id ? '#fff' : undefined
                                        }}
                                        onClick={() => isInCart(product.id) ? navigate('/cart') : handleAddToCart(product)}
                                    >
                                        {isInCart(product.id) ? '✓ In Cart' : recentlyAdded === product.id ? '✓ Added!' : 'Add to Cart'}
                                    </button>
                                </div>
                                <button
                                    className="btn-primary"
                                    style={{ marginTop: '8px' }}
                                    onClick={() => navigate('/checkout', { state: { product } })}
                                >
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Checkout Bar */}
            {cartCount > 0 && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(135deg, rgba(17,24,39,0.98) 0%, rgba(31,41,55,0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    padding: '16px 24px',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, overflow: 'hidden' }}>
                        <div style={{
                            background: 'var(--primary)',
                            color: '#000',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '16px',
                            flexShrink: 0
                        }}>
                            {cartCount}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {cartItems.slice(0, 3).map(item => item.product.name).join(', ')}
                                {cartItems.length > 3 && ` +${cartItems.length - 3} more`}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total</div>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
                                ₹{getCartTotal().toFixed(0)}
                            </div>
                        </div>
                        <button
                            className="btn-primary"
                            style={{
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onClick={() => navigate('/cart')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="m1 1 4 4h16l-2 11H7" />
                            </svg>
                            Checkout
                        </button>
                    </div>
                </div>
            )}

            {/* Subscription Plan Modal */}
            {showPlanModal && selectedProduct && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div className="glass-card" style={{
                        padding: '32px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
                                    Subscription Plans
                                </h2>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Choose a plan for <strong>{selectedProduct.name}</strong>
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPlanModal(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    padding: '4px 8px'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            {subscriptionPlans.map((plan) => {
                                const prices = getSubscriptionPrices(selectedProduct.price);
                                let totalPrice;
                                if (plan.id === 'onetime') {
                                    totalPrice = prices.daily;
                                } else if (plan.id === '1month') {
                                    totalPrice = prices.monthly1;
                                } else if (plan.id === '3month') {
                                    totalPrice = prices.monthly3 * 3;
                                } else {
                                    totalPrice = prices.monthly6 * 6;
                                }

                                return (
                                    <div
                                        key={plan.id}
                                        className="glass-card"
                                        style={{
                                            padding: '20px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '16px',
                                            flexWrap: 'wrap',
                                            border: plan.discount === 10 ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: '600', fontSize: '16px' }}>{plan.name}</span>
                                                {plan.discount > 0 && (
                                                    <span className="badge badge-warning" style={{ fontSize: '11px' }}>
                                                        {plan.discount}% OFF
                                                    </span>
                                                )}
                                                {plan.discount === 10 && (
                                                    <span className="badge" style={{ background: 'var(--primary)', color: '#000', fontSize: '11px' }}>
                                                        POPULAR
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                {plan.duration}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
                                                ₹{totalPrice}
                                            </div>
                                            {plan.days > 1 && (
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                    ≈ ₹{(totalPrice / plan.days).toFixed(0)}/day
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            className="btn-primary"
                                            style={{ padding: '10px 20px', fontSize: '14px' }}
                                            onClick={() => handleAddToCart(selectedProduct, plan.id)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                className="btn-outline"
                                onClick={() => setShowPlanModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => navigate('/cart')}
                            >
                                View Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserHome;
