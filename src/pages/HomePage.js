import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import './HomePage.css'; // Assuming a CSS file for consistent styling

function HomePage() {
    const [books, setBooks] = useState([]);
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
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

    return (
        <>
            <PageTitle title="Library" />
            <div className="HomePage">
                <div className="table-container">
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
                        {books.map(book => (
                            <tr
                                key={book.id}
                                onClick={() => handleBookClick(book.id)}
                                className="clickable-row">
                                <td>{book.title}</td>
                                <td>
                                    <img
                                        src={book.imageUrl}
                                        alt={book.title}
                                        className="book-image"
                                    />
                                </td>
                                <td>{book.status === 'checked_out' ? 'Checked Out' : 'Available'}</td>
                                <td>{book.checkedOutBy || 'N/A'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default HomePage;