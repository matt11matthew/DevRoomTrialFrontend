import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import './HomePage.css';

function HomePage() {
    const [books, setBooks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock authentication
    const [showDialog, setShowDialog] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        description: '',
        image_url: '',
        status: 'Available', // Default to Available
    });

    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        // Mock authentication status
        const userLoggedIn = true; // Replace with real authentication logic
        setIsLoggedIn(userLoggedIn);

        // Fetch all books
        fetch(`${baseUrl}/book/books`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                return response.json();
            })
            .then(data => {
                setBooks(data);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                alert('Failed to load books.');
            });
    }, [baseUrl]);

    const handleBookClick = (id) => {
        navigate(`/book/${id}`);
    };

    const handleCreateBook = () => {
        // Validate title length
        if (newBook.title.length > 128) {
            alert('Title must be less than 128 characters.');
            return;
        }

        const book = {
            title: newBook.title,
            description: newBook.description,
            image_url: newBook.image_url, // Ensure this matches the API's expected field names
        };

        console.log("Base URL:", baseUrl);
        console.log("Book Payload:", book);

        fetch(`${baseUrl}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book),
        })
            .then(response => {
                console.log("Response status:", response.status);
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        console.error("Error response data:", errorData);
                        throw new Error(errorData.message || 'Failed to create book.');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Book created successfully:", data);
                setBooks([...books, data]); // Update books state
                setShowDialog(false); // Close dialog
            })
            .catch(error => {
                console.error('Error creating book:', error);
                alert(error.message || 'Failed to create book.');
            });
    };


    return (
        <>
            <PageTitle title="Library" />
            <div className="HomePage">

                {showDialog && (
                    <div className="dialog-overlay">
                        <div className="dialog">
                            <h3>Create a New Book</h3>
                            <input
                                type="text"
                                placeholder="Title (max 128 characters)"
                                value={newBook.title}
                                maxLength={128}
                                onChange={(e) =>
                                    setNewBook({ ...newBook, title: e.target.value })
                                }
                            />
                            <textarea
                                placeholder="Description"
                                value={newBook.description}
                                onChange={(e) =>
                                    setNewBook({ ...newBook, description: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={newBook.image_url}
                                onChange={(e) =>
                                    setNewBook({ ...newBook, image_url: e.target.value })
                                }
                            />
                            <button onClick={handleCreateBook}>Submit</button>
                            <button onClick={() => setShowDialog(false)}>Cancel</button>
                        </div>
                    </div>
                )}
                <div className="table-container">
                    {isLoggedIn && (
                        <button className="create-book-button" onClick={() => setShowDialog(true)}>
                            Create Book
                        </button>
                    )}
                    <table className="styled-table">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Image</th>
                            <th>Status</th>
                            <th>Checked Out By</th>
                        </tr>
                        </thead>
                        <tbody>
                        {books.map((book) => (
                            <tr
                                key={book.id}
                                onClick={() => handleBookClick(book.id)}
                                className="clickable-row"
                            >
                                <td>{book.title}</td>
                                <td>
                                    <img
                                        src={book.image_url}
                                        alt={book.title}
                                        className="book-image"
                                    />
                                </td>
                                <td>
                                    {book.status === 'checked_out'
                                        ? 'Checked Out'
                                        : 'Available'}
                                </td>
                                <td>{book.checkedOutBy || 'N/A'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {books.length === 0 && (
                        <div className="no-books-message">
                            <p>No books are currently available. Please add a new book!</p>
                        </div>
                    )}
                </div>
            </div>
        </>


    );
}

export default HomePage;
