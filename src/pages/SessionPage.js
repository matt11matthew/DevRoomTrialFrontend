import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import RequireAuth from "../components/RequireAuth";
import "./SessionPage.css";

function SessionPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const username = localStorage.getItem("username");

    useEffect(() => {
        if (!username) {
            setError("No username found. Please log in.");
            setLoading(false);
            return;
        }

        fetch(
            `${process.env.REACT_APP_API_BASE_URL || "http://localhost:8082"}/auth/active-sessions?username=${username}`,
            {
                credentials: "include",
            }
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch active sessions");
                }
                return res.json();
            })
            .then((data) => {
                setSessions(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching active sessions:", err);
                setError("Failed to load active sessions. Please try again later.");
                setLoading(false);
            });
    }, [username]);

    const handleLogoutSession = (sessionId) => {
        fetch(
            `${process.env.REACT_APP_API_BASE_URL || "http://localhost:8082"}/auth/logout-session?sessionId=${sessionId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }
        )
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw new Error(text || "Failed to log out session");
                    });
                }
                // Check if the response is JSON
                const contentType = res.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    return res.json();
                }
                return res.text(); // Fallback to plain text
            })
            .then(() => {
                setSessions((prevSessions) =>
                    prevSessions.filter((s) => s.sessionId !== sessionId)
                );
            })
            .catch((err) => {
                console.error("Error logging out session:", err);
                setError(err.message || "Failed to log out session. Please try again.");
            });
    };



    if (loading) {
        return <p>Loading sessions...</p>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <RequireAuth>
            <PageTitle title="Session Management" />
            <div className="SessionPage">
                <table className="sessions-table">
                    <thead>
                    <tr>
                        <th>Session ID</th>
                        <th>Creation Time</th>
                        <th>Last Accessed Time</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sessions.length > 0 ? (
                        sessions.map((session) => (
                            <tr key={session.sessionId}>
                                <td>{session.sessionId}</td>
                                <td>{new Date(session.creationTime).toLocaleString()}</td>
                                <td>{new Date(session.lastAccessedTime).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="logout-button"
                                        onClick={() => handleLogoutSession(session.sessionId)}
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
