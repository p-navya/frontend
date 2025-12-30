import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Users, UserPlus, GraduationCap, Briefcase, Shield } from 'lucide-react'
import { apiRequest } from '../../config/api'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({ students: 0, mentors: 0, admins: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [showAddMentor, setShowAddMentor] = useState(false)
  const [mentorForm, setMentorForm] = useState({ name: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await apiRequest('/admin/stats')
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMentor = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await apiRequest('/admin/mentors', {
        method: 'POST',
        body: JSON.stringify(mentorForm)
      })

      if (response.success) {
        setMessage({ type: 'success', text: 'Mentor created successfully! Credentials email sent.' })
        setMentorForm({ name: '', email: '', password: '' })
        setShowAddMentor(false)
        fetchStats()
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create mentor' })
    } finally {
      setSubmitting(false)
    }
  }

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: GraduationCap, color: 'bg-blue-500' },
    { label: 'Total Mentors', value: stats.mentors, icon: Briefcase, color: 'bg-orange-500' },
    { label: 'Total Admins', value: stats.admins, icon: Shield, color: 'bg-purple-500' },
    { label: 'Total Users', value: stats.total, icon: Users, color: 'bg-green-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Mentor Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Mentors</h2>
            <button
              onClick={() => setShowAddMentor(!showAddMentor)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              {showAddMentor ? 'Cancel' : 'Add New Mentor'}
            </button>
          </div>

          {message.text && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {showAddMentor && (
            <form onSubmit={handleAddMentor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={mentorForm.name}
                  onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter mentor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={mentorForm.email}
                  onChange={(e) => setMentorForm({ ...mentorForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter mentor email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Password</label>
                <input
                  type="password"
                  required
                  value={mentorForm.password}
                  onChange={(e) => setMentorForm({ ...mentorForm, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter initial password"
                />
                <p className="text-sm text-gray-500 mt-1">Mentor will receive credentials via email and must change password on first login</p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {submitting ? 'Creating...' : 'Create Mentor'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

