import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const token = localStorage.getItem("access");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("access");
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <Link to="/" className="nav-logo animate-fade-in">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span>Milkman</span>
            </Link>

            <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
                {token ? (
                    <>
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                        <Link to="/my-subscription" className={`nav-link ${isActive('/my-subscription') ? 'active' : ''}`}>My Subscription</Link>
                        <Link to="/cart" className="nav-link cart-link" style={{ position: 'relative' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'var(--primary)',
                                    color: '#000',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button onClick={handleLogout} className="nav-btn-logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                        <Link to="/cart" className="nav-link cart-link" style={{ position: 'relative' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'var(--primary)',
                                    color: '#000',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
                        <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>Register</Link>
                    </>
                )}
            </div>

            <button
                className="mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? '✕' : '☰'}
            </button>
        </nav>
    );
}

export default Navbar;