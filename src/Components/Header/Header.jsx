import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Brain } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform relative">
              <GraduationCap className="w-6 h-6 text-white z-10" />
              <Brain className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              StudyBuddyAI
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
              Features
            </Link>
            <Link to="/#how-it-works" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
              How It Works
            </Link>
            <Link to="/#resources" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
              Resources
            </Link>
            <Link to="/#pricing" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
              Pricing
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-all font-medium border-2 border-gray-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full hover:from-teal-600 hover:to-green-600 transition-all font-medium shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full text-sm font-medium"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
