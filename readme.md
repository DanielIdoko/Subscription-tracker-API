# Subscription Management API

A robust RESTful API for managing user accounts and global subscriptions built with **node.js**, **Express**, **MongoDB**, and **JWT authentication**.  
It provides secure authentication endpoints, session handling with cookies, and subscription CRUD operations.

---

## Features

- 🔐 **JWT Authentication** (stored securely in cookies or via Bearer tokens)
- 👤 **User Registration & Login**
- 🚪 **User Logout / Token Revocation**
- 💳 **Subscription Management** (view and manage user subscriptions)
- 🧰 **MongoDB Integration** using Mongoose
- ⚙️ **Error Handling & Validation**
- 🌐 **Environment-based Configuration**

---

## 🏗️ Tech Stack

| Technology             | Description           |
| ---------------------- | --------------------- |
| **Node.js**            | JavaScript runtime    |
| **Express.js**         | Web framework         |
| **MongoDB + Mongoose** | Database & ODM        |
| **JWT**                | Authentication tokens |
| **bcryptjs**           | Password hashing      |
| **dotenv**             | Environment variables |
| **cookie-parser**      | Cookie management     |

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

│ ├── server.js

│ └── app.js

└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env.development.local` and `.env.production.local` file in the project root with the following values:

```
# PORT
PORT=3000
SERVER_URL="http://localhost:3000"

# Environment
NODE_ENV=development

# Database URI
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/db_name

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

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

pnpm install or npm install

## Running the server

### Development mode

pnpm dev

### Production mode

pnpm start

## API Endpoints

### API routes

| Method | Endpoint                   | Description             | Auth |
| ------ | -------------------------- | ----------------------- | ---- |
| `POST` | `/api/v1/auth/signup`      | Register a new user     | ❌   |
| `POST` | `/api/v1/auth/login`       | Log in an existing user | ❌   |
| `POST` | `/api/v1/auth/signout/:id` | Log out current user    | ✅   |

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
