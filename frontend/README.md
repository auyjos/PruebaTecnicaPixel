# Event Management Frontend

A Next.js (App Router) frontend application for managing calendar events, built with TypeScript, Material UI, and Firebase Authentication. Users can sign up, sign in, view a paginated and searchable list of their events, create new events, edit existing events, and delete events.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [Event Management](#event-management)
- [Styling and Theming](#styling-and-theming)
- [Context and State Management](#context-and-state-management)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Firebase Authentication**: Email/password sign-up and sign-in.
- **Event CRUD**: Create, read, update, and delete events via a backend REST API.
- **Search & Pagination**: Client-side search by title/date and pagination.
- **Protected Routes**: Redirects to login if not authenticated.
- **Material UI**: Modern, responsive UI with theming support.
- **Global State**: React Context API with custom hooks for auth and event data.

## Tech Stack

- Next.js (v13+) with App Router
- React & TypeScript
- Material UI (MUI) v5
- Firebase Auth (Web SDK)
- React Context API
- Fetch API for backend integration

## Prerequisites

- Node.js >= 16
- npm or yarn or pnpm
- A running backend API (see `backend/`)

## Environment Variables

Create a file at the root of `frontend` named `.env.local` with the following variables:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Ensure you replace values with your Firebase project settings.

## Installation

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```
3.  Create and populate `.env.local` as described above.

## Available Scripts

From within the `frontend` directory, run:

- `npm run dev` - Start the development server at http://localhost:3000
- `npm run build` - Create an optimized production build
- `npm start` - Start the production server
- `npm run lint` - Run ESLint checks

## Project Structure

```
frontend/
├─ public/                 # Static assets
├─ src/
│  ├─ app/                 # Next.js App Router pages and layouts
│  │  ├─ layout.tsx        # Root layout with nav and footer
│  │  ├─ page.tsx          # Home/landing page
│  │  ├─ login/page.tsx    # Sign In / Sign Up page
│  │  ├─ events/           # Events CRUD pages
│  │  │  ├─ page.tsx       # List and search events
│  │  │  ├─ new/page.tsx   # Create event
│  │  │  └─ edit/[id]/page.tsx # Edit event
│  ├─ components/          # Reusable UI components
│  │  ├─ ClientProviders.tsx # Client-only providers (MUI theme, Auth, Event)
│  │  ├─ UserActions.tsx   # Nav user icon + menu
│  │  ├─ EventForm.tsx     # Form for create/edit events
│  │  ├─ EventList.tsx     # Grid of EventItem cards
│  │  └─ EventItem.tsx     # Single event card with actions
│  ├─ context/             # React Context providers & hooks
│  │  ├─ AuthContext.tsx   # Firebase Auth state
│  │  └─ EventContext.tsx  # Event data fetching & state
│  ├─ firebaseConfig.ts    # Firebase SDK initialization
│  └─ types/               # TypeScript type definitions
│     └─ index.ts
├─ .env.local              # Environment variables (not committed)
├─ next.config.ts
├─ tsconfig.json
└─ package.json
```

## Authentication Flow

- On `login/page.tsx`, users can toggle between Sign Up and Sign In.
- After sign-up, users are immediately signed out and prompted to sign in.
- On successful sign-in, the app redirects to `/` (home) or `/events`.
- Protected pages (`/events*`) redirect to `/login` if not authenticated.

## Event Management

- **EventList**: Fetches events from `/api/events` using the JWT from Firebase Auth.
- **Filtering**: Search by title (case-insensitive) and date (YYYY-MM-DD prefix).
- **Pagination**: Client-side pagination with a configurable `PAGE_SIZE`.
- **EventForm**: Reusable component for creating/editing with validation for required fields.
- **EventContext**: Handles all API calls (`GET`, `POST`, `PUT`, `DELETE`) and local state.

## Styling and Theming

- The MUI theme is defined in `ClientProviders.tsx` with primary/secondary colors and default background.
- `CssBaseline` resets browser styles.
- Google font Geist is loaded and used via Next’s `next/font/google`.
- Global CSS (in `app/globals.css`) provides basic resets.

## Context and State Management

- **AuthContext**: Wraps the app, listens for Firebase Auth changes, provides `currentUser` and `loading`.
- **EventContext**: Wraps the app, provides `events`, `loading`, `error`, pagination, search, and CRUD methods.
- Custom hooks `useAuth()` and `useEvents()` simplify consumption in components.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1.  Fork the repo
2.  Create a feature branch (`git checkout -b feature/xyz`)
3.  Commit changes (`git commit -m 'Add feature'`)
4.  Push to your branch (`git push origin feature/xyz`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License.
