# Book Explorer

Full-stack web application for browsing books and managing personal reading notes, built with Django REST Framework and React.

## Architecture Overview

### System Design
```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│                 │  HTTP   │                  │  SQL    │              │
│  React Frontend │◄────────┤ Django Backend   ├─────────┤  SQLite DB   │
│  (Port 3000)    │  JSON   │  (Port 8000)     │         │              │
│                 │         │                  │         │              │
└─────────────────┘         └──────────────────┘         └──────────────┘
        │                            │
        │                            │
        ▼                            ▼
   localStorage              JWT Authentication
   (JWT Tokens)              (Simple JWT)
```

### Backend Structure (Django)
```
backend/
├── book_explorer/           # Project configuration
│   ├── settings.py         # Django settings, JWT config, CORS
│   ├── urls.py            # Main URL routing
│   └── wsgi.py            # WSGI application
│
├── books/                  # Books app
│   ├── models.py          # Book model
│   ├── serializers.py     # DRF serializers
│   ├── views.py           # ViewSets (ReadOnly)
│   └── migrations/        # Database migrations
│       └── 0002_populate_books.py  # Initial data
│
├── notes/                  # Notes app
│   ├── models.py          # Note model (User-Book relationship)
│   ├── serializers.py     # Note serialization
│   └── views.py           # CRUD ViewSet
│
├── users/                  # Authentication app
│   ├── serializers.py     # User serialization
│   └── views.py           # Register/Login endpoints
│
├── db.sqlite3             # Development database
├── manage.py              # Django management script
└── requirements.txt       # Python dependencies
```

### Frontend Structure (React)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/          # Authentication components
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   └── Books/         # Book-related components
│   │       ├── BookList.js
│   │       └── BookDetail.js
│   │
│   ├── services/
│   │   ├── api.js         # Axios configuration, interceptors
│   │   └── auth.js        # Authentication service
│   │
│   ├── context/
│   │   └── AuthContext.js # Global auth state management
│   │
│   ├── App.js             # Main app with routing
│   └── index.js           # React entry point
│
├── public/                # Static assets
└── package.json           # Node dependencies
```

## Development Environment Setup

### Prerequisites
- Python 3.8+ (tested with 3.13)
- Node.js 14+ and npm
- Git

### Backend Setup

1. **Clone and navigate to backend:**
```bash
git clone [repository-url]
cd book-explorer/backend
```

2. **Create Python virtual environment:**
```bash
python -m venv venv
```

3. **Activate virtual environment:**
```bash
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

4. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

5. **Run database migrations:**
```bash
python manage.py migrate
```
This creates the SQLite database and populates initial book data.

6. **Create admin superuser (optional):**
```bash
python manage.py createsuperuser
```

7. **Start Django development server:**
```bash
python manage.py runserver
```
Server runs at `http://localhost:8000`

### Frontend Setup

1. **Open new terminal and navigate to frontend:**
```bash
cd book-explorer/frontend
```

2. **Install Node dependencies:**
```bash
npm install
```

3. **Start React development server:**
```bash
npm start
```
Application opens at `http://localhost:3000`

### Running Both Servers

**Option 1: Two terminals**
- Terminal 1: `cd backend && source venv/bin/activate && python manage.py runserver`
- Terminal 2: `cd frontend && npm start`

**Option 2: Concurrent execution (from root):**
```bash
# Install concurrently
npm install --save-dev concurrently

# Add to root package.json scripts:
"dev": "concurrently \"cd backend && python manage.py runserver\" \"cd frontend && npm start\""

# Run both
npm run dev
```

## Key Design Decisions

### Authentication Architecture
- **JWT Tokens**: Stateless authentication suitable for SPA
- **Token Storage**: localStorage for persistence across sessions
- **Token Refresh**: Automatic refresh on 401 responses
- **Access Token**: 60-minute expiry
- **Refresh Token**: 7-day expiry with rotation

### API Design
- **RESTful Endpoints**: Standard HTTP verbs for CRUD operations
- **ViewSets**: DRF ViewSets for automatic URL routing
- **Permissions**: 
  - Books: Public read, authenticated write
  - Notes: Authenticated only, user-scoped
  - Auth: Public registration/login endpoints

### State Management
- **React Context API**: Chosen over Redux for simplicity
- **AuthContext**: Centralized authentication state
- **Local Component State**: For UI-specific state

### Database Design
```sql
-- Simplified schema
Books Table:
- id (PK)
- title, author, isbn, genre
- publication_date, page_count
- description

Notes Table:
- id (PK)
- user_id (FK -> auth_user)
- book_id (FK -> books)
- content
- UNIQUE(user_id, book_id)  -- One note per user per book
```

## API Endpoints

### Authentication
```
POST /api/auth/register/     # Public
POST /api/auth/login/        # Public
POST /api/auth/refresh/      # Public (requires refresh token)
```

### Books (Public Read)
```
GET  /api/books/             # List all books
GET  /api/books/{id}/        # Get book details
GET  /api/books/?search=term # Search books
GET  /api/books/?ordering=title # Sort books
```

### Notes (Authenticated)
```
GET    /api/notes/           # List user's notes
POST   /api/notes/           # Create note
PATCH  /api/notes/{id}/      # Update note
DELETE /api/notes/{id}/      # Delete note
```

## Development Workflow

### Adding New Features
1. **Backend**: Create model → serializer → view → URL
2. **Run migrations**: `python manage.py makemigrations && python manage.py migrate`
3. **Frontend**: Create service method → component → route
4. **Test**: Manual testing → Unit tests (optional)

### Common Development Tasks

**Reset database:**
```bash
rm db.sqlite3
python manage.py migrate
```

**Check for Django issues:**
```bash
python manage.py check
```

**View SQL for migrations:**
```bash
python manage.py sqlmigrate books 0001
```

**Django shell for debugging:**
```bash
python manage.py shell
>>> from books.models import Book
>>> Book.objects.all()
```

**React build for production:**
```bash
cd frontend
npm run build
```

## Troubleshooting

### Port Already in Use
```bash
# Find process on port
lsof -i :8000  # or :3000

# Kill process
kill -9 [PID]
```

### CORS Issues
- Ensure `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000`
- Check Django server is running on port 8000
- Verify proxy setting in frontend package.json

### Authentication Failures
- Check JWT token expiry in Django settings
- Verify localStorage has valid tokens (Browser DevTools → Application)
- Ensure @permission_classes([AllowAny]) on public endpoints

### Migration Errors
```bash
# Reset migrations
rm -rf */migrations/__pycache__
python manage.py makemigrations
python manage.py migrate
```

## Dependencies

### Backend (Python)
- **Django 4.2**: Web framework
- **djangorestframework 3.14**: REST API framework
- **djangorestframework-simplejwt 5.2**: JWT authentication
- **django-cors-headers 4.0**: CORS handling
- **django-filter**: QuerySet filtering

### Frontend (JavaScript)
- **React 18**: UI library
- **react-router-dom 6**: Client-side routing
- **axios 1.4**: HTTP client
- **react-scripts**: Build tooling

## Testing Checklist

- [ ] User registration with validation
- [ ] User login/logout flow
- [ ] Books display without authentication
- [ ] Book search functionality
- [ ] Book filtering by author
- [ ] Book sorting options
- [ ] Book detail view
- [ ] Note creation (authenticated)
- [ ] Note editing (authenticated)
- [ ] Note deletion (authenticated)
- [ ] Token refresh on expiry
- [ ] CORS functionality

## Performance Considerations

- **Pagination**: Not implemented, would be needed for large datasets
- **Caching**: No caching implemented, consider Redis for production
- **Database**: SQLite for development, use PostgreSQL for production
- **Static Files**: Not configured, use WhiteNoise or CDN for production

## Security Notes

- **SECRET_KEY**: Change in production
- **DEBUG**: Set to False in production
- **ALLOWED_HOSTS**: Configure for production domain
- **CORS**: Restrict to specific origins in production
- **HTTPS**: Required for production JWT usage