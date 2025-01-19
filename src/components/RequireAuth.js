import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        console.log("Starting session validation...");

        const checkSession = () => {
            fetch(`${baseUrl}/auth/check-session`, { credentials: "include" })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Session check failed");
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data.loggedIn) {
                        console.log("User is logged in.");
                        setIsLoggedIn(true);
                    } else {
                        console.log("User not logged in. Redirecting to home.");
                        navigate("/"); // Redirect if not logged in
                    }
                })
                .catch((error) => {
                    console.error("Error during session validation:", error);
                    navigate("/"); // Redirect on error
                })
                .finally(() => setLoading(false));
        };

        // Check session every second
        const intervalId = setInterval(checkSession, 1000);

        // Run the first check immediately
        checkSession();

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [navigate]);

    if (loading) {
        return <p>Loading...</p>; // Display a loading indicator while checking session
    }

    return isLoggedIn ? children : null;
};

export default RequireAuth;
