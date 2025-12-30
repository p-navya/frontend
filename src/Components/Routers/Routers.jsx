import React from 'react'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Dashboard from '../Pages/Dashboard'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children, redirectIfAuth = true }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (redirectIfAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function Routers() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
            <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  )
}

export default Routers