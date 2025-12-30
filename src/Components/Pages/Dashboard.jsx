import React from 'react'
import { useAuth } from '../../context/AuthContext'

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Welcome, {user?.name || 'User'}!</h1>
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-semibold capitalize">{user?.role || 'student'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

