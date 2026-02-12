import React from 'react'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import UserDashboard from '../Pages/UserDashboard'
import AdminDashboard from '../Pages/AdminDashboard'
import MentorDashboard from '../Pages/MentorDashboard'
import ChatPage from '../Pages/ChatPage'
import ResumePage from '../Pages/ResumePage'
import ResourcesPage from '../Pages/ResourcesPage'
import WellnessPage from '../Pages/WellnessPage'
import StudyGroupsPage from '../Pages/StudyGroupsPage'
import AchievementsPage from '../Pages/AchievementsPage'
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

// Role-based dashboard component
const RoleBasedDashboard = () => {
  const { user } = useAuth()

  if (user?.role === 'admin') {
    return <AdminDashboard />
  } else if (user?.role === 'mentor') {
    return <MentorDashboard />
  } else {
    return <UserDashboard />
  }
}

function Routers() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/signup' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><RoleBasedDashboard /></ProtectedRoute>} />
        <Route path='/chat' element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path='/resume' element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
        <Route path='/resources' element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
        <Route path='/wellness' element={<ProtectedRoute><WellnessPage /></ProtectedRoute>} />
        <Route path='/study-groups' element={<ProtectedRoute><StudyGroupsPage /></ProtectedRoute>} />
        <Route path='/achievements' element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default Routers