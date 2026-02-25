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
        <>
            <Navbar />
            <div style={styles.container}>
                <h2>Register</h2>
                <form onSubmit={handleRegister} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p style={styles.linkText}>
                    Already have an account? <Link to="/login">Login</Link>
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

export default Register;