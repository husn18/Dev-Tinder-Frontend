# Dev-Tinder API Testing Guide

## API Testing Results ✓

All core endpoints are working successfully!

---

## Test Results Summary

```
[✓] Signup User - Status: 200
[✓] Login User - Status: 200 (Token acquired)
[✓] Get Received Requests - Status: 200
[✓] Get User Connections - Status: 200
[✓] Send Connection Request - Endpoint working
[✓] Respond to Connection Request - Endpoint working
```

---

## Manual API Testing with Postman

### 1. **Signup Endpoint**
- **URL**: `POST http://localhost:3000/signup`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "phone": "9876543210",
  "age": 25,
  "gender": "Male"
}
```
- **Expected Response**: `User signed up successfully!` (Status: 200)

---

### 2. **Login Endpoint**
- **URL**: `POST http://localhost:3000/login`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```
- **Expected Response**: `User logged in successfully!` (Status: 200)
- **Note**: Token is set in cookies (httpOnly: true)

---

### 3. **Send Connection Request**
- **URL**: `POST http://localhost:3000/sendconnectionrequest/interested/:toUserId`
- **Replace**: `:toUserId` with actual user's MongoDB ObjectId
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body**: `{}` (empty)
- **Expected Response**:
```json
{
  "message": "Connection request sent successfully",
  "data": {
    "_id": "...",
    "fromUserId": "...",
    "toUserId": "...",
    "status": "interested",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 4. **Get Received Connection Requests**
- **URL**: `GET http://localhost:3000/user/requests/received`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Expected Response**:
```json
{
  "message": "Received connection requests retrieved successfully",
  "data": [
    {
      "_id": "...",
      "fromUserId": {
        "_id": "...",
        "firstname": "John",
        "lastname": "Doe",
        "age": 25,
        "gender": "Male",
        "skills": []
      },
      "toUserId": "...",
      "status": "interested",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 5. **Respond to Connection Request**
- **URL**: `POST http://localhost:3000/connectionrequestresponse/accepted/:requestId`
- **Replace**: `:requestId` with the request's MongoDB ObjectId
- **Status Options**: `"ignored"`, `"interested"`, `"accepted"`, `"rejected"`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body**: `{}` (empty)
- **Expected Response**:
```json
{
  "message": "Connection request response updated successfully",
  "data": {
    "_id": "...",
    "fromUserId": {
      "_id": "...",
      "firstname": "John",
      "lastname": "Doe",
      "age": 25,
      "gender": "Male",
      "skills": []
    },
    "toUserId": "...",
    "status": "accepted",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 6. **Get User Connections**
- **URL**: `GET http://localhost:3000/user/connections`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Expected Response**:
```json
{
  "message": "Connections retrieved successfully",
  "data": [
    {
      "_id": "...",
      "user": {
        "_id": "...",
        "firstname": "Jane",
        "lastname": "Smith",
        "age": 23,
        "gender": "Female",
        "skills": []
      },
      "status": "accepted",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## Testing Flow Example

### Complete User Journey:

1. **User 1 Signup** → `POST /signup` with user data
2. **User 2 Signup** → `POST /signup` with user data
3. **User 1 Login** → `POST /login` → Get Token 1
4. **User 2 Login** → `POST /login` → Get Token 2
5. **User 1 sends request to User 2** → `POST /sendconnectionrequest/interested/:user2Id` with Token 1
6. **User 2 views received requests** → `GET /user/requests/received` with Token 2
7. **User 2 accepts request** → `POST /connectionrequestresponse/accepted/:requestId` with Token 2
8. **User 1 views connections** → `GET /user/connections` with Token 1
9. **User 2 views connections** → `GET /user/connections` with Token 2

---

## How to Run the Test Scripts

### Quick Test (Basic endpoints):
```bash
node test-api.js
```

### Full Flow Test (With real users from DB):
```bash
node test-full-flow.js
```

---

## Key Fixes Applied

✓ **Fixed `/user/requests/received`**: Now correctly uses `req.userId` instead of `req.user._id`
✓ **Fixed `/user/connections`**: Added proper string conversion for ObjectId comparison
✓ **Fixed `/connectionrequestresponse`**: Now populates user data and supports all status types
✓ **Fixed imports**: User router now correctly imports `userAuth` destructured from middleware

---

## Running the Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## Database Connection

MongoDB Atlas connection is configured in `src/config/database.js`:
- Database: `Dev-Tinder`
- Collections: `users`, `connectionrequests`

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, response updates) |
| 201 | Success (POST, resource created) |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not found (user/request not found) |
| 500 | Server error |

---

## Notes

- All connection requests require authentication (Bearer token)
- Tokens are set as httpOnly cookies during login
- Connection requests are directional (User A → User B)
- Accepted connections appear in both users' `/user/connections` endpoints
- The status field can only be changed from 'interested' → 'accepted' or 'rejected'
