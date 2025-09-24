# OAuth Credentials Setup Instructions

## 🔑 Copy your actual credentials here:

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_actual_secret_here

# GitHub OAuth (from GitHub Developer Settings)  
GITHUB_ID=Iv1.your_actual_github_client_id
GITHUB_SECRET=your_actual_github_client_secret_here

## 📋 Quick Setup URLs:
# Google: https://console.cloud.google.com/apis/credentials
# GitHub: https://github.com/settings/developers

## 🔗 Redirect URLs to use:
# Development: http://localhost:3000/api/auth/callback/[provider]
# Production: https://yourdomain.com/api/auth/callback/[provider]

## ⚠️ Important Notes:
# 1. Never commit real credentials to git
# 2. Use different credentials for development/production
# 3. Keep these secrets secure
# 4. Rotate credentials periodically for security