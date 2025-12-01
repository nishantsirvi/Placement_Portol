# 🔐 Placement Tracking System - API Documentation

## Base URL
```
http://localhost:8000/api/
```

---

## 📑 Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Students](#students)
4. [Companies](#companies)
5. [Placement Progress](#placement-progress)
6. [Stages](#stages)
7. [Important Dates](#important-dates)
8. [Statistics](#statistics)

---

## 🔐 Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Register New User
**POST** `/auth/register/`

**Request Body:**
```json
{
  "username": "john.doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "role": "STUDENT",
  "phone": "9876543210"
}
```

**Role Options:**
- `STUDENT` - Student user
- `ADMIN` - Admin/TPO user
- `COMPANY` - Company representative

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "username": "john.doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "STUDENT",
    "phone": "9876543210",
    "is_verified": false,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "message": "User registered successfully",
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

---

### Login
**POST** `/auth/login/`

**Request Body:**
```json
{
  "username": "john.doe",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john.doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "STUDENT",
    "phone": "9876543210",
    "is_verified": true
  }
}
```

---

### Refresh Token
**POST** `/auth/token/refresh/`

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### Logout
**POST** `/auth/logout/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

---

### Check Authentication Status
**GET** `/auth/check-auth/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "john.doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "STUDENT",
    "phone": "9876543210",
    "is_verified": true
  }
}
```

---

## 👤 User Management

### Get Current User Profile
**GET** `/auth/profile/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john.doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "STUDENT",
  "phone": "9876543210",
  "profile_picture": null,
  "is_verified": true,
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### Update Profile
**PUT/PATCH** `/auth/profile/update/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "newemail@example.com",
  "phone": "9876543210",
  "profile_picture": "<file_upload>"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "username": "john.doe",
    "email": "newemail@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "STUDENT",
    "phone": "9876543210",
    "is_verified": true
  },
  "message": "Profile updated successfully"
}
```

---

### Change Password
**POST** `/auth/change-password/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "old_password": "OldPass123!",
  "new_password": "NewPass123!",
  "new_password2": "NewPass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

---

### List All Users (Admin Only)
**GET** `/auth/users/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `page_size` (optional): Number of results per page

**Response (200 OK):**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/auth/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "john.doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "STUDENT",
      "is_verified": true
    }
  ]
}
```

---

### Verify User (Admin Only)
**POST** `/auth/users/{user_id}/verify/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "User john.doe verified successfully",
  "user": {
    "id": 1,
    "username": "john.doe",
    "is_verified": true
  }
}
```

---

## 🎓 Students

### List All Students
**GET** `/students/`

**Permissions:**
- Students: Can only see their own profile
- Admins: Can see all students

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/students/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "enrollment_number": "CS2021001",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "branch": "CSE",
      "year": "4",
      "cgpa": 8.5,
      "skills": "Python, Django, React",
      "is_placed": false,
      "resume": null,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Student Details
**GET** `/students/{id}/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "enrollment_number": "CS2021001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "branch": "CSE",
  "year": "4",
  "cgpa": 8.5,
  "skills": "Python, Django, React, JavaScript",
  "is_placed": false,
  "resume": "http://localhost:8000/media/resumes/john_resume.pdf",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### Create Student Profile
**POST** `/students/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "enrollment_number": "CS2021001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "branch": "CSE",
  "year": "4",
  "cgpa": 8.5,
  "skills": "Python, Django, React",
  "resume": "<file_upload>"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "enrollment_number": "CS2021001",
  "name": "John Doe",
  "email": "john@example.com",
  "branch": "CSE",
  "year": "4",
  "cgpa": 8.5,
  "is_placed": false
}
```

---

### Update Student Profile
**PUT/PATCH** `/students/{id}/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:** (Any fields to update)
```json
{
  "cgpa": 8.7,
  "skills": "Python, Django, React, AWS"
}
```

---

### Get Placed Students
**GET** `/students/placed_students/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "enrollment_number": "CS2021001",
    "name": "John Doe",
    "branch": "CSE",
    "is_placed": true
  }
]
```

---

### Get Unplaced Students
**GET** `/students/unplaced_students/`

**Headers:**
```
Authorization: Bearer <access_token>
```

---

### Get Student Placement History
**GET** `/students/{id}/placement_history/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "student": 1,
    "company": {
      "id": 1,
      "name": "Google",
      "job_role": "Software Engineer"
    },
    "status": "SELECTED",
    "application_date": "2024-01-15"
  }
]
```

---

## 🏢 Companies

### List All Companies
**GET** `/companies/`

**Permissions:**
- All authenticated users can view companies
- Only admins can create/update/delete

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "count": 25,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Google",
      "description": "Leading technology company",
      "company_type": "PRODUCT",
      "website": "https://www.google.com",
      "package_offered": 24.0,
      "min_cgpa_required": 7.5,
      "eligible_branches": "CSE,IT,ECE",
      "job_role": "Software Engineer",
      "job_location": "Bangalore",
      "contact_person": "HR Manager",
      "contact_email": "hr@google.com",
      "contact_phone": "1234567890",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Create Company (Admin Only)
**POST** `/companies/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Google",
  "description": "Leading technology company",
  "company_type": "PRODUCT",
  "website": "https://www.google.com",
  "package_offered": 24.0,
  "min_cgpa_required": 7.5,
  "eligible_branches": "CSE,IT,ECE",
  "job_role": "Software Engineer",
  "job_location": "Bangalore",
  "contact_person": "HR Manager",
  "contact_email": "hr@google.com",
  "contact_phone": "1234567890"
}
```

**Company Types:**
- `PRODUCT` - Product Based
- `SERVICE` - Service Based
- `STARTUP` - Startup
- `MNC` - Multinational Corporation

---

### Get Active Companies
**GET** `/companies/active_companies/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** List of companies where `is_active = true`

---

### Get Company Applicants
**GET** `/companies/{id}/applicants/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "student": {
      "id": 1,
      "name": "John Doe",
      "enrollment_number": "CS2021001"
    },
    "status": "APPLIED",
    "application_date": "2024-01-15",
    "current_stage": {
      "id": 1,
      "name": "Aptitude Test"
    }
  }
]
```

---

## 📊 Placement Progress

### List Placement Progress
**GET** `/placement-progress/`

**Permissions:**
- Students: Can only see their own applications
- Admins: Can see all applications

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "student": {
        "id": 1,
        "name": "John Doe",
        "enrollment_number": "CS2021001"
      },
      "company": {
        "id": 1,
        "name": "Google",
        "job_role": "Software Engineer"
      },
      "current_stage": {
        "id": 2,
        "name": "Aptitude Test",
        "sequence_order": 2
      },
      "status": "IN_PROGRESS",
      "application_date": "2024-01-15",
      "notes": "Progressing well",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status Options:**
- `APPLIED` - Applied
- `IN_PROGRESS` - In Progress
- `SHORTLISTED` - Shortlisted
- `SELECTED` - Selected
- `REJECTED` - Rejected
- `OFFER_RECEIVED` - Offer Received
- `OFFER_ACCEPTED` - Offer Accepted
- `OFFER_DECLINED` - Offer Declined

---

### Apply to Company
**POST** `/placement-progress/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "student": 1,
  "company": 1,
  "notes": "Very interested in this position"
}
```

---

### Get Placement Statistics
**GET** `/placement-progress/statistics/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "total_students": 500,
  "placed_students": 350,
  "placement_percentage": 70.0,
  "total_companies": 25,
  "total_applications": 1200,
  "offers_received": 400,
  "offers_accepted": 350,
  "average_package": 8.5,
  "status_breakdown": [
    {
      "status": "APPLIED",
      "count": 300
    },
    {
      "status": "SELECTED",
      "count": 350
    }
  ],
  "branch_wise_placement": [
    {
      "branch": "CSE",
      "count": 150
    },
    {
      "branch": "IT",
      "count": 120
    }
  ]
}
```

---

### Get Recent Updates
**GET** `/placement-progress/recent_updates/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** Last 10 placement progress updates

---

## 📝 Stages

### List All Placement Stages
**GET** `/stages/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Application Submission",
    "stage_type": "APPLICATION",
    "description": "Submit your application",
    "sequence_order": 1
  },
  {
    "id": 2,
    "name": "Aptitude Test",
    "stage_type": "APTITUDE",
    "description": "Online aptitude assessment",
    "sequence_order": 2
  }
]
```

**Stage Types:**
- `APPLICATION` - Application Submission
- `APTITUDE` - Aptitude Test
- `TECHNICAL1` - Technical Round 1
- `TECHNICAL2` - Technical Round 2
- `TECHNICAL3` - Technical Round 3
- `HR` - HR Round
- `FINAL` - Final Selection

---

## 📅 Important Dates

### List Important Dates
**GET** `/important-dates/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "count": 15,
  "results": [
    {
      "id": 1,
      "title": "Google Placement Drive",
      "description": "On-campus placement drive",
      "event_type": "DRIVE",
      "company": {
        "id": 1,
        "name": "Google"
      },
      "event_date": "2024-02-15T10:00:00Z",
      "location": "Auditorium",
      "is_active": true
    }
  ]
}
```

**Event Types:**
- `DRIVE` - Placement Drive
- `DEADLINE` - Application Deadline
- `TEST` - Test/Assessment
- `INTERVIEW` - Interview
- `RESULT` - Result Announcement
- `OTHER` - Other

---

### Get Upcoming Events
**GET** `/important-dates/upcoming/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** Next 10 upcoming events

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "field_name": [
    "Error message describing the issue"
  ]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

---

## 🔑 Demo Credentials

Use these credentials to test the API:

**Admin:**
```
Username: admin
Password: admin123
```

**Student:**
```
Username: john.doe
Password: student123
```

**Company Representative:**
```
Username: company.rep
Password: company123
```

---

## 📌 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Pagination is available on list endpoints (default: 10 items per page)
3. File uploads use multipart/form-data encoding
4. JWT tokens expire after 1 hour (access) and 7 days (refresh)
5. All endpoints return JSON responses
6. CORS is enabled for localhost:3000 and localhost:5173

---

## 🚀 Quick Start

1. **Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "password2": "Test123!",
    "role": "STUDENT"
  }'
```

2. **Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'
```

3. **Use the access token:**
```bash
curl -X GET http://localhost:8000/api/students/ \
  -H "Authorization: Bearer <your_access_token>"
```

---

For more information, visit the browsable API at: http://localhost:8000/api/