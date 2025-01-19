import React, { useState } from 'react';
import './RegisterDialog.css';

const RegisterDialog = ({ onClose, setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    const handleRegister = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        fetch("${baseUrl}/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, username, password }),
        })
            .then((res) => res.json().then(data => ({ status: res.status, body: data })))
            .then(({ status, body }) => {
                if (status === 200) {
                    setIsLoggedIn(true);  // Automatically set the user as logged in
                    setUsername(body.username);  // Update the username in the state
                    onClose();  // Close the registration dialog
                } else {
                    throw new Error(body.error || "Registration failed. Please try again.");
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
