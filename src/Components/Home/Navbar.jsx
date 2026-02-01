import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-gray-200/30">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-green-400 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-800">
              StudyBuddy<span className="text-sky-500">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#modules" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Resources
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-gradient-to-r from-sky-400 to-green-400 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-gradient-to-r from-sky-400 to-green-400 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar

