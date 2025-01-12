import React, { useState } from 'react';
import './RegisterDialog.css';

const RegisterDialog = ({ onClose, setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        fetch("http://localhost:8082/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
        })
            .then((res) => {
                if (res.ok) {
                    // Automatically log in the user after successful registration
                    return fetch("http://localhost:8082/auth/login", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, password }),
                    });
                } else {
                    throw new Error("Registration failed. Username or email might be taken.");
                }
            })
            .then((res) => {
                if (res.ok) {
                    setIsLoggedIn(true);  // Set logged in state
                    onClose();  // Close the dialog
                } else {
                    throw new Error("Auto-login failed after registration.");
                }
            })
            .catch((err) => setError(err.message));
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h2>Register</h2>
                <form onSubmit={handleRegister} className="register-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-button">Submit</button>
                    <button type="button" onClick={onClose} className="auth-button cancel">Cancel</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default RegisterDialog;
