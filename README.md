# Calendar Application - Full Stack

A complete calendar application built with modern web technologies.

## Project Structure

```
├── backend/          # Node.js + TypeScript + Express + Firebase backend
└── frontend/         # Next.js + TypeScript frontend (coming soon)
```

## Backend

The backend is a REST API built with:
- **Node.js + TypeScript**: Type-safe server development
- **Express.js**: Web framework with middleware support
- **Firebase Admin SDK**: Authentication and Firestore database
- **Vite**: Fast development and build tooling
- **Express Validator**: Request validation
- **Security**: CORS, Helmet, rate limiting

### Features
- 🔐 Firebase Authentication integration
- 📅 Full CRUD operations for calendar events
- 🛡️ Secure user-scoped data access
- ✅ Input validation and error handling
- 🚀 Production-ready configuration

### API Endpoints
- `GET /api/events` - Get user's events with pagination
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an existing event
- `DELETE /api/events/:id` - Delete an event

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase credentials:
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3000`

## Frontend (Coming Soon)

The frontend will be built with Next.js + TypeScript and will include:
- Modern React components with Material-UI
- Firebase Authentication integration
- Calendar event management interface
- Responsive design
- State management with Context API

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express.js
- Firebase Admin SDK
- Firestore
- Vite
- Express Validator
- CORS & Helmet

### Frontend (Planned)
- Next.js
- TypeScript
- Material-UI
- Firebase Auth
- React Context API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
