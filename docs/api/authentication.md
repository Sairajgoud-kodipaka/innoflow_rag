# Authentication API Documentation

## Overview
The authentication system uses JWT (JSON Web Tokens) for secure user authentication. All endpoints are prefixed with `/api/`.

## Endpoints

### User Registration
```http
POST /api/users/register/
```
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "password2": "string",
  "first_name": "string",
  "last_name": "string"
}
```

**Response:**
```json
{
  "access": "string",
  "refresh": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string"
  }
}
```

### Login
```http
POST /api/token/
```
Obtain JWT tokens for authentication.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access": "string",
  "refresh": "string",
  "expires_in": "number",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string"
  }
}
```

### Logout
```http
POST /api/token/logout/
```
Invalidate the refresh token.

**Request Body:**
```json
{
  "refresh": "string"
}
```

**Response:**
```json
{
  "detail": "Successfully logged out."
}
```

### Get Current User
```http
GET /api/users/me/
```
Get the current user's profile.

**Response:**
```json
{
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "profile": {
      "id": "string",
      "user": "string",
      "bio": "string",
      "avatar": "string"
    }
  }
}
```

### Update Current User
```http
PATCH /api/users/me/
```
Update the current user's profile.

**Request Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string"
  }
}
```

### Change Password
```http
POST /api/users/password/change/
```
Change the user's password.

**Request Body:**
```json
{
  "old_password": "string",
  "new_password": "string",
  "new_password2": "string"
}
```

**Response:**
```json
{
  "access": "string",
  "refresh": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### Request Password Reset
```http
POST /api/users/password/reset/
```
Request a password reset email.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "detail": "Password reset email has been sent."
}
```

### Confirm Password Reset
```http
POST /api/users/password/reset/confirm/
```
Confirm password reset with token.

**Request Body:**
```json
{
  "token": "string",
  "password": "string",
  "password2": "string"
}
```

**Response:**
```json
{
  "detail": "Password has been reset successfully."
}
```

### Social Authentication

#### Google Login
```http
POST /auth/social/google/
```
Authenticate with Google OAuth.

**Request Body:**
```json
{
  "access_token": "string"
}
```

**Response:**
```json
{
  "access": "string",
  "refresh": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

#### GitHub Login
```http
POST /auth/social/github/
```
Authenticate with GitHub OAuth.

**Request Body:**
```json
{
  "code": "string"
}
```

**Response:**
```json
{
  "access": "string",
  "refresh": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "string",
  "errors": {
    "field_name": ["error message"]
  }
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

## Token Management

- Access tokens are short-lived (default: 5 minutes)
- Refresh tokens are long-lived (default: 24 hours)
- Store tokens securely in localStorage
- Include the access token in the Authorization header for protected requests:
  ```
  Authorization: Bearer <access_token>
  ```
- Use the refresh token to obtain a new access token when it expires

## Security Considerations

1. Always use HTTPS
2. Store tokens securely
3. Implement proper token refresh logic
4. Handle token expiration gracefully
5. Implement proper error handling
6. Validate all input data
7. Use CSRF protection where applicable 