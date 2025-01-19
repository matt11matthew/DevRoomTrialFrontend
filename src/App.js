import React from 'react';
// import PageTitle from './components/PageTitle';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SessionPage from "./pages/SessionPage";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage";

function App() {
    return (
        <Router>
            <Routes>
                {/* Define routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/session-page" element={<SessionPage />} />
                <Route path="/book/:id" element={<BookPage />} />
            </Routes>
        </Router>
    );
}

export default App;
