# ContractorHub - Quotation Management Portal

A comprehensive web portal built with FastAPI and PostgreSQL that enables contractors and companies to create profiles, showcase projects, and manage quotation requests.

## 🚀 Features

### Authentication System
- ✅ Custom email/password authentication
- ✅ OAuth integration (Google & GitHub)
- ✅ Secure session management
- ✅ JWT token-based API access
- ✅ Password hashing with Argon2
- ✅ Role-based access control

### User Management
- ✅ User registration and login
- ✅ Profile management
- ✅ Avatar upload (Base64 storage)
- ✅ Email verification
- ✅ Account activation/deactivation

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Database (Supabase compatible)
- **SQLAlchemy** - ORM with declarative models
- **Alembic** - Database migrations
- **Pydantic** - Data validation and serialization
- **Authlib** - OAuth integration
- **Argon2** - Password hashing

### Database
- **PostgreSQL** - Primary database
- **Redis** - Session storage (optional)
- **Base64** - File storage in database

## 📁 Project Structure

```
contractor_portal/
├── app/
│   ├── api/
│   │   ├── deps.py          # Dependencies & auth
│   │   │── v1/
│   │   │    ├── __init__.py  
│   │   │    ├── auth.py       # Authentication routes
│   │   │    ├── users.py      # User management routes
│   │   │    ├── contractor.py # Contractor routes
│   │   │    ├── inventory.py  # inventory routes
|   |   │    └── quotation/    # Quotation routes
│   │   │       ├── __init__.py  
│   │   │       └──  quote.py  
│   ├── core/
│   │   ├── __init__.py      # Init file settings
│   │   ├── config.py        # Configuration settings
│   │   ├── database.py      # Database connection
│   │   └── security.py      # Security utilities
│   │   └── types.py         # Input HTTP URL Supports
│   ├── models/
│   │   ├── __init__.py      # Init file
│   │   ├── base.py          # Base model class
│   │   ├── contractor.py    # Contractor model
│   │   ├── inventory.py     # inventory model
│   │   ├── quotation.py     # quotation model
│   │   ├── user.py          # User model
│   │   └── session.py       # Session model 
│   ├── schemas/
│   │   ├── __init__.py      # Init file
│   │   ├── auth.py          # Auth request/response schemas
│   │   ├── contractor.py    # Contractor schemas
│   │   ├── inventory.py     # inventory schemas
│   │   ├── quotation.py     # quotation schemas
│   │   └── user.py          # User schemas
│   ├── services/
│   │   ├── __init__.py      # Init file
│   │   ├── auth_service.py  # Authentication business logic
│   │   ├── user_service.py  # User management logic
│   │   └── oauth_service.py # OAuth integration
│   ├── utils/
│   │   ├── __init__.py      # Init file
│   │   └── helpers.py       # Utility functions
│   └── main.py              # FastAPI application
├── alembic/
│   ├── versions/            # Migration files
│   └── env.py               # Alembic configuration
├── tests/                   # Test files
├── .env                     # Environment variables
├── requirements.txt         # Python dependencies
├── alembic.ini             # Alembic configuration
├── setup.py                # Project setup script
├── run.py                  # Development server script
└── README.md               # This file
```

## 🚦 Quick Start

### 1. Automated Setup (Recommended)

```bash
# Clone the project files to your directory
# Run the setup script
python setup.py

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

### 2. Manual Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Initialize database migrations
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Run migrations
alembic upgrade head
```

### 3. Configuration

Edit `.env` file with your settings:

```env
# Database - Update with your Supabase PostgreSQL URL
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres

# Authentication
SECRET_KEY=your-super-secret-key-here

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 4. Run the Application

```bash
# Development server with auto-reload
python run.py

# Or manually with uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access the API

- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login with email/password |
| POST | `/api/v1/auth/logout` | Logout user |
| GET | `/api/v1/auth/me` | Get current user info |
| GET | `/api/v1/auth/oauth/{provider}` | Initiate OAuth login |
| GET | `/api/v1/auth/oauth/{provider}/callback` | OAuth callback |
| POST | `/api/v1/auth/refresh` | Refresh access token |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/profile` | Get user profile |
| PUT | `/api/v1/users/profile` | Update user profile |
| POST | `/api/v1/users/upload-avatar` | Upload user avatar |
| DELETE | `/api/v1/users/avatar` | Delete user avatar |

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'company',
    avatar_data TEXT,
    avatar_mimetype VARCHAR(100),
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Development Commands

```bash
# Run development server
python run.py

# Run migrations
python run.py migrate

# Create new migration
alembic revision --autogenerate -m "Description"

# Run specific migration
alembic upgrade head

# Downgrade migration
alembic downgrade -1

# Check current migration
alembic current

# View migration history
alembic history

# Start Python shell with app context
python run.py shell
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run tests in verbose mode
pytest -v
```

## 📦 Docker Support

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 🔒 Security Features

### Password Security
- **Argon2** hashing algorithm
- **Salt** automatic generation
- **bcrypt** fallback support

### Session Management
- **Secure tokens** with crypto-random generation
- **Expiration tracking** with automatic cleanup
- **IP address** and user agent logging
- **Multiple session** support

### API Security
- **JWT tokens** for stateless authentication
- **CORS configuration** for cross-origin requests
- **Input validation** with Pydantic schemas
- **SQL injection** prevention with ORM

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `SECRET_KEY` | JWT signing key | Auto-generated |
| `ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration | 1440 (24h) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Optional |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Optional |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | Optional |
| `REDIS_URL` | Redis connection string | Optional |
| `MAX_FILE_SIZE` | Max upload size in bytes | 10485760 (10MB) |
| `DEBUG` | Enable debug mode | True |

## 📋 Requirements

- **Python** 3.8+
- **PostgreSQL** 12+
- **Redis** 6+ (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run tests and linting
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the [API documentation](http://localhost:8000/docs)
2. Review the [GitHub issues](https://github.com/your-repo/issues)
3. Contact the development team

## 🎯 Next Steps

This authentication system provides the foundation for:

1. **Contractor Profiles** - Company information and portfolios
2. **Project Showcase** - Before/after galleries with media
3. **Quotation System** - Request and response management
4. **Communication** - Built-in messaging between clients and contractors
5. **Reviews & Ratings** - Feedback system
6. **Search & Discovery** - Find contractors by location and services