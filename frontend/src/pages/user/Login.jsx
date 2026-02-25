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
            alert("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-theme animate-fade-in">
            <Navbar />
            <div className="auth-page">
                <div className="glass-card auth-card animate-fade-up">
                    <div className="auth-header">
                        <h2>Welcome Back</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Log in to manage your daily milk supply</p>
                    </div>

                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '12px' }} disabled={loading}>
                            {loading ? "Logging in..." : "Login to Account"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Create one for free</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
