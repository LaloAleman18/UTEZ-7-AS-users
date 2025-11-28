# Users Management Microservice

A Node.js microservice for managing users using Express and MongoDB. This service handles user registration, authentication, profile management, and marketing preferences.

## Features

- User registration with email validation
- User authentication (login)
- User profile management
- Marketing consent management
- MongoDB database integration
- RESTful API endpoints
- Error handling middleware
- Input validation
- CORS support
- Swagger/OpenAPI documentation
- Password encryption with bcrypt
- JWT token generation

## API Documentation (Swagger)

The API includes comprehensive Swagger/OpenAPI documentation that can be accessed once the server is running.

### Access Swagger UI

After starting the server, navigate to:
```
http://localhost:3001/api/docs
```

The Swagger UI provides:
- Interactive API documentation
- Request/response schemas
- Example requests and responses
- Try-it-out functionality to test endpoints directly
- All endpoint details including parameters, request bodies, and possible responses

### Swagger Documentation Includes

- **User Schemas**: Complete data models for User, UserRegisterInput, UserLoginInput, and UserProfileUpdateInput
- **All Endpoints**: Full documentation for all user management operations
- **Request Examples**: Sample request bodies for registration, login, and profile updates
- **Response Examples**: Sample responses for success and error cases
- **Error Responses**: Documentation of all possible error responses (400, 401, 403, 404, 500)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- npm or yarn

## Installation

1. Navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp env.template .env
```

4. Update the `.env` file with your configuration:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/users_db
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
```

5. Make sure MongoDB is running on your system

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3001).

## API Endpoints

### Base URL
```
http://localhost:3001/api/users
```

### Public Endpoints

#### Register User
- **POST** `/api/users/register`
- **Body:**
```json
{
  "fullName": "Juan Pérez",
  "email": "juan.perez@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "termsAccepted": true
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
- **POST** `/api/users/login`
- **Body:**
```json
{
  "email": "juan.perez@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Endpoints (Require Authentication)

All protected endpoints require the `X-User-Id` header from the API Gateway.

#### Get Current User Profile
- **GET** `/api/users/profile`
- **Headers:**
  - `X-User-Id: <user_id>`
- **Response:**
```json
{
  "success": true,
  "data": {...}
}
```

#### Update User Profile
- **PUT** `/api/users/profile`
- **Headers:**
  - `X-User-Id: <user_id>`
- **Body:**
```json
{
  "fullName": "Juan Carlos Pérez",
  "profile": {
    "phone": "+52 1234567890",
    "address": "Calle Principal 123",
    "dateOfBirth": "1990-01-15"
  },
  "marketingConsent": true
}
```

#### Update Marketing Consent
- **PUT** `/api/users/marketing-consent`
- **Headers:**
  - `X-User-Id: <user_id>`
- **Body:**
```json
{
  "marketingConsent": true
}
```

### Admin Endpoints (Require Admin Role)

#### Get All Users
- **GET** `/api/users`
- **Headers:**
  - `X-User-Id: <user_id>`
  - `X-User-Roles: admin`

#### Get User by ID
- **GET** `/api/users/:id`
- **Headers:**
  - `X-User-Id: <user_id>`
  - `X-User-Roles: admin`

## User Model

The User model includes the following fields:

- `fullName` (String, required) - User full name
- `email` (String, required, unique) - User email address
- `password` (String, required, min 8 characters) - Encrypted password
- `isActive` (Boolean, default: true) - Whether the user account is active
- `termsAccepted` (Boolean, required) - Whether user accepted terms and conditions
- `termsAcceptedAt` (Date) - Date when terms were accepted
- `marketingConsent` (Boolean, default: false) - Whether user wants to receive marketing promotions
- `marketingConsentUpdatedAt` (Date) - Date when marketing consent was last updated
- `profile` (Object) - User profile information
  - `phone` (String, optional) - User phone number
  - `address` (String, optional) - User address
  - `dateOfBirth` (Date, optional) - User date of birth
- `lastLogin` (Date) - Last login timestamp
- `createdAt` (Date, auto-generated) - Creation timestamp
- `updatedAt` (Date, auto-generated) - Last update timestamp

## Business Rules

### Registration (Requerimiento 2.1)
- Email must be unique (no duplicate emails allowed)
- Password must be at least 8 characters
- Terms and conditions must be accepted
- Password and confirmPassword must match
- Email validation is performed

### Login (Requerimiento 2.2)
- Only active users can login
- Email and password are required
- Invalid credentials return generic error message
- Last login timestamp is updated on successful login

### Marketing Consent (Requerimiento 3.4)
- Users can opt-in or opt-out of marketing promotions
- Preference is saved in user profile
- Timestamp is recorded when preference is updated

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Project Structure

```
microservice-users/
├── src/
│   ├── controllers/
│   │   └── userController.js    # User business logic
│   ├── models/
│   │   └── User.js               # User Mongoose model
│   ├── routes/
│   │   └── userRoutes.js         # User routes
│   ├── middleware/
│   │   ├── auth.js               # Authentication middleware
│   │   └── errorHandler.js      # Error handling middleware
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── swagger.js           # Swagger/OpenAPI configuration
│   └── app.js                   # Express app setup
├── .env                         # Environment variables (not in repo)
├── env.template                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Testing with cURL

### Register a user
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Pérez",
    "email": "juan.perez@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "termsAccepted": true
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com",
    "password": "password123"
  }'
```

### Get profile (requires X-User-Id header)
```bash
curl http://localhost:3001/api/users/profile \
  -H "X-User-Id: <user_id>"
```

### Update profile
```bash
curl -X PUT http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <user_id>" \
  -d '{
    "fullName": "Juan Carlos Pérez",
    "profile": {
      "phone": "+52 1234567890"
    }
  }'
```

### Update marketing consent
```bash
curl -X PUT http://localhost:3001/api/users/marketing-consent \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <user_id>" \
  -d '{
    "marketingConsent": true
  }'
```

## Security Features

- Passwords are hashed using bcryptjs before storage
- JWT tokens for authentication
- API Gateway integration for request validation
- Role-based access control (RBAC)
- Input validation and sanitization
- Email uniqueness validation
- Active user validation for login

## Deployment

This microservice is designed to be deployed independently, for example on Render or similar platforms. Make sure to:

1. Set environment variables in your deployment platform
2. Configure MongoDB connection string
3. Set a strong JWT_SECRET
4. Configure CORS if needed for your frontend
5. Set up health check endpoint at `/health`

## License

ISC

