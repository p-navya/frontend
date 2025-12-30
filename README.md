# StudyBuddy Frontend

Frontend application for StudyBuddy built with React, Vite, and Tailwind CSS.

## Features

- User authentication (Login/Register)
- Beautiful flip card login/register UI
- Protected routes
- JWT token management
- Responsive design

## Prerequisites

1. Node.js (v16 or higher)
2. Backend server running on `http://localhost:5000`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the Frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:5173` by default.

## Project Structure

```
Frontend/
├── src/
│   ├── Components/          # React components
│   │   ├── Pages/          # Page components
│   │   │   ├── Login.jsx   # Login/Register page
│   │   │   └── Dashboard.jsx # Dashboard page
│   │   ├── Layout/         # Layout components
│   │   ├── Header/         # Header component
│   │   ├── Footer/         # Footer component
│   │   └── Routers/        # Route definitions
│   ├── config/             # Configuration files
│   │   └── api.js          # API configuration
│   ├── services/           # API services
│   │   └── authService.js  # Authentication service
│   ├── context/            # React Context providers
│   │   └── AuthContext.jsx # Authentication context
│   ├── App.jsx             # Main App component
│   └── main.jsx            # Entry point
└── package.json
```

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: `http://localhost:5000/api`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Integration with Backend

The frontend is integrated with the backend API:
- Authentication endpoints: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- JWT tokens are stored in localStorage
- Protected routes require authentication
- Automatic redirects for authenticated/unauthenticated users
