import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userAPI } from "../../api/axios";
import Navbar from "../../components/Navbar";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await userAPI.login({ username, password });
            if (response.data.access) {
                localStorage.setItem("access", response.data.access);
                if (response.data.refresh) {
                    localStorage.setItem("refresh", response.data.refresh);
                }
                navigate("/my-subscription");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div style={styles.container}>
                <h2>Login</h2>
                <form onSubmit={handleLogin} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p style={styles.linkText}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </>
    );
}

const styles = {
    container: {
        padding: "30px",
        maxWidth: "400px",
        margin: "0 auto"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "1px solid #ddd"
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#4caf50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    },
    linkText: {
        marginTop: "15px",
        textAlign: "center"
    }
};

export default Login;