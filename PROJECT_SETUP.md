# InnoFlow Project Setup Guide

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Overview](#project-overview)
- [Database Setup (PostgreSQL)](#database-setup-postgresql)
- [Backend Setup (Django)](#backend-setup-django)
- [Frontend Setup (Next.js)](#frontend-setup-nextjs)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software
- **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **PostgreSQL 14+** - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Redis** - [Download Redis](https://redis.io/download) (for Celery task queue)
- **Git** - [Download Git](https://git-scm.com/downloads)

### Optional but Recommended
- **pgAdmin** - PostgreSQL administration tool
- **VS Code** - Code editor with Python and TypeScript extensions
- **Postman** - API testing tool

## 🏗️ Project Overview

InnoFlow is a full-stack AI workflow platform with:
- **Backend**: Django REST API with PostgreSQL
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Task Queue**: Celery with Redis
- **AI Integration**: OpenAI, Anthropic, HuggingFace

## 🗄️ Database Setup (PostgreSQL)

### 1. Install PostgreSQL

#### Windows
```bash
# Download installer from https://www.postgresql.org/download/windows/
# During installation, remember your postgres user password
```

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

```bash
# Connect to PostgreSQL as postgres user
sudo -u postgres psql

# Or on Windows, use Command Prompt:
psql -U postgres
```

In the PostgreSQL shell:
```sql
-- Create database
CREATE DATABASE innoflow_db;

-- Create user
CREATE USER innoflow_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE innoflow_db TO innoflow_user;
ALTER USER innoflow_user CREATEDB;

-- Exit PostgreSQL shell
\q
```

### 3. Verify Database Connection
```bash
psql -h localhost -U innoflow_user -d innoflow_db
```

## 🐍 Backend Setup (Django)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd know
```

### 2. Create Virtual Environment
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create Environment File
Create `.env` file in the `backend` directory:
```env
# Database Configuration
DB_NAME=innoflow_db
DB_USER=innoflow_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# Django Settings
SECRET_KEY=your-super-secret-django-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 5. Run Database Migrations
```bash
# Make sure you're in the backend directory with activated virtual environment
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser
```bash
python manage.py createsuperuser
```

### 7. Test Backend
```bash
python manage.py runserver
```
Visit: http://localhost:8000/admin/

## ⚛️ Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory
```bash
cd ../frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create `.env.local` file in the `frontend` directory:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Test Frontend
```bash
npm run dev
```
Visit: http://localhost:3000

## 🔐 Environment Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:8000/accounts/google/login/callback/`
6. Copy Client ID and Client Secret to your `.env` files

### Redis Setup

#### Windows
```bash
# Download Redis for Windows or use WSL
# Or use Docker:
docker run -d -p 6379:6379 redis:alpine
```

#### macOS
```bash
brew install redis
brew services start redis
```

#### Linux
```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## 🚀 Running the Application

### Development Mode

1. **Start Redis** (in a separate terminal):
```bash
redis-server
```

2. **Start Backend** (in backend directory):
```bash
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Start Django server
python manage.py runserver
```

3. **Start Celery Worker** (in another terminal, backend directory):
```bash
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Start Celery worker
celery -A InnoFlow worker --loglevel=info
```

4. **Start Frontend** (in frontend directory):
```bash
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/swagger/

## 🔄 Development Workflow

### Backend Development
```bash
# Create new migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Run tests
python manage.py test

# Create new Django app
python manage.py startapp app_name
```

### Frontend Development
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Verify database exists
psql -U innoflow_user -d innoflow_db -c "\l"
```

#### Redis Connection Error
```bash
# Check Redis is running
redis-cli ping
# Should return "PONG"
```

#### Module Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check Python path
python -c "import sys; print(sys.path)"
```

#### Frontend Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall node modules
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Loading
- Ensure `.env` files are in correct directories
- Check file names: `.env` for backend, `.env.local` for frontend
- Restart development servers after changing environment variables

### Getting Help

1. **Check Logs**: Look at Django and Next.js console outputs
2. **Database Issues**: Check PostgreSQL logs
3. **API Issues**: Use browser dev tools or Postman
4. **Authentication Issues**: Verify OAuth configuration

### Useful Commands

```bash
# Backend
python manage.py shell  # Django shell
python manage.py dbshell  # Database shell
python manage.py collectstatic  # Collect static files

# Frontend
npm run build  # Production build
npm run start  # Production server
npm run type-check  # TypeScript checking

# Database
psql -U innoflow_user -d innoflow_db  # Connect to database
pg_dump -U innoflow_user innoflow_db > backup.sql  # Backup database
```

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Team Guidelines

1. **Code Style**: Follow PEP 8 for Python, ESLint for TypeScript
2. **Commits**: Use conventional commit messages
3. **Testing**: Write tests for new features
4. **Documentation**: Update README when adding new features
5. **Environment**: Never commit `.env` files
6. **Dependencies**: Update requirements.txt/package.json when adding packages

---

**Happy Coding! 🚀**

For questions or issues, please create an issue in the repository or contact the development team. 