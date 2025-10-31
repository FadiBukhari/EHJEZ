# Security Measures - EHJEZ Platform

## Account Creation Security

### Public Registration (SignUp)

- **Limited to User Accounts Only**: All public registrations through `/signup` are automatically assigned the `user` role.
- **No Role Selection**: The account type dropdown has been removed from the registration form.
- **Backend Enforcement**: The backend strictly validates and rejects any attempts to create `client` or `admin` accounts through the public registration endpoint.

### Client Account Creation

- **Admin-Only Access**: Client (Study House Owner) accounts can ONLY be created by administrators.
- **Dedicated Admin Interface**: Admins use the `/admin/clients/new` page to create client accounts.
- **Required Information for Clients**:
  - Username (Study House Name)
  - Email
  - Password (min 6 characters)
  - Phone Number
  - Opening Hours (optional)
  - Closing Hours (optional)

### Admin Account Creation

- **Database-Level Only**: Admin accounts cannot be created through any web interface.
- **Manual Creation Required**: Must be created directly in the database or through secure backend scripts.

## Security Implementation

### Frontend Security

1. **SignUp.jsx**
   - Removed role selection dropdown
   - Removed client-specific fields (opening/closing hours)
   - Hardcoded role as "user" in registration request
2. **Admin Panel**
   - Dedicated client management interface at `/admin/clients`
   - Add, Edit, Delete client accounts
   - View client statistics and associated rooms/bookings

### Backend Security

#### 1. Public Registration Endpoint (`POST /users/register`)

```javascript
// Location: controllers/userController.js - addUser()
// Security measures:
- Validates role parameter
- Rejects any role other than "user"
- Forces role to "user" regardless of client request
- Returns 403 Forbidden for client/admin role attempts
```

#### 2. Admin Client Creation Endpoint (`POST /admin/clients`)

```javascript
// Location: controllers/adminController.js - createClient()
// Protected by:
- authenticateToken middleware (JWT validation)
- authorizeAdmin middleware (role === "admin")
```

#### 3. Middleware Protection

```javascript
// All admin routes protected by:
router.use(authenticateToken, authorizeAdmin);

// authorizeAdmin checks:
if (req.user && req.user.role === "admin") {
  return next();
}
return res.status(403).json({ message: "Access denied: Admin only" });
```

## API Endpoints Security Matrix

| Endpoint             | Method | Access     | Purpose                  |
| -------------------- | ------ | ---------- | ------------------------ |
| `/users/register`    | POST   | Public     | Create user account only |
| `/users/login`       | POST   | Public     | User authentication      |
| `/admin/clients`     | GET    | Admin Only | List all clients         |
| `/admin/clients`     | POST   | Admin Only | Create client account    |
| `/admin/clients/:id` | PUT    | Admin Only | Update client account    |
| `/admin/clients/:id` | DELETE | Admin Only | Delete client account    |
| `/admin/stats`       | GET    | Admin Only | Platform statistics      |

## Security Best Practices Implemented

### 1. Role-Based Access Control (RBAC)

- Three distinct roles: `user`, `client`, `admin`
- Middleware enforcement at route level
- JWT token includes role information

### 2. Input Validation

- Email format validation (regex)
- Password strength (min 6 characters)
- Required field validation
- Duplicate username/email checks

### 3. Password Security

- Passwords hashed using bcrypt (10 salt rounds)
- Never stored or transmitted in plain text
- Password excluded from API responses

### 4. Authentication

- JWT tokens with 1-hour expiration
- Token required for all protected routes
- Token includes user ID, role, and email

### 5. Authorization

- Separate middleware for admin and client roles
- Route-level protection
- Cascading permission checks

## Protected Routes

### Admin Routes (`/admin/*`)

- Requires valid JWT token
- Requires `role === "admin"`
- 403 Forbidden for non-admin users

### Client Routes (`/client/*`)

- Requires valid JWT token
- Requires `role === "client"`
- 403 Forbidden for non-client users

### User Routes

- Requires valid JWT token
- Available to authenticated users

## Error Handling

### Security-Related Errors

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist

### Client-Friendly Messages

- Generic error messages prevent information disclosure
- Detailed errors logged server-side only
- No stack traces sent to client in production

## Future Security Recommendations

1. **Rate Limiting**: Implement rate limiting on registration and login endpoints to prevent brute force attacks
2. **Email Verification**: Add email verification for new user registrations
3. **Password Reset**: Implement secure password reset functionality
4. **2FA**: Consider two-factor authentication for admin accounts
5. **Audit Logging**: Log all admin actions (create/update/delete clients)
6. **Session Management**: Implement token refresh mechanism
7. **Password Policy**: Enforce stronger password requirements (uppercase, lowercase, numbers, symbols)
8. **Account Lockout**: Lock accounts after multiple failed login attempts

## Testing Security

### Test Cases

1. ✅ Attempt to register with `role: "client"` → Should fail with 403
2. ✅ Attempt to register with `role: "admin"` → Should fail with 403
3. ✅ Access `/admin/clients` without token → Should fail with 401
4. ✅ Access `/admin/clients` with user token → Should fail with 403
5. ✅ Create client through admin interface → Should succeed
6. ✅ Public registration → Should create user account only

## Conclusion

The EHJEZ platform now implements a secure, role-based account creation system where:

- Regular users can self-register
- Client accounts are created exclusively by administrators
- Admin accounts are created at the database level
- All endpoints are properly secured with authentication and authorization
- Input is validated and sanitized
- Passwords are securely hashed

This ensures that study house owners (clients) are properly vetted before being granted access to create and manage rooms on the platform.
