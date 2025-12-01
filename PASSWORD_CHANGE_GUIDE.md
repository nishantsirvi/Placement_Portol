# Settings & Password Change Feature

## Overview
Students (and all users) can now manage their account settings and change their password through a dedicated Settings page.

---

## Features Implemented ✅

### 1. Settings Page (`/settings`)
- **Two Tabs**: Profile and Password
- **Clean UI**: Modern, user-friendly interface
- **Real-time Feedback**: Success/error messages
- **Validation**: Client and server-side validation

### 2. Profile Management
Users can update:
- ✅ First Name
- ✅ Last Name
- ✅ Email
- ✅ Phone Number

**Read-only fields** (cannot be changed):
- Username (enrollment number for students)
- Role (STUDENT, ADMIN, COMPANY)

### 3. Password Change
Secure password change with:
- ✅ Current password verification
- ✅ New password (min 8 characters)
- ✅ Confirm new password
- ✅ Password strength tips
- ✅ Automatic logout prevention

---

## How to Access

### For Students:
1. **Login** with credentials provided by admin
2. Click **user profile icon** in top-right navbar
3. Select **"⚙️ Settings"** from dropdown
4. Choose either **Profile** or **Password** tab

### Direct URL:
```
http://localhost:3000/settings
```

---

## Password Change Process

### Step-by-Step:

1. **Navigate to Settings**
   - Click user icon → Settings → Password tab

2. **Fill in the form**:
   ```
   Current Password: [your current password]
   New Password: [minimum 8 characters]
   Confirm New Password: [must match new password]
   ```

3. **Submit**
   - Click "Change Password" button
   - ✅ Success: "Password changed successfully!"
   - ❌ Error: Shows specific error message

4. **Validation Rules**:
   - ✅ Old password must be correct
   - ✅ New password minimum 8 characters
   - ✅ New passwords must match
   - ✅ New password can't be same as old (Django default)

### Example Scenario:

**Student John** (created by admin):
- **Initial Login**:
  - Username: `2021cse001`
  - Password: `john001` (auto-generated)

- **First Login Action**:
  1. Go to Settings → Password tab
  2. Current Password: `john001`
  3. New Password: `MySecure@Pass123`
  4. Confirm: `MySecure@Pass123`
  5. Click "Change Password"
  6. ✅ Success! Next login use new password

---

## Profile Update Process

### Editable Information:

1. **Navigate to Settings**
   - Click user icon → Settings → Profile tab

2. **Update fields**:
   - First Name
   - Last Name
   - Email (must be unique)
   - Phone Number

3. **Submit**
   - Click "Update Profile" button
   - ✅ Success: Changes saved immediately

### Validation:
- ✅ Email must be valid format
- ✅ Email must be unique (not used by another user)
- ✅ First name is required

---

## Technical Implementation

### Frontend (`Settings.jsx`)

**Components**:
```jsx
- Profile Tab: Update user information
- Password Tab: Secure password change
- Message System: Success/error notifications
- Loading States: Button disabled during API calls
```

**State Management**:
```javascript
profileData: { first_name, last_name, email, phone }
passwordData: { old_password, new_password, new_password2 }
message: { type: 'success/error', text: '...' }
```

### Backend APIs

**Endpoints Used**:

1. **Update Profile**:
   ```
   PUT /api/auth/profile/update/
   Headers: Authorization: Bearer <token>
   Body: { first_name, last_name, email, phone }
   ```

2. **Change Password**:
   ```
   POST /api/auth/change-password/
   Headers: Authorization: Bearer <token>
   Body: { old_password, new_password, new_password2 }
   ```

### Security Features

✅ **Authentication Required**: Must be logged in
✅ **JWT Token**: Sent with every request
✅ **Password Hashing**: Passwords never stored in plain text
✅ **Old Password Verification**: Can't change without knowing current
✅ **Session Preserved**: No logout after password change
✅ **Server Validation**: Double-checked on backend

---

## User Interface

### Profile Tab Screenshot (Text):
```
┌─────────────────────────────────────────┐
│ ⚙️ Settings                             │
│ Manage your account settings            │
├─────────────────────────────────────────┤
│ 👤 Profile  |  🔒 Password              │
├─────────────────────────────────────────┤
│                                          │
│ Profile Information                      │
│                                          │
│ First Name:    [John        ]           │
│ Last Name:     [Doe         ]           │
│ Email:         [john@exam...] ┐         │
│ Phone:         [9876543210  ] │         │
│ Username:      [2021cse001  ] │ Disabled│
│ Role:          [STUDENT     ] ┘         │
│                                          │
│ [Update Profile]                         │
└─────────────────────────────────────────┘
```

### Password Tab Screenshot (Text):
```
┌─────────────────────────────────────────┐
│ ⚙️ Settings                             │
│ Manage your account settings            │
├─────────────────────────────────────────┤
│ 👤 Profile  |  🔒 Password              │
├─────────────────────────────────────────┤
│                                          │
│ Change Password                          │
│ Ensure your account uses a strong pwd   │
│                                          │
│ Current Password *   [••••••••]         │
│ New Password *       [••••••••]         │
│                      Min 8 characters    │
│ Confirm Password *   [••••••••]         │
│                                          │
│ ┌─────────────────────────────────────┐│
│ │ 💡 Tip: Use a strong password with  ││
│ │    letters, numbers, and symbols    ││
│ └─────────────────────────────────────┘│
│                                          │
│ [Change Password]                        │
└─────────────────────────────────────────┘
```

---

## Error Handling

### Common Errors & Solutions:

1. **"Old password is incorrect"**
   - ❌ Problem: Entered wrong current password
   - ✅ Solution: Enter the correct current password

2. **"New passwords do not match"**
   - ❌ Problem: New password and confirm don't match
   - ✅ Solution: Retype carefully

3. **"Password must be at least 8 characters long"**
   - ❌ Problem: Password too short
   - ✅ Solution: Use minimum 8 characters

4. **"This email is already in use"**
   - ❌ Problem: Another user has this email
   - ✅ Solution: Use different email address

5. **"Authentication credentials not provided"**
   - ❌ Problem: Session expired
   - ✅ Solution: Log out and log in again

---

## Best Practices

### For Students:

✅ **DO**:
- Change password after first login
- Use strong, unique passwords
- Update profile information if needed
- Remember your new password

❌ **DON'T**:
- Share your password with anyone
- Use simple passwords (e.g., "12345678")
- Forget to confirm password change
- Use same password as enrollment number

### Password Recommendations:

**Weak** ❌:
- `12345678`
- `password`
- `john001` (keep using admin default)

**Strong** ✅:
- `MySecure@2025`
- `J0hn!D0e#Pass`
- `Student@TPO123`

---

## Troubleshooting

### Can't Access Settings:
1. ✅ Ensure you're logged in
2. ✅ Check navbar for user icon
3. ✅ Try direct URL: `/settings`

### Password Change Fails:
1. ✅ Verify current password is correct
2. ✅ Check new password length (≥8)
3. ✅ Ensure passwords match
4. ✅ Try logging out and back in

### Profile Update Fails:
1. ✅ Check email format is valid
2. ✅ Ensure email isn't used by others
3. ✅ Verify all required fields filled
4. ✅ Check internet connection

---

## Future Enhancements

Planned features:
- 📧 Email verification for email changes
- 🔐 Two-factor authentication (2FA)
- 📱 Password reset via email/SMS
- 🔒 Password strength meter
- 📝 Activity log (login history)
- 🖼️ Profile picture upload
- 🌙 Theme preferences (dark mode)

---

## Testing Checklist

### For Admins to Test:

- [ ] Create new student with default password
- [ ] Share credentials with student
- [ ] Student logs in successfully
- [ ] Student accesses Settings page
- [ ] Student changes password
- [ ] Student logs out
- [ ] Student logs in with NEW password ✅
- [ ] Student updates profile information
- [ ] Changes persist after logout/login

### Expected Behavior:

✅ Settings accessible to all roles (STUDENT, ADMIN, COMPANY)
✅ Password change works for everyone
✅ Profile updates reflect immediately
✅ No logout after password change
✅ Old password no longer works after change
✅ Email uniqueness enforced

---

## Quick Reference

| Feature | Endpoint | Method | Auth Required |
|---------|----------|--------|---------------|
| View Profile | `/api/auth/profile/` | GET | ✅ Yes |
| Update Profile | `/api/auth/profile/update/` | PUT | ✅ Yes |
| Change Password | `/api/auth/change-password/` | POST | ✅ Yes |

| Field | Editable | Required | Unique |
|-------|----------|----------|--------|
| First Name | ✅ Yes | ✅ Yes | ❌ No |
| Last Name | ✅ Yes | ❌ No | ❌ No |
| Email | ✅ Yes | ✅ Yes | ✅ Yes |
| Phone | ✅ Yes | ❌ No | ❌ No |
| Username | ❌ No | - | - |
| Role | ❌ No | - | - |

---

## Support

If you encounter issues:
1. Check this guide
2. Verify you're using correct current password
3. Contact placement cell admin
4. Check browser console for errors
5. Try different browser/clear cache

**Remember**: Always use a strong, unique password! 🔒
