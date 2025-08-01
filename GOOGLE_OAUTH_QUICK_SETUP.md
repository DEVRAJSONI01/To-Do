# 🚀 GOOGLE OAUTH SETUP - QUICK GUIDE

## Your app already has Google OAuth built-in, just needs credentials!

### Step 1: Get Google OAuth Credentials
1. Go to: https://console.cloud.google.com/
2. Create new project: "Todo App"
3. Enable "Google Identity" API
4. Create OAuth 2.0 Client ID:
   - Type: Web application
   - Origins: http://localhost:3000
   - Redirect: http://localhost:3000

### Step 2: Update Environment Files

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-real-client-id.apps.googleusercontent.com
```

**Backend (.env):**
```bash
GOOGLE_CLIENT_ID=your-real-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-real-client-secret
```

### Step 3: Servers will auto-restart
Both servers will automatically restart when you save the files.

## 🎯 FOR NOW - TEST WITHOUT GOOGLE OAUTH
Your app is fully functional with regular authentication!
Just use email/password to test all features.
