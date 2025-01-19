import React, { useState, useEffect } from "react";
import "./PageTitle.css";
import logo from "../img_1.png";
import RegisterDialog from "./RegisterDialog";

const PageTitle = ({ title }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);

    useEffect(() => {
        // Check session validity on component mount
        fetch("http://localhost:8082/auth/check-session", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    setIsLoggedIn(true);
                    setUsername(data.username);


                    localStorage.setItem("username", data.username); // Persist username
                } else {
                    setIsLoggedIn(false);
                    localStorage.removeItem("username"); // Clear username if session invalid
                }
            })
            .catch(() => setError("Failed to validate session. Please try again later."));
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        setError(""); // Clear error before login attempt
        fetch("http://localhost:8082/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => {
                if (res.ok) {
                    setIsLoggedIn(true);
                    setPassword(""); // Clear password for security
                    setError("");
                    localStorage.setItem("username", username); // Save username
                } else {
                    setError("Invalid username or password");
                }
            })
            .catch(() => setError("Server error. Please try again."));
    };

    const handleLogout = () => {
        fetch("http://localhost:8082/auth/logout", { method: "POST", credentials: "include" })
            .then(() => {
                setIsLoggedIn(false);
                setUsername("");
                setPassword("");
                localStorage.removeItem("username"); // Clear stored username
            })
            .catch(() => setError("Failed to log out. Please try again."));
    };

    return (
        <div className="page-title">
            <div className="left-section">
                <img src={logo} alt="Logo" className="logo" />
                <h1>{title}</h1>
            </div>

            <div className="right-section">
                {isLoggedIn ? (
                    <>
                        <span className="welcome-text">Welcome, {username}!</span>
                        <button onClick={handleLogout} className="auth-button logout">
                            Logout
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleLogin} className="login-form">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="auth-button login">
                            Login
                        </button>
                        <button
                            type="button"
                            className="auth-button register"
                            onClick={() => {
                                setError(""); // Clear errors when opening registration
                                setShowRegisterDialog(true);
                            }}
                        >
                            Register
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                )}
            </div>

            {showRegisterDialog && (
                <RegisterDialog
                    onClose={() => setShowRegisterDialog(false)}
                    setIsLoggedIn={setIsLoggedIn}
                />
            )}
        </div>
    );
};

export default PageTitle;
