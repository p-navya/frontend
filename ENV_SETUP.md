# Frontend Environment Setup

## Environment Variables

Create a `.env` file in the `Frontend` directory with the following:

```env
VITE_API_URL=https://backend-b44u.onrender.com/api
```

## For Local Development

If you want to use your local backend:

```env
VITE_API_URL=http://localhost:5000/api
```

## Important Notes

1. **VITE_ prefix is required** - Vite only exposes environment variables that start with `VITE_`
2. **Include /api** - Your backend routes are under `/api`, so the URL should end with `/api`
3. **Restart dev server** - After creating/updating `.env`, restart your Vite dev server

## Current Configuration

- **Production Backend**: `https://backend-b44u.onrender.com/api`
- **Local Backend**: `http://localhost:5000/api` (fallback if env var not set)

