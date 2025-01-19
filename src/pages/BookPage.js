import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTitle from "../components/PageTitle";
import './BookPage.css'; // Import the CSS

const BookPage = ({ username }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetch(`${baseUrl}/book/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Book not found');
                }
                return response.json();
            })
            .then(data => {
                setBook(data);
            })
            .catch(error => {
                console.error('Error fetching book:', error);
                alert('Book not found');
                navigate('/'); // Redirect to home if book not found
            });
    }, [id, navigate, baseUrl]);

    const handleCheckOut = () => {
        fetch(`${baseUrl}/book/${id}/checkout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'username': username,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to check out book');
                }
                return response.json();
            })
            .then(() => {
                alert('Book checked out successfully!');
                setBook({ ...book, status: 'checked_out', checkedOutBy: username });
            })
            .catch(error => {
                console.error('Error checking out book:', error);
                alert('Failed to check out book.');
            });
    };

    const handleReturn = () => {
        fetch(`${baseUrl}/book/${id}/return`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'username': username,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to return book');
                }
                return response.json();
            })
            .then(() => {
                alert('Book returned successfully!');
                setBook({ ...book, status: 'available', checkedOutBy: null });
            })
            .catch(error => {
                console.error('Error returning book:', error);
                alert('Failed to return book.');
            });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            fetch(`${baseUrl}/book/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to delete book');
                    }
                    alert('Book deleted successfully!');
                    navigate('/');
                })
                .catch(error => {
                    console.error('Error deleting book:', error);
                    alert('Failed to delete book.');
                });
        }
    };

    if (!book) {
        return <p>Loading book details...</p>;
    }

    return (
        <>
            <PageTitle title="Library" />
            <div className="book-page">
                <h1>{book.title}</h1>
                {book.image && <img className="book-image" src={book.image} alt={book.title}/>}
                <p>{book.description}</p>
                <p>Status: {book.status === 'checked_out' ? `Checked out by ${book.checkedOutBy}` : 'Available'}</p>

                {(book.status === 'Available' || book.status === null) && (
                    <button className="btn-checkout" onClick={handleCheckOut}>Check Out</button>
                )}

                {book.status === 'checked_out' && book.checkedOutBy === username && (
                    <button className="btn-return" onClick={handleReturn}>Return Book</button>
                )}

                <button className="btn-delete" onClick={handleDelete}>Delete Book</button>
            </div>
        </>
    );
};

export default BookPage;
