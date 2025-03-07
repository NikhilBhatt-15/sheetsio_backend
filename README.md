# TableSync Backend

This is the backend for the TableSync project. It includes an Express server, WebSocket service, and various utilities for handling authentication, database connections, and Google Sheets data fetching.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [WebSocket Service](#websocket-service)
- [Utilities](#utilities)
- [Error Handling](#error-handling)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/tablesync_backend.git
   cd tablesync_backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```
PORT=4000
MONGO_URI=your_mongodb_uri
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
API_KEY=your_google_sheets_api_key
```

Ensure that your MongoDB server is running and accessible.

## Usage

Start the server:

```bash
npm start
```

The server will run on the port specified in the `.env` file (default is 4000).

## API Endpoints

### Authentication

- `POST /api/v1/auth/login`: Authenticate a user and return a JWT token.
- `POST /api/v1/auth/logout`: Log out a user by clearing the JWT token.
- `GET /api/v1/auth/verify`: Verify the JWT token and return user information.

### Example Request

```bash
curl -X POST http://localhost:4000/api/v1/auth/login -d '{"username":"user","password":"pass"}' -H "Content-Type: application/json"
```

## WebSocket Service

The WebSocket service is used to fetch and send Google Sheets data to connected clients.

### WebSocket Server

The WebSocket server is initialized with the HTTP server and listens for connections.

### WebSocket Events

- `connection`: When a new client connects.
- `message`: When a message is received from a client.
- `close`: When a client disconnects.

### Example WebSocket Message

```json
{
  "type": "fetchData",
  "sheetId": "your_google_sheet_id"
}
```

## Utilities

### Utility Functions

- `generateHash`: Generate a hash for data comparison.
- `connectDB`: Connect to the MongoDB database.
- `sendToken`: Send a JWT token as an HTTP-only cookie.
- `getTokenFromHeader`: Extract the JWT token from the request headers.

### Example Usage

```javascript
const { generateHash, connectDB, sendToken, getTokenFromHeader } = require('./utils');

// Generate a hash
const hash = generateHash('some_data');

// Connect to the database
connectDB();

// Send a token
sendToken(response, token);

// Get token from header
const token = getTokenFromHeader(request);
```

## Error Handling

The backend includes middleware for handling errors and sending appropriate responses.

### Error Middleware

- `errorMiddleware`: Catch and handle errors, sending a JSON response with the error message and status code.

### Example Usage

```javascript
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

app.use(errorMiddleware);
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.