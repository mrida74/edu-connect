# How to Generate AUTH_SECRET

The AUTH_SECRET is a crucial security component for NextAuth.js that encrypts JWT tokens. Here are multiple ways to generate it:

## Method 1: Node.js (Recommended)
```bash
node -e "console.log('AUTH_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
```

## Method 2: PowerShell (Windows)
```powershell
$bytes = New-Object byte[] 32; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [System.Convert]::ToBase64String($bytes)
```

## Method 3: OpenSSL (if available)
```bash
openssl rand -base64 32
```

## Method 4: Online Generator
Visit: https://generate-secret.vercel.app/32

## Method 5: JavaScript in Browser Console
```javascript
window.crypto.getRandomValues(new Uint8Array(32)).reduce((acc, byte) => acc + String.fromCharCode(byte), '')
```

## Important Notes:

1. **Keep it Secret**: Never commit your actual AUTH_SECRET to version control
2. **32 Bytes Minimum**: Always use at least 32 bytes for security
3. **Different Per Environment**: Use different secrets for development, staging, and production
4. **Rotate Regularly**: Change your AUTH_SECRET periodically for better security

## Current Setup:
Your AUTH_SECRET has been added to your `.env` file. Make sure this file is in your `.gitignore` to prevent accidental commits.

## Usage in NextAuth:
```javascript
export default NextAuth({
  secret: process.env.AUTH_SECRET,
  // ... other configuration
})
```