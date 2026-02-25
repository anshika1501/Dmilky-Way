import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.access) {
                    localStorage.setItem("access", data.access);
                    navigate("/user/subscription");
                } else {
                    alert("Invalid credentials");
                }
            });
    };

    return (
        <>
            <Navbar />
            <div style={{ padding: "30px" }}>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    /><br /><br />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    /><br /><br />
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    );
}

export default Login;