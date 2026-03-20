# Subscription Management API - Documentation

## 📋 Overview

A production-grade RESTful API for managing user subscriptions and payments. Built with Node.js, Express, MongoDB, and TypeScript.

**Base URL**: `http://localhost:3000/api/v1`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require an `Authorization` header with a Bearer token.

### Example Authorization Header
```
Authorization: Bearer <access_token>
```

## 📚 API Endpoints

### Authentication Routes (Public)

#### 1. Register User
- **Endpoint**: `POST /auth/register`
- **Rate Limit**: 5 requests per 15 minutes
- **Description**: Create a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-03-19T10:30:00Z",
      "updatedAt": "2026-03-19T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "statusCode": 201
}
```

**Validation Rules**:
- Name: 2-100 characters
- Email: Valid email format
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number

---

#### 2. Login User
- **Endpoint**: `POST /auth/login`
- **Rate Limit**: 5 requests per 15 minutes
- **Description**: Authenticate and get access token

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "statusCode": 200
}
```

---

#### 3. Refresh Token
- **Endpoint**: `POST /auth/refresh`
- **Description**: Get a new access token using refresh token

**Request Body** (or Cookie):
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "statusCode": 200
}
```

---

#### 4. Logout
- **Endpoint**: `POST /auth/logout`
- **Authentication**: Required
- **Description**: Logout user and invalidate refresh token

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logout successful",
  "statusCode": 200
}
```

---

### User Routes (Protected)

#### 1. Get User Profile
- **Endpoint**: `GET /users/profile`
- **Authentication**: Required
- **Description**: Get current user's profile

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-03-19T10:30:00Z",
    "updatedAt": "2026-03-19T10:30:00Z"
  },
  "statusCode": 200
}
```

---

#### 2. Update User Profile
- **Endpoint**: `PUT /users/profile`
- **Authentication**: Required
- **Description**: Update user information

**Request Body**:
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john.updated@example.com"
  },
  "statusCode": 200
}
```

---

#### 3. Delete User Account
- **Endpoint**: `DELETE /users/account`
- **Authentication**: Required
- **Description**: Permanently delete user account and all associated data

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "User account deleted successfully",
  "statusCode": 200
}
```

---

### Subscription Routes (Protected)

#### 1. Create Subscription
- **Endpoint**: `POST /subscriptions`
- **Authentication**: Required
- **Description**: Create a new subscription

**Request Body**:
```json
{
  "name": "Netflix",
  "price": 15.99,
  "currency": "USD",
  "billingCycle": "monthly",
  "nextBillingDate": "2026-04-19T10:30:00Z",
  "category": "entertainment",
  "status": "active",
  "autoRenew": true
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Netflix",
    "price": 15.99,
    "currency": "USD",
    "billingCycle": "monthly",
    "nextBillingDate": "2026-04-19T10:30:00Z",
    "category": "entertainment",
    "status": "active",
    "autoRenew": true,
    "userId": "507f1f77bcf86cd799439011",
    "startDate": "2026-03-19T10:30:00Z",
    "createdAt": "2026-03-19T10:30:00Z"
  },
  "statusCode": 201
}
```

---

#### 2. Get All Subscriptions
- **Endpoint**: `GET /subscriptions`
- **Authentication**: Required
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10, max: 100)
  - `status`: Filter by status (active, cancelled, paused)
  - `category`: Filter by category
  - `sortBy`: Sort field (default: createdAt)
  - `sortOrder`: Sort order (asc, desc)

**Example**: `GET /subscriptions?page=1&limit=10&status=active&sortOrder=desc`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Subscriptions retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Netflix",
      "price": 15.99,
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "statusCode": 200
}
```

---

#### 3. Get Single Subscription
- **Endpoint**: `GET /subscriptions/:id`
- **Authentication**: Required
- **Description**: Get details of a specific subscription

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Subscription retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Netflix",
    "price": 15.99,
    "currency": "USD",
    "billingCycle": "monthly",
    "nextBillingDate": "2026-04-19T10:30:00Z",
    "category": "entertainment",
    "status": "active",
    "autoRenew": true,
    "userId": "507f1f77bcf86cd799439011",
    "startDate": "2026-03-19T10:30:00Z"
  },
  "statusCode": 200
}
```

---

#### 4. Get Active Subscriptions
- **Endpoint**: `GET /subscriptions/active`
- **Authentication**: Required
- **Description**: Get all active subscriptions

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Active subscriptions retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Netflix",
      "status": "active"
    }
  ],
  "statusCode": 200
}
```

---

#### 5. Get Upcoming Renewals
- **Endpoint**: `GET /subscriptions/upcoming-renewals`
- **Authentication**: Required
- **Query Parameters**:
  - `daysAhead`: Number of days to check ahead (default: 7)

**Example**: `GET /subscriptions/upcoming-renewals?daysAhead=30`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Upcoming renewals retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Netflix",
      "nextBillingDate": "2026-03-25T10:30:00Z",
      "price": 15.99
    }
  ],
  "statusCode": 200
}
```

---

#### 6. Update Subscription
- **Endpoint**: `PUT /subscriptions/:id`
- **Authentication**: Required
- **Description**: Update subscription details

**Request Body** (all fields optional):
```json
{
  "name": "Netflix Premium",
  "price": 19.99,
  "nextBillingDate": "2026-04-19T10:30:00Z",
  "status": "active",
  "autoRenew": false
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Netflix Premium",
    "price": 19.99
  },
  "statusCode": 200
}
```

---

#### 7. Cancel Subscription
- **Endpoint**: `POST /subscriptions/:id/cancel`
- **Authentication**: Required
- **Description**: Cancel a subscription

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "status": "cancelled",
    "cancelledAt": "2026-03-19T10:30:00Z"
  },
  "statusCode": 200
}
```

---

#### 8. Pause Subscription
- **Endpoint**: `POST /subscriptions/:id/pause`
- **Authentication**: Required
- **Description**: Temporarily pause a subscription

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Subscription paused successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "status": "paused"
  },
  "statusCode": 200
}
```

---

#### 9. Resume Subscription
- **Endpoint**: `POST /subscriptions/:id/resume`
- **Authentication**: Required
- **Description**: Resume a paused subscription

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Subscription resumed successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "status": "active"
  },
  "statusCode": 200
}
```

---

#### 10. Delete Subscription
- **Endpoint**: `DELETE /subscriptions/:id`
- **Authentication**: Required
- **Description**: Permanently delete a subscription

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Subscription deleted successfully",
  "statusCode": 200
}
```

---

### Dashboard Routes (Protected - Analytics)

#### 1. Get Dashboard Statistics
- **Endpoint**: `GET /dashboard/stats`
- **Authentication**: Required
- **Description**: Get overall dashboard statistics

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalMonthlySpend": 125.5,
    "totalYearlySpend": 1250.5,
    "activeSubscriptionsCount": 8,
    "upcomingRenewals": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Netflix",
        "nextBillingDate": "2026-03-25T10:30:00Z",
        "price": 15.99
      }
    ],
    "categoryBreakdown": [
      {
        "category": "entertainment",
        "count": 3,
        "totalSpend": 35.97
      },
      {
        "category": "productivity",
        "count": 3,
        "totalSpend": 75
      }
    ]
  },
  "statusCode": 200
}
```

---

#### 2. Get Spending Analytics
- **Endpoint**: `GET /dashboard/spending`
- **Authentication**: Required
- **Description**: Get detailed spending analytics

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Spending analytics retrieved successfully",
  "data": {
    "monthly": 125.50,
    "yearly": 1250.50,
    "daily": 4.18,
    "currency": "USD"
  },
  "statusCode": 200
}
```

---

#### 3. Get Category Analytics
- **Endpoint**: `GET /dashboard/categories`
- **Authentication**: Required
- **Description**: Get breakdown by category

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Category analytics retrieved successfully",
  "data": [
    {
      "category": "entertainment",
      "count": 3,
      "totalSpend": 35.97,
      "averagePrice": 11.99
    },
    {
      "category": "productivity",
      "count": 3,
      "totalSpend": 75,
      "averagePrice": 25
    }
  ],
  "statusCode": 200
}
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Seed Database (Optional)
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Start Production Server
```bash
npm start
```

## 📊 Subscription Categories

- `entertainment` - Streaming services, movies, music
- `productivity` - Office tools, management apps
- `education` - Learning platforms, courses
- `finance` - Financial tools, budgeting
- `health` - Fitness, healthcare apps
- `sports` - Sports streaming, fitness tracking
- `news` - News services
- `other` - Miscellaneous

## 💳 Billing Cycles

- `monthly` - Monthly subscription
- `yearly` - Annual subscription

## 🔄 Subscription Status

- `active` - Active subscription
- `cancelled` - Cancelled subscription
- `paused` - Temporarily paused

## 🛡️ Security Features

- JWT Authentication with Access & Refresh Tokens
- Password hashing with bcryptjs
- Rate limiting on all endpoints
- CORS configuration
- NoSQL injection prevention
- Input validation with Zod
- Helmet for secure HTTP headers
- HTTP-only cookies for refresh tokens

## ⚠️ Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "statusCode": 400
}
```

### Common Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Invalid Token)
- `403` - Forbidden (No Permission)
- `404` - Not Found
- `409` - Conflict (Duplicate)
- `500` - Internal Server Error

## 📝 Rate Limiting

- **Global**: 100 requests per 15 minutes
- **Auth Routes**: 5 requests per 15 minutes (login, register)
- **API Routes**: 30 requests per minute

## 🔄 Cron Jobs

- **Renewal Check**: Daily at midnight (0:00 AM) - Updates next billing dates for auto-renewing subscriptions
- **Notifications**: Daily at noon (12:00 PM) - Sends renewal reminders

## 📖 Example Usage

### Using cURL

#### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

#### Create Subscription
```bash
curl -X POST http://localhost:3000/api/v1/subscriptions \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Netflix",
    "price": 15.99,
    "currency": "USD",
    "billingCycle": "monthly",
    "nextBillingDate": "2026-04-19T10:30:00Z",
    "category": "entertainment",
    "autoRenew": true
  }'
```

---

## 📦 Project Structure

```
src/
├── config/       - Configuration files
├── controllers/  - Request handlers
├── database/     - Database connection
├── dtos/        - Data validation schemas
├── errors/      - Custom error classes
├── jobs/        - Cron jobs
├── middlewares/ - Express middlewares
├── models/      - MongoDB models
├── repositories/- Data access layer
├── routes/      - API routes
├── services/    - Business logic
├── types/       - TypeScript types
└── utils/       - Utility functions
```

---

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed database with test data

---

## 📞 Support

For issues or questions, please refer to the repository or contact support.

---

**Version**: 1.0.0  
**Last Updated**: March 19, 2026
