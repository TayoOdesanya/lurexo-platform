# Lurexo API Testing Guide

Base URL: `http://localhost:3001/api`

---

## 1. Register a New User

**POST** `/auth/register`
```json
{
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "BUYER"
}
```

**Expected Response:**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "BUYER",
    "emailVerified": false,
    "createdAt": "2024-12-04T14:25:00.000Z"
  }
}
```

---

## 2. Login

**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "BUYER",
    "emailVerified": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**IMPORTANT:** Copy the `accessToken` for the next test!

---

## 3. Get Current User (Protected Route)

**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "BUYER",
  "emailVerified": false,
  "phoneNumber": null,
  "profilePicture": null,
  "createdAt": "2024-12-04T14:25:00.000Z"
}
```

---

## 4. Register an Organizer

**POST** `/auth/register`
```json
{
  "email": "organizer@lurexo.com",
  "password": "OrganizerPass123",
  "firstName": "Sarah",
  "lastName": "Events",
  "role": "ORGANIZER"
}
```

---

## 5. Refresh Token

**POST** `/auth/refresh`
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

---

## Testing with curl:

### Register:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@lurexo.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "User",
    "role": "BUYER"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@lurexo.com",
    "password": "TestPass123"
  }'
```

### Get Current User:
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Error Responses:

### Invalid Credentials (401):
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### Email Already Exists (409):
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

### Validation Error (400):
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```
