import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, Brain, User, X, Sun, Moon, Bell, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'))
  const profileRef = useRef(null)
  const notificationRef = useRef(null)

  const notifications = [
    { id: 1, type: 'success', title: 'Task Completed', message: 'Your Physics assignment analysis is ready.', time: '2 mins ago', icon: CheckCircle, color: 'text-green-500' },
    { id: 2, type: 'message', title: 'New Message', message: 'Your study group has a new discussion active.', time: '1 hour ago', icon: MessageSquare, color: 'text-blue-500' },
    { id: 3, type: 'alert', title: 'Exam Reminder', message: 'Math Midterm is in 3 days. Start reviewing!', time: '5 hours ago', icon: AlertCircle, color: 'text-amber-500' },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        const profileButton = event.target.closest('.profile-btn');
        if (!profileButton) setShowProfile(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        const notificationButton = event.target.closest('.notification-btn');
        if (!notificationButton) setShowNotifications(false)
      }
    }
    if (showProfile || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfile, showNotifications])

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(document.documentElement.classList.contains('dark'))
  }

  const handleLogout = () => {
    navigate('/')
    setTimeout(() => {
      logout()
    }, 100)
  }
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-black/10 backdrop-blur-md border-b border-white/20 dark:border-white/5 shadow-sm transition-all duration-300">
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isDashboard ? 'w-full max-w-full' : 'max-w-7xl'}`}>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-default">
            {isDashboard ? (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center transition-transform relative">
                  <GraduationCap className="w-6 h-6 text-white z-10" />
                  <Brain className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  StudyBuddyAI
                </span>
              </div>
            ) : (
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform relative">
                  <GraduationCap className="w-6 h-6 text-white z-10" />
                  <Brain className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  StudyBuddyAI
                </span>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {!isDashboard && (
              <div className="flex items-center gap-6">
                <Link to="/#features" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors whitespace-nowrap">
                  Features
                </Link>
                <Link to="/#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors whitespace-nowrap">
                  How It Works
                </Link>
                <Link to="/#resources" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors whitespace-nowrap">
                  Resources
                </Link>
                <Link to="/#pricing" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors whitespace-nowrap">
                  Pricing
                </Link>
              </div>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 relative">
                {!isDashboard && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={toggleTheme}
                  className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="notification-btn p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
                  </button>

                  {showNotifications && (
                    <div
                      ref={notificationRef}
                      className="absolute top-full right-0 mt-3 w-80 bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-60 animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
                        <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">3 New</span>
                      </div>
                      <div className="max-h-[350px] overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="flex gap-3">
                              <div className={`p-2 rounded-xl bg-gray-100 dark:bg-white/5 ${n.color}`}>
                                <n.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{n.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-gray-50/50 dark:bg-white/5 text-center">
                        <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View All Notifications</button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="profile-btn flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium border border-gray-200 dark:border-gray-700"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>

                {showProfile && (
                  <div
                    ref={profileRef}
                    className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">Account Information</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-lg">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                          <p className="font-semibold text-gray-800 dark:text-white">{user?.name || 'User'}</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200 break-all">{user?.email || 'N/A'}</p>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</p>
                        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold capitalize">
                          {user?.role || 'Student'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
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
                  className="px-6 py-2 bg-linear-to-r from-teal-500 to-green-500 text-white rounded-full hover:from-teal-600 hover:to-green-600 transition-all font-medium shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="p-2 bg-gray-100 text-gray-700 rounded-full"
                >
                  <User className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-linear-to-r from-teal-500 to-green-500 text-white rounded-full text-sm font-medium"
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
