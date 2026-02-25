import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("access");

    const handleLogout = () => {
        localStorage.removeItem("access");
        navigate("/");
    };

    return (
        <nav style={styles.nav}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                <h2>Milkman</h2>
            </Link>

            <div>
                {token ? (
                    <>
                        <Link to="/" style={styles.link}>Home</Link>
                        <Link to="/my-subscription" style={styles.link}>My Subscription</Link>
                        <button onClick={handleLogout} style={styles.btn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/" style={styles.link}>Home</Link>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 40px",
        background: "#4caf50",
        color: "white",
    },
    link: {
        marginRight: "15px",
        color: "white",
        textDecoration: "none",
        fontWeight: "500",
    },
    btn: {
        background: "white",
        color: "#4caf50",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer"
    }
};

export default Navbar;