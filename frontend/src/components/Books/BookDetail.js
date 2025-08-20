import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');
    const [existingNote, setExistingNote] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            const response = await api.get(`/books/${id}/`);
            setBook(response.data);
            if (response.data.user_note) {
                setExistingNote(response.data.user_note);
                setNote(response.data.user_note.content);
            }
        } catch (error) {
            console.error('Error fetching book:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNote = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (existingNote) {
                // Update existing note
                const response = await api.patch(`/notes/${existingNote.id}/`, {
                    content: note
                });
                setExistingNote(response.data);
            } else {
                // Create new note
                const response = await api.post('/notes/', {
                    book: id,
                    content: note
                });
                setExistingNote(response.data);
            }
            alert('Note saved successfully!');
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note. Please login first.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteNote = async () => {
        if (!existingNote || !window.confirm('Delete this note?')) return;

        try {
            await api.delete(`/notes/${existingNote.id}/`);
            setExistingNote(null);
            setNote('');
            alert('Note deleted');
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!book) return <div>Book not found</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/')}>← Back to Books</button>

            <h1>{book.title}</h1>
            <h3>by {book.author}</h3>

            <div style={{ marginTop: '20px' }}>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p><strong>Pages:</strong> {book.page_count}</p>
                <p><strong>Published:</strong> {book.publication_date}</p>
                <p><strong>Description:</strong> {book.description}</p>
            </div>

            {isAuthenticated && (
                <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5' }}>
                    <h3>My Notes</h3>
                    <form onSubmit={handleSaveNote}>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add your notes about this book..."
                            style={{ width: '100%', minHeight: '100px', padding: '10px' }}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <button type="submit" disabled={saving}>
                                {saving ? 'Saving...' : existingNote ? 'Update Note' : 'Save Note'}
                            </button>
                            {existingNote && (
                                <button type="button" onClick={handleDeleteNote} style={{ marginLeft: '10px' }}>
                                    Delete Note
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BookDetail;