import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../api/axios";

function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await userAPI.login(formData);
            if (response.data.access) {
                localStorage.setItem("access", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);
                localStorage.setItem("user", JSON.stringify(response.data));

                navigate("/admin");
            }
        } catch (err) {
            console.error("Login fail:", err);
            setError(err.response?.data?.detail || "Invalid admin credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-theme animate-fade-in" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="container">
                <div className="glass-card" style={{ maxWidth: "450px", margin: "0 auto", padding: "40px" }}>
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            background: "rgba(0,212,170,0.1)",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px"
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Admin Portal</h2>
                        <p style={{ color: "var(--text-secondary)" }}>E-Milk Shop Administration</p>
                    </div>

                    {error && (
                        <div style={{
                            background: "rgba(255,68,68,0.1)",
                            border: "1px solid rgba(255,68,68,0.2)",
                            color: "var(--danger)",
                            padding: "12px",
                            borderRadius: "8px",
                            marginBottom: "24px",
                            fontSize: "14px",
                            textAlign: "center"
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>Admin Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "14px 16px",
                                    fontSize: "16px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    background: "rgba(255,255,255,0.05)",
                                    color: "var(--text-primary)",
                                    transition: "all 0.3s ease"
                                }}
                                placeholder="Enter admin username"
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "14px 16px",
                                    fontSize: "16px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    background: "rgba(255,255,255,0.05)",
                                    color: "var(--text-primary)",
                                    transition: "all 0.3s ease"
                                }}
                                placeholder="Enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ padding: "16px", fontSize: "16px", marginTop: "12px" }}
                        >
                            {loading ? "Authenticating..." : "Login to Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
