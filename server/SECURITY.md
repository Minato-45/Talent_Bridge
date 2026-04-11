# TalentBridge Security Configuration

## Environment Variables (Create .env file in server directory)

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/job_listing_portal

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Email Configuration (Optional - for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

## Security Features Implemented

### Password Security

- ✅ Minimum 8 characters
- ✅ Must contain uppercase letters (A-Z)
- ✅ Must contain lowercase letters (a-z)
- ✅ Must contain numbers (0-9)
- ✅ Must contain special characters (!@#$%^&*)
- ✅ Hashed with bcrypt (12 salt rounds)
- ✅ Never stored or transmitted in plain text

### Authentication & Authorization

- ✅ JWT (JSON Web Tokens) for stateless authentication
- ✅ 7-day token expiration
- ✅ Role-based access control (jobseeker, recruiter, admin)
- ✅ Secure token storage (localStorage)
- ✅ Automatic logout on token expiration
- ✅ Separate user collections (no mixing of seeker/recruiter data)

### Data Protection

- ✅ Password hashing (bcryptjs)
- ✅ Input sanitization (express-mongo-sanitize prevents NoSQL injection)
- ✅ Email verification flow ready
- ✅ Password reset with secure tokens
- ✅ No sensitive data in API responses
- ✅ No password stored in localStorage

### API Security

- ✅ HTTPS/TLS support (configure in production)
- ✅ CORS - restricted to configured origin
- ✅ Rate limiting: 20 requests per 15 minutes for auth routes
- ✅ Rate limiting: 100 requests per 15 minutes for other APIs
- ✅ Helmet security headers:
  - Content Security Policy (CSP)
  - X-Frame-Options (Clickjacking protection)
  - X-Content-Type-Options (MIME sniffing prevention)
  - X-XSS-Protection
  - HTTP Strict Transport Security (HSTS)
  - Referrer Policy
- ✅ Request body size limit (10KB) - prevents DoS attacks
- ✅ Generic error messages - don't reveal if email exists

### Frontend Security

- ✅ Password visibility toggle
- ✅ Password strength indicator
- ✅ Form validation before submission
- ✅ Secure token handling
- ✅ No credentials in URLs
- ✅ HTTPS enforced in production
- ✅ Auto-logout on suspicious activity
- ✅ Remember me uses sessionStorage (not persistent)

### Database Security

- ✅ MongoDB injection prevention
- ✅ Indexed queries on email and sensitive fields
- ✅ Password field excluded by default (select('+password') only when needed)
- ✅ Separate collections for jobseekers and recruiters
- ✅ Timestamps for audit trails (createdAt, updatedAt, lastLogin)

### Session Management

- ✅ Stateless JWT tokens
- ✅ Token stored in localStorage (secure for SPA)
- ✅ Automatic cleanup on logout
- ✅ Last login tracking
- ✅ Expired tokens auto-redirect to login

## Setup Instructions

### Environment Variables

```bash
# Copy example to actual .env
cp server/.env.example server/.env

# Edit server/.env with your configuration
# IMPORTANT: Change JWT_SECRET to a strong random string!
```

### HTTPS Configuration (Production)

```javascript
// For production, enable HTTPS:
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443);
```

### Configure Database Security

- Use MongoDB Atlas with:
  - Network access restrictions
  - IP whitelist
  - Strong database user passwords
  - No public access

### Deployment Security

- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Backup database regularly
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting in reverse proxy
- [ ] Set appropriate CSP headers

## Common Security Practices

### Password Reset Flow

1. User requests password reset
2. Server generates secure token
3. Token sent via email (not displayed)
4. Token expires in 30 minutes
5. User sets new password
6. All active sessions invalidated

### Email Verification

1. User registers account
2. Verification email sent
3. User clicks link with safe token
4. Account marked as verified
5. Can then access full features

### Secure Login

- Generic error messages
- Rate limiting blocks brute force attempts
- Timing attack resistant comparisons
- No user enumeration possible
- MFA/2FA ready (infrastructure in place)

## Testing Security

### Test Password Validation

```bash
# Should fail - weak password
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "password": "weak",
    "role": "jobseeker"
  }'

# Should succeed - strong password
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!",
    "role": "jobseeker"
  }'
```

### Test Rate Limiting

```bash
# Make 21 requests rapidly - 21st should fail
for i in {1..21}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"SecurePass123!"}'
done
```

## Future Enhancements

- [ ] Two-Factor Authentication (2FA)
- [ ] Social login integration (Google, LinkedIn)
- [ ] Audit logging for sensitive actions
- [ ] Session management dashboard
- [ ] Device tracking and login notifications
- [ ] Encrypted sensitive fields in database
- [ ] WAF (Web Application Firewall) integration
- [ ] Regular security audits
- [ ] Penetration testing

## Security Checklist

- [x] Strong password requirements
- [x] Password hashing (bcrypt)
- [x] HTTPS ready
- [x] CORS configured
- [x] Rate limiting
- [x] Input validation
- [x] MongoDB injection prevention
- [x] XSS protection
- [x] CSRF-ready with rate limiting
- [x] Secure token handling
- [x] Error handling (no info leaks)
- [x] Role-based access control
- [x] Email verification ready
- [x] Password reset ready
- [x] Separate user collections
- [x] No sensitive data in logs
- [x] Security headers (Helmet)
- [x] Request size limits

---

For security issues, please report to: [security@talentbridge.local](mailto:security@talentbridge.local)

Last Updated: April 6, 2026
