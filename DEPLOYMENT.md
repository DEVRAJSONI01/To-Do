# Deployment Guide for Todo App

## Step 1: Backend Deployment on Render

### 1.1 Prepare Backend for Production

1. Make sure your backend code is pushed to GitHub
2. Ensure all files are present:
   - `requirements.txt` (with gunicorn)
   - `config_production.py`
   - `Dockerfile` (optional)

### 1.2 Create Render Web Service

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- Name: `todo-app-backend`
- Runtime: `Python 3`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn --bind 0.0.0.0:$PORT run:app`

**Environment Variables:**
```
FLASK_ENV=production
SECRET_KEY=your-strong-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
CORS_ORIGINS=https://your-frontend-url.onrender.com
```

### 1.3 Add PostgreSQL Database

1. In your Render dashboard, go to your web service
2. Go to "Environment" tab
3. Add "PostgreSQL" add-on
4. The `DATABASE_URL` will be automatically set

### 1.4 Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://your-backend-name.onrender.com`

## Step 2: Frontend Deployment on Render

### 2.1 Prepare Frontend for Production

Update your `.env.local` file for production:
```
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### 2.2 Create Render Static Site

1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure the service:

**Basic Settings:**
- Name: `todo-app-frontend`
- Build Command: `cd frontend && npm install && npm run build`
- Publish Directory: `frontend/out`

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### 2.3 Deploy Frontend

1. Click "Create Static Site"
2. Wait for deployment to complete
3. Note your frontend URL: `https://your-frontend-name.onrender.com`

## Step 3: Configure Google OAuth

### 3.1 Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

### 3.2 Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://your-frontend-name.onrender.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://your-frontend-name.onrender.com` (for production)

### 3.3 Update Environment Variables

Update both backend and frontend with the OAuth credentials:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET` (backend only)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (frontend only)

## Step 4: Configure Email Service

### 4.1 Gmail App Password

1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings
3. Go to "Security" → "App passwords"
4. Generate an app password for "Mail"
5. Use this password as `MAIL_PASSWORD` in your backend environment variables

### 4.2 Alternative Email Services

You can also use other email services:
- **SendGrid**: More reliable for production
- **Mailgun**: Good for transactional emails
- **Amazon SES**: AWS email service

## Step 5: Update CORS Settings

Make sure to update your backend CORS settings to include your frontend URL:

In your backend environment variables:
```
CORS_ORIGINS=https://your-frontend-name.onrender.com
```

## Step 6: Testing the Deployment

### 6.1 Test Backend API

Visit your backend URL and test endpoints:
- `https://your-backend-name.onrender.com/api/auth/register`
- `https://your-backend-name.onrender.com/api/todos`

### 6.2 Test Frontend

1. Visit your frontend URL
2. Test user registration
3. Test login/logout
4. Test Google OAuth
5. Test todo creation (should send email)
6. Test todo CRUD operations

## Step 7: Post-Deployment Checklist

- [ ] Backend is accessible and returns proper responses
- [ ] Frontend loads and connects to backend API
- [ ] User registration works
- [ ] Email login works
- [ ] Google OAuth works
- [ ] Todo creation sends email notifications
- [ ] All CRUD operations work for todos
- [ ] Database persists data correctly

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check CORS_ORIGINS environment variable
2. **Database Connection**: Verify DATABASE_URL is set correctly
3. **Email Not Sending**: Check MAIL_* environment variables
4. **Google OAuth Fails**: Verify client ID and authorized domains
5. **API Not Responding**: Check build logs on Render

### Debugging Tips

1. Check Render logs for error messages
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check browser network tab for failed requests

## Production Optimizations

1. **Caching**: Add Redis for session caching
2. **CDN**: Use Cloudflare for static assets
3. **Monitoring**: Add application monitoring
4. **Backup**: Regular database backups
5. **SSL**: Ensure HTTPS is enabled (automatic on Render)

## Costs

**Render Free Tier Limits:**
- Web Services: Sleep after 15 minutes of inactivity
- Static Sites: Unlimited
- PostgreSQL: 1GB storage, 1 month retention

**Paid Plans:** Start at $7/month for persistent web services
