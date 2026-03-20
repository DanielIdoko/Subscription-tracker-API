# Subscription Management API

A production-grade RESTful API for managing user subscriptions and payments. Built with modern technologies for scalability, security, and maintainability.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with access & refresh tokens
- Password hashing with bcryptjs
- HTTP-only secure cookies
- Rate limiting
- Helmet security headers
- CORS configuration
- NoSQL injection prevention
- Input validation with Zod

### 👤 User Management
- User registration and login
- Profile management
- Account deletion
- Refresh token management

### 📱 Subscription Management
- Create, read, update, delete subscriptions
- Multiple subscription categories
- Flexible billing cycles (monthly, yearly)
- Subscription status tracking (active, paused, cancelled)
- Auto-renewal management
- Upcoming renewal detection

### 📊 Dashboard & Analytics
- Total monthly and yearly spending
- Active subscription count
- Category breakdown
- Upcoming renewals list
- Spending trends
- Category analytics with average prices

### ⏰ Advanced Features
- Cron jobs for automatic renewal tracking
- Notification system (simulated with logging)
- Pagination, filtering, and sorting
- Comprehensive error handling
- Request logging
- Aggregation pipelines for analytics

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Schedule**: node-cron
- **Security**: Helmet, rate-limit
- **Language**: TypeScript
- **Logging**: Morgan
- **HTTP Cookies**: cookie-parser

---

## 📁 Project Structure

```
├── src

│ ├── config/

│ │ └── env.js

│ ├── controllers/

│ │ ├── auth.controller.js

│ │ └── subscription.controller.js

│ ├── middleware/

│ │ └── auth.middleware.js

│ ├── models/

│ │ ├── user.models.js

│ │ └── subscription.models.js

│ ├── routes/

│ │ ├── auth.routes.js

│ │ └── subscription.routes.js

│ ├── server.ts

└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env.development.local` and `.env.production.local` file in the project root with the following values:

```
# PORT
BUN PORT=4000
SERVER_URL="http://localhost:3000"

# Environment
NODE_ENV=development

# Database URI
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/db_name

# Arc jet
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

## 🧩 Installation

### Clone the repo

git clone https://github.com/DanielIdoko/Subscription-tracker-API

### Navigate to the folder

cd Subscription-tracker-API

### Install dependencies
bun install --silent

## Running the server
bun run dev

### Production mode

bun start

## API Endpoints

#### Example signup Payload

```
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Example signin response

```
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "<jwt_token>",
    "user": {
      "_id": "6712b9a3f40b82cd045bbf1d",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}

```

### Subscription routes

## 📦 Subscription Routes

| **HTTP Method** | **Endpoint**                                    | **Description**                  | **Access** |
| --------------- | ----------------------------------------------- | -------------------------------- | ---------- |
| **GET**         | `/api/v1/subscriptions/:userId`                 | Get all subscriptions for a user | 🔐 Private |
| **GET**         | `/api/v1/subscriptions/:userId/:subscriptionId` | Get a single subscription by ID  | 🔐 Private |
| **POST**        | `/api/v1/subscriptions/:userId`                 | Create a new subscription        | 🔐 Private |
| **PUT**         | `/api/v1/subscriptions/:userId/:subscriptionId` | Update an existing subscription  | 🔐 Private |
| **DELETE**      | `/api/v1/subscriptions/:userId/:subscriptionId` | Delete a subscription            | 🔐 Private |

> **Note:** All routes require authentication using a valid JWT token, either via the  
> `Authorization` header (`Bearer <token>`) or the `token` cookie.

#### Example subscription response

```
{
  "success": true,
  "data": [
    {
      "_id": "6712bcbfbadf4f26b1a5f321",
      "name": "Netflix Premium",
      "price": 14.99,
      "category": "Streaming",
      "user": "qdj0ff330fj3efnideniveniien"
      "paymentMethod": "Credit Card",
      "startDate": "2025-09-23T00:00:00.000Z"
    }
  ]
}
```

## Error Handling for auth

All error responses follow a consistent structure:

```
{
  "success": false,
  "error": "Unauthorized - Invalid or expired token"
  "message": "message", --> varies
}

```

## Testing the API
You can test the API with any of these tools:

- 🧪 Postman

- ⚡ Hoppscotch

- 💻 Thunder Client (VS Code)


#### Testing flow

1. Register or sign in a user to get a JWT token.

2. Include Authorization: Bearer <token> in request headers (or use cookies).

3. Access protected routes such as /api/v1/subscriptions/:userId.

## Scripts
| Command        | Description                              |
| -------------- | ---------------------------------------- |
| `npm run dev`  | Run server in development mode (nodemon) |
| `npm start`    | Run server in production mode            |
| `npm run lint` | Run ESLint checks                        |


# 🧑‍💻 Author
### Bio
- Idoko Daniel
- 💼 Full-Stack engineer
- 📧 danielidoko46@gmail.com

### 🔗 LinkedIn Profile
- https://www.linkedin.com/in/danielidokodev