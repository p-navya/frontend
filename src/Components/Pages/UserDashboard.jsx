import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react'

function UserDashboard() {
  const { user, logout } = useAuth()

  const features = [
    { icon: BookOpen, label: 'My Courses', value: '0', color: 'bg-blue-500' },
    { icon: Users, label: 'Study Groups', value: '0', color: 'bg-green-500' },
    { icon: Award, label: 'Achievements', value: '0', color: 'bg-purple-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Student'}!</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{feature.label}</h3>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{feature.value}</p>
            </div>
          ))}
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Role</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{user?.role || 'student'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

