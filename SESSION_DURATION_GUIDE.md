// Session Duration Configuration Guide

## ⏰ Login Duration Options:

### 🕐 Short Duration (High Security):
```javascript
session: {
  maxAge: 1 * 24 * 60 * 60,     // 1 day
}
```
**Good for:** Banking, Admin panels, Sensitive data

### 🕕 Medium Duration (Balanced):
```javascript
session: {
  maxAge: 7 * 24 * 60 * 60,     // 7 days ✅ CURRENT
}
```
**Good for:** Educational platforms, E-commerce, General apps

### 🕘 Long Duration (Convenience):
```javascript
session: {
  maxAge: 30 * 24 * 60 * 60,    // 30 days
}
```
**Good for:** Social media, Content platforms, News sites

### 🕛 Very Long Duration (Maximum Convenience):
```javascript
session: {
  maxAge: 90 * 24 * 60 * 60,    // 90 days
}
```
**Good for:** Personal apps, Learning platforms, Entertainment

## 📱 Browser Behavior:

### ✅ Session Persists When:
- Browser closed and reopened
- Computer restart
- Tab closed and reopened
- Network disconnection/reconnection
- Browser updates (usually)

### ❌ Session Lost When:
- Duration expires (7 days in our case)
- Manual logout
- Browser cookies cleared
- Browser data reset
- Incognito/Private browsing ends

## 🎯 Educational Platform Recommendations:

### 👨‍🎓 Student Accounts:
```javascript
maxAge: 7 * 24 * 60 * 60,      // 7 days (weekly re-login)
```
**Reason:** Balance between convenience and security

### 👨‍🏫 Teacher Accounts:
```javascript
maxAge: 3 * 24 * 60 * 60,      // 3 days (more frequent)
```
**Reason:** Access to sensitive student data

### 👑 Admin Accounts:
```javascript
maxAge: 1 * 24 * 60 * 60,      // 1 day (daily login)
```
**Reason:** Highest security for system access

## 🔄 Session Extension:

### Auto-Extension on Activity:
```javascript
// Every time user is active, session can be extended
callbacks: {
  jwt({ token, user }) {
    // Extend session if user is active
    if (user) {
      token.lastActivity = Date.now()
    }
    return token
  }
}
```

### Manual Session Extension:
```javascript
// Force session refresh
const { data: session, update } = useSession()
await update() // Extends session duration
```

## 📊 Duration Comparison:

| Duration | Security | Convenience | Best For |
|----------|----------|-------------|-----------|
| 1 day | Very High | Low | Banking, Admin |
| **7 days** | **Good** | **High** | **Education** ✅ |
| 30 days | Medium | Very High | Social Media |
| 90 days | Low | Maximum | Personal Apps |

## 🛡️ Security Considerations:

### Shorter Duration (1-7 days):
- ✅ Better security (frequent re-authentication)
- ✅ Limits exposure if device stolen
- ❌ More frequent login required

### Longer Duration (30+ days):
- ✅ Better user experience  
- ✅ Less login friction
- ❌ Higher security risk
- ❌ Longer exposure if compromised

## 🎯 Current Setting Analysis:

**7 Days Duration:**
- ✅ Good balance for educational platform
- ✅ Students don't need to login daily  
- ✅ Weekly re-authentication maintains security
- ✅ Reasonable for course access patterns

## 💡 Pro Tips:

### Remember Login Duration:
- Browser storage keeps session alive
- Computer restart won't log you out
- Only duration expiry or manual logout ends session

### Extend Session:
- Simply use the app (automatic extension in some setups)
- Visit any protected page before expiry
- Manual refresh can extend in some configurations