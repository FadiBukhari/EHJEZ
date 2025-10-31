# EHJEZ Project - Admin to Client Migration & Time-Based Booking System

## Summary of Changes

This document outlines all changes made to transform the EHJEZ room booking system from an "admin" role to a "client" role (representing study house owners) and implement time-based booking availability.

---

## 🔄 Key Changes Overview

### 1. **Role Renaming: Admin → Client**

- Changed user role from "admin" to "client" to better represent study house owners
- Updated all references throughout both backend and frontend

### 2. **Client Operating Hours**

- Clients can now set their study house opening and closing times
- These hours define when rooms can be booked
- Added fields: `openingHours` and `closingHours` (TIME type)

### 3. **Time-Based Room Availability**

- Rooms can now be booked by multiple users at different times on the same day
- System prevents overlapping bookings for the same room at the same date/time
- Bookings must fall within the client's operating hours

### 4. **Booking Validation**

- Checks for time overlaps before creating bookings
- Validates booking times against client's operating hours
- Prevents double-booking of rooms at the same time slot

---

## 📁 Backend Changes

### Models

#### `models/user.js`

```javascript
// CHANGED:
role: {
  type: DataTypes.ENUM("user", "client"),  // Was: ("user", "admin")
  defaultValue: "user",
  allowNull: false,
},
// ADDED:
openingHours: {
  type: DataTypes.TIME,
  allowNull: true,
  comment: "Store opening time (for clients only)",
},
closingHours: {
  type: DataTypes.TIME,
  allowNull: true,
  comment: "Store closing time (for clients only)",
},
```

#### `models/booking.js`

Already had time-based fields (no changes needed):

- `date`: DATEONLY
- `checkInTime`: TIME
- `checkOutTime`: TIME

### Middleware

#### `middlewares/authorizeClient.js` (NEW FILE)

```javascript
// Replaces authorizeAdmin.js
const authorizeClient = (req, res, next) => {
  if (req.user && req.user.role === "client") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Client only" });
};
```

### Controllers

#### `controllers/userController.js`

**Changes:**

- Registration now accepts `openingHours` and `closingHours`
- Validates that clients provide operating hours
- Profile editing allows clients to update their hours

#### `controllers/roomController.js`

**Changes:**

- `createRoom`: Validates that owner is a client and has set operating hours
- `getAllRooms`: Includes owner's operating hours in response
- Only clients can create/edit/delete rooms

#### `controllers/bookingController.js`

**Major Changes:**

- Added overlap detection for same room, date, and time
- Validates booking times are within client's operating hours
- Removed room status changes (rooms stay "available" for other time slots)
- Booking status update no longer changes room availability

**Overlap Detection Logic:**

```javascript
// Checks for any of these scenarios:
// 1. New booking starts during existing booking
// 2. New booking ends during existing booking
// 3. New booking completely contains existing booking
const overlappingBooking = await Booking.findOne({
  where: {
    roomId: id,
    date: date,
    status: { [Op.in]: ["pending", "approved"] },
    [Op.or]: [
      /* overlap conditions */
    ],
  },
});
```

### Routes

#### `routes/roomRoutes.js`

```javascript
// CHANGED: All admin middleware replaced with client
const authorizeClient = require("../middlewares/authorizeClient");

router.post("/", authenticateToken, authorizeClient, createRoom);
router.put("/:id", authenticateToken, authorizeClient, updateRoom);
router.delete("/:id", authenticateToken, authorizeClient, deleteRoom);
router.get("/owned", authenticateToken, authorizeClient, getOwnedRooms);
router.get("/bookedowned", authenticateToken, authorizeClient, getBookedRooms);
```

#### `routes/bookingRoutes.js`

```javascript
// CHANGED: booking status update route
router.put(
  "/:id/status",
  authenticateToken,
  authorizeClient,
  updateBookingStatus
);
```

---

## 🎨 Frontend Changes

### Path Updates

All routes changed from `/admin/*` to `/client/*`:

- `/admin/rooms` → `/client/rooms`
- `/admin/rooms/new` → `/client/rooms/new`
- `/admin/rooms/edit/:id` → `/client/rooms/edit/:id`
- `/admin/bookings` → `/client/bookings`

### Components

#### `App.jsx`

```jsx
// CHANGED: Import paths
import Rooms from "./pages/Clientpages/Rooms/Rooms";
import AddRoom from "./pages/Clientpages/AddRoom/AddRoom";
import EditRoom from "./pages/Clientpages/EditRoom/EditRoom";
import Bookings from "./pages/Clientpages/Bookings/Bookings";

// CHANGED: Routes
<Route path="/client/rooms" element={<Rooms />} />
<Route path="/client/rooms/new" element={<AddRoom />} />
<Route path="/client/rooms/edit/:id" element={<EditRoom />} />
<Route path="/client/bookings" element={<Bookings />} />
```

#### `components/NavBar/NavBar.jsx`

```jsx
// CHANGED: Role check
{
  user?.role == "client" && (
    <>
      <Link to="/client/rooms">Rooms</Link>
      <Link to="/client/bookings">Bookings</Link>
    </>
  );
}
```

#### `components/NavBar/ProfileModal.jsx`

```jsx
// CHANGED: Role check for My Bookings (clients don't see this)
{
  user?.role !== "client" ? <Link to="/mybookings">My Bookings</Link> : <></>;
}
```

### Pages

#### `pages/Publicpages/SignUp/SignUp.jsx`

**Added:**

- Account type selector (User vs Client)
- Opening hours input (for clients)
- Closing hours input (for clients)
- Conditional validation

```jsx
<select name="role" value={form.role} onChange={handleChange}>
  <option value="user">User (Book Rooms)</option>
  <option value="client">Client (Study House Owner)</option>
</select>;

{
  form.role === "client" && (
    <>
      <input type="time" name="openingHours" required />
      <input type="time" name="closingHours" required />
    </>
  );
}
```

#### `pages/Userpages/Profile/Profile.jsx`

**Added:**

- Opening hours field (edit mode for clients)
- Closing hours field (edit mode for clients)
- Save/Cancel buttons for hours

#### Client Pages (formerly Admin pages)

All files in `pages/Adminpages/*` updated:

- `AddRoom.jsx`: Navigate to `/client/rooms` after creation
- `EditRoom.jsx`: Navigate to `/client/rooms` after update/delete
- `Rooms.jsx`: Navigate to `/client/rooms/new` for new room
- `RoomCard.jsx`: Navigate to `/client/rooms/edit/:id` for editing

---

## 🗄️ Database Migration

### Running the Migration Script

**IMPORTANT:** You must run this migration script to update existing data:

```bash
cd project-uni-backend
node migrate-admin-to-client.js
```

### What the Migration Does:

1. Updates all existing 'admin' users to 'client' role
2. Drops old enum type `enum_Users_role`
3. Creates new enum with ('user', 'client')
4. Adds `openingHours` and `closingHours` columns
5. Applies new enum to role column

### Manual Alternative (PostgreSQL):

If the script fails, run these SQL commands manually:

```sql
-- 1. Update existing admin users
UPDATE "Users" SET role = 'client' WHERE role = 'admin';

-- 2. Convert to VARCHAR temporarily
ALTER TABLE "Users" ALTER COLUMN role TYPE VARCHAR(255);

-- 3. Drop old enum
DROP TYPE IF EXISTS "enum_Users_role";

-- 4. Create new enum
CREATE TYPE "enum_Users_role" AS ENUM ('user', 'client');

-- 5. Apply new enum
ALTER TABLE "Users"
ALTER COLUMN role TYPE "enum_Users_role"
USING role::"enum_Users_role";

-- 6. Add operating hours columns
ALTER TABLE "Users"
ADD COLUMN IF NOT EXISTS "openingHours" TIME,
ADD COLUMN IF NOT EXISTS "closingHours" TIME;
```

---

## 🚀 Testing the Changes

### 1. Test Client Registration

```
1. Go to /signup
2. Select "Client (Study House Owner)"
3. Fill in opening hours (e.g., 08:00)
4. Fill in closing hours (e.g., 22:00)
5. Complete registration
```

### 2. Test Room Creation

```
1. Log in as a client
2. Go to /client/rooms
3. Click "+ New Room"
4. Create a room
5. Verify room appears in list
```

### 3. Test Time-Based Booking

```
1. Log in as a user
2. Find a room
3. Book it for Date: 2025-11-01, Time: 10:00-12:00
4. Try to book same room for Date: 2025-11-01, Time: 11:00-13:00
5. Should fail with "already booked" message
6. Book for Time: 13:00-15:00 (should succeed)
```

### 4. Test Operating Hours Validation

```
1. Client sets hours: 09:00 - 17:00
2. User tries to book: 08:00-10:00 (should fail)
3. User tries to book: 16:00-18:00 (should fail)
4. User tries to book: 10:00-16:00 (should succeed)
```

---

## 📋 Manual Steps Required

### ⚠️ IMPORTANT: Folder Rename

Due to file permission restrictions, you must **manually rename** the folder:

```
project-uni-frontend/src/pages/Adminpages  →  Clientpages
```

**Steps:**

1. Close VS Code
2. Open Windows File Explorer
3. Navigate to: `L:\Projects\Fullstackweb\EHJEZ\project-uni-frontend\src\pages\`
4. Right-click `Adminpages` folder
5. Rename to `Clientpages`
6. Reopen VS Code

The code is already updated to import from `Clientpages`, but the folder itself needs to be renamed.

---

## 🔍 Key Features Summary

### For Clients (Study House Owners):

✅ Set business operating hours
✅ Add/edit/remove rooms
✅ View all bookings for their rooms
✅ Approve or decline booking requests
✅ Cancel bookings

### For Users (Students):

✅ Browse available rooms
✅ Book rooms at specific times
✅ Only see available time slots
✅ View their booking history
✅ System prevents double-booking

### System Features:

✅ Time-based availability checking
✅ Automatic overlap detection
✅ Operating hours enforcement
✅ Role-based access control
✅ Booking status management

---

## 🐛 Common Issues & Solutions

### Issue: "Access denied: Client only"

**Solution:** User is logged in with 'user' role. Need to register as client or update existing user role in database.

### Issue: "Room not available"

**Solution:** Check if room status is 'available', not 'maintenance' or 'inactive'.

### Issue: "This room is already booked for the selected time"

**Solution:** Another booking exists for that time slot. Choose a different time.

### Issue: "Booking times must be within operating hours"

**Solution:** Client hasn't set operating hours, or booking is outside those hours.

### Issue: Database enum error

**Solution:** Run the migration script: `node migrate-admin-to-client.js`

---

## 📝 API Changes Summary

### New Fields in Responses:

**GET /rooms/all** now includes:

```json
{
  "id": 1,
  "roomNumber": "101",
  "owner": {
    "id": 2,
    "username": "Study House A",
    "openingHours": "08:00:00",
    "closingHours": "22:00:00"
  }
}
```

**GET /users/profile** (for clients):

```json
{
  "id": 2,
  "username": "Study House A",
  "email": "client@example.com",
  "role": "client",
  "openingHours": "08:00:00",
  "closingHours": "22:00:00"
}
```

### New Validation Errors:

- `"Clients must provide opening and closing hours"` - During registration
- `"Only clients can create rooms"` - When non-client tries to add room
- `"Please set your business opening and closing hours in your profile first"` - Client without hours tries to create room
- `"This room is already booked for the selected time. Please choose a different time slot."` - Booking overlap detected
- `"Booking times must be within operating hours: HH:MM - HH:MM"` - Booking outside business hours

---

## ✅ Checklist

Before starting the server:

- [ ] Run database migration: `node migrate-admin-to-client.js`
- [ ] Manually rename `Adminpages` folder to `Clientpages`
- [ ] Update existing admin users to set opening/closing hours
- [ ] Clear browser cache/localStorage if login issues occur
- [ ] Restart backend server
- [ ] Restart frontend dev server

---

## 📞 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify database migration ran successfully
3. Ensure folder was renamed correctly
4. Check that .env file has correct database credentials
5. Verify all npm dependencies are installed

---

**Migration completed successfully! 🎉**

All "admin" references have been updated to "client", and the system now supports time-based room bookings with automatic overlap detection and operating hours validation.
