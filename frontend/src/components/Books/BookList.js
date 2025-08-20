import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [filterAuthor, setFilterAuthor] = useState('');

    useEffect(() => {
        fetchBooks();
    }, [searchTerm, sortBy, filterAuthor]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (sortBy) params.append('ordering', sortBy);
            if (filterAuthor) params.append('author', filterAuthor);

            const response = await api.get(`/books/?${params.toString()}`);
            setBooks(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique authors for filter dropdown
    const uniqueAuthors = [...new Set(books.map(book => book.author))];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Book Explorer</h1>

            {/* Search and Filter Controls */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', flex: 1 }}
                />

                <select
                    value={filterAuthor}
                    onChange={(e) => setFilterAuthor(e.target.value)}
                    style={{ padding: '8px' }}
                >
                    <option value="">All Authors</option>
                    {uniqueAuthors.map(author => (
                        <option key={author} value={author}>{author}</option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '8px' }}
                >
                    <option value="title">Sort by Title</option>
                    <option value="author">Sort by Author</option>
                    <option value="-publication_date">Newest First</option>
                    <option value="publication_date">Oldest First</option>
                </select>
            </div>

            {/* Books Grid */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {books.map(book => (
                        <div key={book.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                            <h3>{book.title}</h3>
                            <p>by {book.author}</p>
                            <p style={{ fontSize: '14px', color: '#666' }}>{book.genre}</p>
                            <p style={{ fontSize: '14px', marginTop: '10px' }}>
                                {book.description?.substring(0, 100)}...
                            </p>
                            <Link to={`/books/${book.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                                View Details →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookList;