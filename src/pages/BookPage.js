import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTitle from "../components/PageTitle";
import './BookPage.css'; // Import the CSS

const BookPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Delete confirmation state
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    // Check session validity and update login state
    const checkSession = () => {
        fetch(`${baseUrl}/auth/check-session`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    setIsLoggedIn(true);
                    setUsername(data.username);
                    localStorage.setItem("username", data.username);
                } else {
                    setIsLoggedIn(false);
                    setUsername("");
                    localStorage.removeItem("username");
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUsername("");
                localStorage.removeItem("username");
            });
    };

    // Fetch session status on mount and set interval for polling
    useEffect(() => {
        checkSession();
        const interval = setInterval(checkSession, 500); // Check session every 5 seconds
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [baseUrl]);

    useEffect(() => {
        // Fetch book details
        fetch(`${baseUrl}/book/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Book not found');
                }
                return response.json();
            })
            .then((data) => {
                setBook(data);
            })
            .catch((error) => {
                console.error('Error fetching book:', error);
                alert('Book not found');
            });
    }, [id, baseUrl]);

    const handleCheckOut = () => {
        if (!isLoggedIn) {
            alert('You must be logged in to check out this book.');
            return;
        }
        fetch(`${baseUrl}/book/${id}/checkout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'username': username,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to check out book');
                }
                // If no JSON response, return success status
                return response.status;
            })
            .then((status) => {
                if (status === 200) {
                    setBook({ ...book, status: 'checked_out', checkedOutBy: username });
                }
            })
            .catch((error) => {
                console.error('Error checking out book:', error);
            });
    };


    const handleReturn = () => {
        if (!isLoggedIn) {
            alert('You must be logged in to return this book.');
            return;
        }
        fetch(`${baseUrl}/book/${id}/return`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'username': username,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to return book');
                }
                // If no JSON response, return the HTTP status
                return response.status;
            })
            .then((status) => {
                if (status === 200) {
                    setBook({ ...book, status: 'available', checkedOutBy: null });
                }
            })
            .catch((error) => {
                console.error('Error returning book:', error);
            });
    };


    const handleDelete = () => {
        if (!isLoggedIn) {
            alert('You must be logged in to delete this book.');
            return;
        }
        setShowDeleteDialog(true); // Show delete confirmation dialog
    };

    const confirmDelete = () => {
        fetch(`${baseUrl}/book/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete book');
                }
                navigate('/'); // Redirect to home page after delete
            })
            .catch((error) => {
                console.error('Error deleting book:', error);
            })
            .finally(() => setShowDeleteDialog(false)); // Close the dialog
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false); // Close the dialog
    };

    const handleBack = () => {
        navigate('/');
    };

    if (!book) {
        return <p>Loading book details...</p>;
    }

    return (
        <>
            <PageTitle title="Library" />
            <div className="book-page">
                <button className="btn-back" onClick={handleBack}>Back</button>
                <h1>{book.title}</h1>
                {book.imageUrl && <img className="book-image" src={book.imageUrl} alt={book.title} />}
                <p>{book.description}</p>
                <p>Status: {book.status === 'checked_out' ? `Checked out by ${book.checkedOutBy}` : 'Available'}</p>

                {isLoggedIn && (book.status === 'Available' || book.status === null) && (
                    <button className="btn-checkout" onClick={handleCheckOut}>Check Out</button>
                )}

                {isLoggedIn && book.status === 'checked_out' && book.checkedOutBy === username && (
                    <button className="btn-return" onClick={handleReturn}>Return Book</button>
                )}

                {isLoggedIn && (
                    <button className="btn-delete" onClick={handleDelete}>Delete Book</button>
                )}

                {!isLoggedIn && (
                    <p className="login-prompt">You must be logged in to perform actions on this book.</p>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this book? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn-confirm" onClick={confirmDelete}>Yes, Delete</button>
                            <button className="btn-cancel" onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookPage;
