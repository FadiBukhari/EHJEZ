# Account Security Update - Migration Guide

## Changes Summary

### What Changed?

We've implemented enhanced security measures to control account creation:

1. **Public Registration** now creates **User accounts ONLY**
2. **Client accounts** (Study House Owners) can ONLY be created by **Admins**
3. **Admin accounts** can only be created at the database level

### Why This Change?

- Ensures study house owners are properly vetted before joining the platform
- Prevents unauthorized users from creating client accounts
- Improves overall platform security and trust
- Gives admins full control over who can list rooms

## For Existing Data

### If You Have Existing Client Accounts

✅ **No action needed!** Existing client accounts will continue to work normally.

### If You Need to Migrate Data

The system will work with your current database without any schema changes. The security updates only affect how NEW accounts are created.

## For Administrators

### How to Create a New Client Account

1. **Login as Admin**

   - Navigate to `/signin`
   - Use your admin credentials

2. **Access Client Management**

   - Go to Admin Dashboard: `/admin/dashboard`
   - Click "Manage Clients" or navigate to `/admin/clients`

3. **Add New Client**

   - Click "Add New Client" button
   - Fill in required information:
     - Study House Name
     - Email
     - Password (min 6 characters)
     - Phone Number
     - Opening Hours
     - Closing Hours

4. **Client Account Ready**
   - The client can now login with their credentials
   - They can add rooms, manage bookings, and access all client features

### Client Management Features

#### View All Clients

- **Endpoint**: `/admin/clients`
- **Features**:
  - See all registered clients
  - View room count per client
  - View booking count per client
  - Sort and filter options

#### Edit Client Details

- **Endpoint**: `/admin/clients/:id/edit`
- **Editable Fields**:
  - Study House Name
  - Email
  - Phone Number
  - Operating Hours
- **Note**: Passwords cannot be changed through this interface (use password recovery)

#### Delete Client

- **Protection**: Cannot delete clients with active bookings
- **Cascade**: Deleting a client will remove their rooms and completed bookings
- **Warning**: This action is irreversible

## For Users

### New User Registration

Users can still register freely at `/signup`:

- Enter username, email, password
- Provide phone number
- Create account and start booking rooms immediately

### Becoming a Client

If you own a study house and want to list rooms:

1. Register as a regular user first (optional)
2. Contact the platform administrator
3. Admin will create your client account
4. Login with your new client credentials
5. Start adding your rooms!

## Security Features

### Backend Protection

```javascript
// Public registration - automatically enforces user role
POST /users/register
- Accepts: username, email, password, phoneNumber
- Rejects: any role other than "user"
- Returns: 403 Forbidden if attempting client/admin creation

// Admin-only client creation
POST /admin/clients
- Requires: Valid JWT token
- Requires: role === "admin"
- Returns: 403 Forbidden for non-admin users
```

### Middleware Stack

```
Request → authenticateToken → authorizeAdmin → Controller
         (verify JWT)        (verify role)     (execute)
```

## Testing the Changes

### Test Case 1: Public User Registration ✅

```bash
POST http://localhost:5000/users/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "role": "user"
}
# Expected: Success - User account created
```

### Test Case 2: Attempt Client Registration (Should Fail) ❌

```bash
POST http://localhost:5000/users/register
{
  "username": "testclient",
  "email": "client@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "role": "client"
}
# Expected: 403 Forbidden - Client accounts require admin creation
```

### Test Case 3: Admin Creates Client ✅

```bash
POST http://localhost:5000/admin/clients
Headers: { Authorization: "Bearer <admin_jwt_token>" }
{
  "username": "Study House XYZ",
  "email": "owner@studyhouse.com",
  "password": "securepass123",
  "phoneNumber": "9876543210",
  "openingHours": "08:00",
  "closingHours": "22:00"
}
# Expected: Success - Client account created by admin
```

### Test Case 4: Non-Admin Attempts Client Creation (Should Fail) ❌

```bash
POST http://localhost:5000/admin/clients
Headers: { Authorization: "Bearer <user_jwt_token>" }
{...}
# Expected: 403 Forbidden - Admin access required
```

## Rollback (If Needed)

If you need to temporarily revert to the old system:

1. **Frontend**: Restore the role selection dropdown in `SignUp.jsx`
2. **Backend**: Remove the role validation in `userController.js - addUser()`

However, this is NOT recommended as it compromises platform security.

## Support

### For Administrators

- Refer to `SECURITY_MEASURES.md` for complete security documentation
- Check `adminController.js` for API implementation details
- Review `adminRoutes.js` for available endpoints

### For Developers

- Review the middleware: `authenticateToken.js`, `authorizeAdmin.js`
- Check the User model for role enum values
- Test all endpoints with Postman or similar tool

### Common Issues

**Issue**: Admin can't create clients

- **Check**: Ensure JWT token is valid and not expired
- **Check**: Verify admin role is set correctly in database
- **Fix**: Re-login to get fresh token

**Issue**: User sees 403 when trying to register

- **Check**: Ensure they're not sending a role parameter
- **Check**: Verify backend is running and database is connected
- **Fix**: Use the updated SignUp form without role selection

**Issue**: Client account needs password reset

- **Solution**: Implement password recovery feature (future enhancement)
- **Temporary**: Admin can edit the password directly in database

## Next Steps

1. ✅ Update all admin accounts to use the new client management interface
2. ✅ Inform existing clients about the security improvements
3. ✅ Test the registration flow end-to-end
4. 📋 Consider implementing email verification for new users
5. 📋 Add audit logging for admin actions
6. 📋 Implement password recovery feature

---

**Last Updated**: November 1, 2025  
**Version**: 1.0  
**Status**: Production Ready
