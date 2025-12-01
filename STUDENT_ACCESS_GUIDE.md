# Student Access Guide

## How Students Access the System

There are now **TWO ways** for students to access the Placement Tracking System:

---

## Method 1: Admin Creates Student Account ✅ **RECOMMENDED**

When an admin adds a new student through the **Students Management** page:

### What Happens Automatically:
1. ✅ **Student Profile** is created with all academic details
2. ✅ **User Account** is automatically created for login
3. ✅ **Login Credentials** are generated and displayed

### Login Credentials Format:
- **Username**: `enrollment_number` (lowercase)
  - Example: `2021cse001`
  
- **Password**: 
  - **Custom**: Admin can set a custom password in the form
  - **Auto-generated** (if password field left empty): `firstname + last 4 digits of enrollment`
    - Example: If name is "John Doe" and enrollment is "2021CSE001", password will be `john001`

### Admin Workflow:
1. Go to **Students** page
2. Click **"+ Add Student"**
3. Fill in student details (enrollment, name, email, branch, CGPA, etc.)
4. **Optional**: Enter a custom password OR leave blank for auto-generated
5. Click **"Create Student"**
6. 🎉 **Success Modal** shows the generated credentials:
   ```
   Username: 2021cse001
   Password: john001
   ```
7. **Share these credentials** with the student (email, SMS, or in-person)

### Student First Login:
1. Go to Login page
2. Enter the provided username and password
3. Student can now access their personalized dashboard!

---

## Method 2: Student Self-Registration

Students can also register themselves:

### Student Workflow:
1. Go to **Register** page
2. Fill in:
   - Username (can be anything)
   - Email
   - Password
   - First Name, Last Name
   - Role: **STUDENT**
   - Phone
3. Click **"Register"**
4. ⚠️ **Note**: This creates a User account but NO Student profile

### Limitation:
- Self-registered students can log in but won't have access to full features
- Admin must still create a Student profile and link it to the user
- **Recommended**: Use Method 1 instead

---

## Best Practices for Admins

### ✅ DO:
- Use Method 1 (Admin creates student) for all students
- Save credentials securely before sharing
- Use clear, memorable passwords (or let system auto-generate)
- Share credentials through secure channels (official email, student portal)
- Inform students they can change password after first login

### ❌ DON'T:
- Share credentials publicly
- Use the same password for all students
- Forget to share credentials with students

---

## Password Management

### Default Password Pattern:
```
firstname (lowercase) + last 4 digits of enrollment number
```

Examples:
- Name: "Rahul Kumar", Enrollment: "2021CSE045" → Password: `rahul045`
- Name: "Priya Singh", Enrollment: "2022IT123" → Password: `priya123`

### Custom Passwords:
Admins can set custom passwords when creating students. Requirements:
- Minimum 8 characters (Django default)
- Can include letters, numbers, special characters

### Student Can Change Password:
After first login, students should change their password:
1. Go to Profile/Settings (future feature)
2. Change password option

---

## Troubleshooting

### Student Can't Login:
1. ✅ Verify username is **enrollment number in lowercase**
2. ✅ Check password matches what admin shared
3. ✅ Ensure student account was created by admin (check Students list)
4. ✅ Verify student's User account exists in database

### Admin Forgot Credentials:
- Credentials are only shown **once** during creation
- Admin must reset password through Django admin panel
- Or create a password reset feature (future enhancement)

### Duplicate Username Error:
- Each enrollment number must be unique
- System prevents duplicate student creation
- Check if student already exists before creating

---

## Technical Details

### Database Structure:
```
User Table (accounts_user)
├── username (enrollment_number)
├── email
├── password (hashed)
├── role = "STUDENT"
└── first_name, last_name, phone

Student Table (placements_student)
├── user (ForeignKey to User) ← Automatically linked
├── enrollment_number
├── name, email, phone
├── branch, year, cgpa
└── skills, is_placed
```

### Auto-Linking Process:
When admin creates a student:
1. StudentSerializer.create() is called
2. If no user exists, system creates one:
   - Username = enrollment_number (lowercase)
   - Email = student email
   - Password = custom or auto-generated
   - Role = STUDENT
3. Student.user field is linked to new User
4. Credentials are returned to frontend

---

## Future Enhancements

Planned features:
- 📧 Auto-email credentials to student
- 🔒 Password reset via email
- 👤 Profile page for students to change password
- 📱 SMS notification with credentials
- 🔄 Bulk student import with auto-credential generation

---

## Quick Reference

| Action | Username | Password |
|--------|----------|----------|
| Admin creates student | enrollment_number (lowercase) | Custom OR firstname+last4digits |
| Student self-registers | Any username | Student chooses |
| Student first login | Use provided credentials | Can change later |

---

## Support

If students have login issues:
1. Contact placement cell admin
2. Verify credentials were shared
3. Admin can check Django admin panel
4. Reset password if needed

**Remember**: Always use **Method 1 (Admin Creates)** for streamlined student onboarding! 🎓
