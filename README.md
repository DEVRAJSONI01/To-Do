# Todo App - Full Stack Application

A complete todo application built with Flask (Python) backend and Next.js (React) frontend.

## Features

- ✅ User authentication with JWT tokens
- ✅ Google OAuth sign-in
- ✅ CRUD operations for todos
- ✅ Email notifications when todos are created
- ✅ Responsive design with Tailwind CSS
- ✅ SQLite for development, PostgreSQL for production

## Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Authentication**: JWT tokens + Google OAuth
- **Email**: Flask-Mail
- **CORS**: Flask-CORS

### Frontend
- **Framework**: Next.js 15 (React)
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Local Development Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables in `.env`:
```bash
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///todoapp.db
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

5. Run the development server:
```bash
python run.py
```

Backend will be available at: http://localhost:5001

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

4. Run the development server:
```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

## Production Deployment

### Backend Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn --bind 0.0.0.0:$PORT run:app`
5. Add environment variables:
   - `FLASK_ENV=production`
   - `SECRET_KEY=your-production-secret-key`
   - `JWT_SECRET_KEY=your-production-jwt-secret`
   - `DATABASE_URL` (auto-configured by Render PostgreSQL)
   - `MAIL_USERNAME=your-email@gmail.com`
   - `MAIL_PASSWORD=your-app-password`
   - `GOOGLE_CLIENT_ID=your-google-client-id`
   - `GOOGLE_CLIENT_SECRET=your-google-client-secret`
   - `CORS_ORIGINS=https://your-frontend-domain.com`

### Frontend Deployment on Render

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/out`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id`

### Database Setup

1. Add PostgreSQL database to your Render backend service
2. The `DATABASE_URL` will be automatically configured

### Email Setup

1. Create an App Password in your Gmail account
2. Use the App Password as `MAIL_PASSWORD` in environment variables

### Google OAuth Setup

1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://your-frontend-domain.com` (production)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/todos/:id` - Get specific todo

## Project Structure

```
project/
├── backend/
│   ├── routes/
│   │   ├── auth.py
│   │   └── todos.py
│   ├── models.py
│   ├── config.py
│   ├── config_production.py
│   ├── app.py
│   ├── run.py
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── context/
    │   ├── lib/
    │   └── types/
    ├── package.json
    └── next.config.ts
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Environment variable configuration
- Google OAuth integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
