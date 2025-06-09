# Calendar Backend API

A Node.js + TypeScript + Express backend with Firebase Admin SDK for managing calendar events.

## Features

- 🚀 **RESTful API** for calendar events management
- 🔐 **Firebase Authentication** integration
- 📊 **TypeScript** for type safety
- ⚡ **Vite** for fast development
- 🔥 **Firebase Firestore** for data storage
- ✅ **Request validation** with express-validator
- 🛡️ **Security** with helmet and CORS
- 📝 **Comprehensive error handling**

## API Endpoints

### Events

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get all events for authenticated user | ✅ |
| GET | `/api/events/:id` | Get specific event by ID | ✅ |
| POST | `/api/events` | Create new event | ✅ |
| PUT | `/api/events/:id` | Update existing event | ✅ |
| DELETE | `/api/events/:id` | Delete event | ✅ |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | API health status | ❌ |

## Event Model

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO 8601 format
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your Firebase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase configuration:

```env
NODE_ENV=development
PORT=3000

# Option 1: Use environment variables
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY=your-firebase-private-key

# Option 2: Use service account file (alternative)
# FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/serviceAccountKey.json

# Optional: Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### 2. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firestore Database
4. Enable Authentication
5. Generate service account credentials:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file or copy the credentials

### 4. Quick Setup

Run the setup helper to check your configuration:

```bash
npm run setup
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Application

#### Development Mode

```bash
npm run dev
```

#### Production Build

```bash
npm run build
npm start
```

### 7. Test the API

Test basic functionality:

```bash
npm run test-api
```

## Authentication

The API uses Firebase ID tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-firebase-id-token>
```

## Request/Response Examples

### Create Event

**POST** `/api/events`

```json
{
  "title": "Team Meeting",
  "description": "Weekly team sync meeting",
  "date": "2025-06-15T10:00:00.000Z",
  "category": "work"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "event123",
    "title": "Team Meeting",
    "description": "Weekly team sync meeting",
    "date": "2025-06-15T10:00:00.000Z",
    "category": "work",
    "userId": "user123",
    "createdAt": "2025-06-09T11:50:00.000Z",
    "updatedAt": "2025-06-09T11:50:00.000Z"
  },
  "message": "Event created successfully"
}
```

### Get All Events

**GET** `/api/events`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "event123",
      "title": "Team Meeting",
      "description": "Weekly team sync meeting",
      "date": "2025-06-15T10:00:00.000Z",
      "category": "work",
      "userId": "user123",
      "createdAt": "2025-06-09T11:50:00.000Z",
      "updatedAt": "2025-06-09T11:50:00.000Z"
    }
  ],
  "message": "Events retrieved successfully"
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Human readable error message",
  "details": [] // Optional validation details
}
```

## Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Project Structure

```
src/
├── controllers/          # Request handlers
├── middleware/          # Authentication, validation, error handling
├── models/             # TypeScript interfaces
├── routes/             # API route definitions
├── services/           # Business logic and Firebase integration
└── utils/              # Helper functions
```

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run preview` - Preview production build

## Security Features

- 🔐 Firebase Authentication integration
- 🛡️ Helmet.js for security headers
- 🌐 CORS configuration
- ✅ Input validation and sanitization
- 🚫 Rate limiting ready (can be added)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
