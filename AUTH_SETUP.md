# Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Required: Authentication secret for NextAuth.js
# Generate a secure secret using: openssl rand -base64 32
AUTH_SECRET=your_generated_secret_here

# Required: Database environment name
ENVIRONMENT=educonnect

# Required: MongoDB connection string
MONGODB_URI=mongodb://localhost:27017

# Optional: NextAuth URL (required for production)
NEXTAUTH_URL=http://localhost:3000
```

## Generating AUTH_SECRET

The `AUTH_SECRET` is critical for security. Generate it using one of these methods:

### Method 1: OpenSSL (Recommended)
```bash
openssl rand -base64 32
```

### Method 2: Node.js
```javascript
require('crypto').randomBytes(32).toString('base64')
```

### Method 3: Online Generator
Visit: https://generate-secret.vercel.app/32

## Security Best Practices

1. **Never commit secrets to version control**
   - Add `.env.local` to your `.gitignore`
   - Use `.env.example` for documentation

2. **Use different secrets for different environments**
   - Development: Generate a test secret
   - Staging: Use a different secret
   - Production: Use a strong, unique secret

3. **Rotate secrets regularly**
   - Change AUTH_SECRET periodically
   - Update all environments when rotating

4. **Store secrets securely in production**
   - Use environment variable managers
   - Consider services like Vercel's environment variables

## Common Issues

- **"Invalid secret" error**: Make sure AUTH_SECRET is set and not empty
- **JWT errors**: Ensure the secret is consistent across restarts
- **Session issues**: Check that the secret hasn't changed unexpectedly