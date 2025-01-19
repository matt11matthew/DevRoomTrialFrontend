import React from "react";
import PageTitle from "../components/PageTitle";
import RequireAuth from "../components/RequireAuth";

function SessionPage() {
    return (
        <RequireAuth>
            <div className="SessionPage">
                <PageTitle title="Session Management" />
                <p>Welcome to the Session Management page</p>
            </div>
        </RequireAuth>
    );
}

export default SessionPage;
