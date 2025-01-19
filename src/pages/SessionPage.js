import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import RequireAuth from "../components/RequireAuth";
import "./SessionPage.css";

function SessionPage() {
    const [sessions, setSessions] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:8082"}/auth/sessions`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch sessions");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Fetched sessions data:", data); // Debugging
                setSessions(data.sessions || []); // Ensure sessions is always an array
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching sessions:", err);
                setError("Failed to load sessions. Please try again later.");
                setLoading(false);
            });
    }, []);

    const handleLogoutSession = (sessionId) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:8082"}/auth/logout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ sessionId }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to log out session");
                }
                return res.json();
            })
            .then(() => {
                setSessions((prevSessions) => prevSessions.filter((s) => s.id !== sessionId));
            })
            .catch((err) => {
                console.error("Error logging out session:", err);
                setError("Failed to log out session. Please try again.");
            });
    };

    if (loading) {
        return <p>Loading sessions...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <RequireAuth>
            <div className="SessionPage">
                <PageTitle title="Session Management" />
                <table className="sessions-table">
                    <thead>
                    <tr>
                        <th>Device</th>
                        <th>IP Address</th>
                        <th>Last Used</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sessions && sessions.length > 0 ? (
                        sessions.map((session) => (
                            <tr key={session.id}>
                                <td>{session.device}</td>
                                <td>{session.ip}</td>
                                <td>{new Date(session.lastUsed).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="logout-button"
                                        onClick={() => handleLogoutSession(session.id)}
                                    >
                                        Logout
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No active sessions found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </RequireAuth>
    );
}

export default SessionPage;
