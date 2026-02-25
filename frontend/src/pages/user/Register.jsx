import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userAPI } from "../../api/axios";
import Navbar from "../../components/Navbar";

function Register() {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await userAPI.register({
                username,
                first_name: firstName,
                last_name: lastName,
                email,
                password
            });
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            console.error("Registration error:", err);
            const message = err.response?.data?.error || "Registration failed. Please try again.";
            alert(message);
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
                        <h2>Join Milkman</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Start your fresh milk subscription today</p>
                    </div>

                    <form onSubmit={handleRegister} className="auth-form">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '12px' }} disabled={loading}>
                            {loading ? "Creating Account..." : "Create Free Account"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in instead</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
