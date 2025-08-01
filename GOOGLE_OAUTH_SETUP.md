# Google OAuth Setup Guide

## The error you're seeing is expected - we need to configure Google OAuth credentials.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "Todo App"

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "ENABLE"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "CREATE CREDENTIALS" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" for testing
   - Fill in app name: "Todo App"
   - Add your email as developer contact
   - Skip optional fields for now
4. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Name: "Todo App Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000`

### Step 4: Get Your Credentials

After creating, you'll see:
- Client ID (starts with something like: 123456789-abcdef...)
- Client Secret

### Step 5: Update Environment Variables

Copy your Client ID and update the environment files:

#### Backend (.env):
```
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

#### Frontend (.env.local):
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-actual-client-id-here
```

### Step 6: Restart Both Servers

After updating the environment variables, restart both servers for changes to take effect.

## Temporary Solution: Test Without Google OAuth

For now, you can test the app using regular email/password authentication:
1. Click "Create account" instead of Google sign-in
2. Register with email/password
3. Test the todo functionality

The regular authentication should work perfectly while we set up Google OAuth.
