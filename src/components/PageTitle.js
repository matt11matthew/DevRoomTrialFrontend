import React, { useState, useEffect } from 'react';
import './PageTitle.css';
import logo from '../img_1.png';

const PageTitle = ({ title }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Check session on component mount
    useEffect(() => {
        fetch("http://localhost:8082/auth/check-session", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    setIsLoggedIn(true);
                }
            });
    }, []);

    // Handle login
    const handleLogin = (e) => {
        e.preventDefault();
        fetch("http://localhost:8082/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => {
                if (res.ok) {
                    setIsLoggedIn(true);
                    setError('');
                } else {
                    setError("Invalid username or password");
                }
            })
            .catch(() => setError("Server error. Please try again."));
    };

    // Handle logout
    const handleLogout = () => {
        fetch("http://localhost:8082/auth/logout", {
            method: "POST",
            credentials: "include",
        })
            .then(() => {
                setIsLoggedIn(false);
                setUsername('');
                setPassword('');
            });
    };

    return (
        <div className="page-title">
            <div className="left-section">
                <img src={logo} alt="Logo" className="logo" />
                <h1>{title}</h1>
            </div>

            <div className="right-section">
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="auth-button logout">
                        Logout
                    </button>
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
                        {error && <p className="error-message">{error}</p>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default PageTitle;
