import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Users, BookOpen, Settings, Lock,
  Award, FileText, Heart, Plus,
  Trash2, Check, ArrowRight, Activity,
  Upload, MessageSquare, Briefcase
} from 'lucide-react'
import { apiRequest } from '../../config/api'

function MentorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // State for Password Change
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Dashboard State
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    quizzes: 0,
    resources: 0
  })
  const [activityData, setActivityData] = useState([])
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  // Load Initial Data
  useEffect(() => {
    // Check first login
    if (user?.first_login) {
      setShowPasswordChange(true)
    }

    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    // 1. Fetch Activity Stats (Reuse User Logic)
    try {
      // Initialize with local cache
      const storedActivity = JSON.parse(localStorage.getItem('studybuddy_dashboard_activity') || '[]');
      setActivityData(storedActivity);

      const activityResponse = await apiRequest('/activity/stats');
      if (activityResponse.success && activityResponse.data.length > 0) {
        setActivityData(activityResponse.data);
        localStorage.setItem('studybuddy_dashboard_activity', JSON.stringify(activityResponse.data));
      } else if (storedActivity.length === 0) {
        // Fallback Mock
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const newActivity = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dayName = days[d.getDay()];
          newActivity.push({ day: dayName[0], fullDay: dayName, date: d.toISOString(), hours: 0 });
        }
        setActivityData(newActivity);
      }
    } catch (error) {
      console.error("Failed to fetch activity:", error);
    }

    // 2. Fetch Tasks
    try {
      const tasksResponse = await apiRequest('/tasks');
      if (tasksResponse.success) {
        setTasks(tasksResponse.data);
      } else {
        // Mock for new mentors
        setTasks([
          { id: 'm1', text: "Review Student Quizzes", completed: false, isMock: true },
          { id: 'm2', text: "Upload Physics Notes", completed: false, isMock: true }
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }

    // 3. Fetch Quick Stats (Mocked or Partial Real)
    // In a real app we'd need mentor specific endpoints like /mentor/stats
    setStats({
      students: 12, // Mock
      courses: 3,   // Mock
      quizzes: 5,   // Mock
      resources: 8  // Mock
    });
  };

  // --- Password Logic ---
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      return
    }

    setSubmitting(true)

    try {
      const response = await apiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      if (response.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setShowPasswordChange(false), 1500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' })
    } finally {
      setSubmitting(false)
    }
  }

  // --- Task Logic ---
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    // Optimistic
    const tempId = Date.now();
    const t = { id: tempId, text: newTask, completed: false, isPending: true };
    setTasks(prev => [t, ...prev]);
    setNewTask('');

    try {
      const res = await apiRequest('/tasks', { method: 'POST', body: JSON.stringify({ text: t.text }) });
      if (res.success) {
        setTasks(prev => prev.map(task => task.id === tempId ? res.data : task));
      } else {
        setTasks(prev => prev.filter(task => task.id !== tempId));
      }
    } catch (error) {
      console.error("Add task failed", error);
      setTasks(prev => prev.filter(task => task.id !== tempId));
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Optimistic
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (task.isMock) return;

    try {
      await apiRequest(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify({ completed: !task.completed }) });
    } catch (error) {
      console.error("Toggle task failed", error);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); // Revert
    }
  };

  const deleteTask = async (id) => {
    // Optimistic
    const prevTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));
    const task = prevTasks.find(t => t.id === id);
    if (task?.isMock) return;

    try {
      await apiRequest(`/tasks/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Delete task failed", error);
      setTasks(prevTasks); // Revert
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-6 md:px-8 py-24 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Mentor Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Manage your students, resources, and assessments.
            </p>
          </div>
        </div>

        {/* Password Modal */}
        {showPasswordChange && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Security</h2>
                <button onClick={() => setShowPasswordChange(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><Settings className="w-5 h-5" /></button>
              </div>

              {message.text && (
                <div className={`mb-4 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                  placeholder="Current password"
                />
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                  placeholder="New password (min 6 chars)"
                />
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                  placeholder="Confirm new password"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg disabled:opacity-70"
                >
                  {submitting ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Quick Access & Activity */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Students</div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.students}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Courses</div>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.courses}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Quizzes</div>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.quizzes}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Resources</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.resources}</div>
              </div>
            </div>

            {/* Mentor Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Quiz */}
              <div
                onClick={() => navigate('/achievements')}
                className="group relative overflow-hidden bg-grad-to-br from-purple-600 to-indigo-700 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Award className="w-24 h-24 text-purple-600 dark:text-white" />
                </div>
                <div className="relative z-10">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl w-fit mb-4">
                    <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Create Quiz</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Design assessments and track student performance.</p>
                  <span className="inline-flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                    Go to Assessments <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>

              {/* Upload Resources */}
              <div
                onClick={() => navigate('/resources')}
                className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-emerald-100 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Upload className="w-24 h-24 text-emerald-600 dark:text-white" />
                </div>
                <div className="relative z-10">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl w-fit mb-4">
                    <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Content</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Share study materials, notes, and guides.</p>
                  <span className="inline-flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    Manage Resources <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>

              {/* Manage Groups */}
              <div
                onClick={() => navigate('/groups')}
                className="group bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Study Groups</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage student communities</p>
                  </div>
                </div>
              </div>

              {/* Resume Architect */}
              <div
                onClick={() => navigate('/resume')}
                className="group bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-900 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl text-teal-600 dark:text-teal-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Resume Architect</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Review student resumes</p>
                  </div>
                </div>
              </div>

              {/* Wellness */}
              <div
                onClick={() => navigate('/wellness')}
                className="group bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-900 transition-all cursor-pointer md:col-span-2"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">AI Wellness Center</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Mental health resources and support</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" /> Activity Overview
                </h3>
                <span className="text-xs text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-lg">Last 7 Days</span>
              </div>
              <div className="flex items-end justify-between h-48 gap-3">
                {activityData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-full relative overflow-hidden">
                      <div
                        className="absolute bottom-0 w-full bg-orange-400 dark:bg-orange-500 rounded-full transition-all duration-1000 group-hover:bg-orange-500"
                        style={{ height: `${data.hours}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Tasks & Profile */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* Task Manager */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-blue-100 dark:border-gray-700 flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white text-xl">My Tasks</h3>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg text-xs font-bold">
                  {tasks.filter(t => !t.completed).length} Pending
                </span>
              </div>

              <form onSubmit={addTask} className="relative mb-6">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {tasks.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    No tasks yet. Add one above!
                  </div>
                )}
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`group flex items-center p-3 rounded-xl border transition-all duration-200 ${task.completed
                      ? 'bg-gray-50 dark:bg-gray-900/50 border-transparent opacity-60'
                      : 'bg-white dark:bg-gray-700/50 border-gray-100 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                      }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${task.completed
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 dark:border-gray-500 text-transparent hover:border-blue-500'
                        }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <span className={`flex-1 text-sm font-medium ${task.completed
                      ? 'text-gray-400 line-through'
                      : 'text-gray-700 dark:text-gray-200'
                      }`}>
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Profile / Placeholder */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 text-white text-center shadow-xl">
              <div className="inline-flex p-4 bg-white/10 backdrop-blur-md rounded-full mb-4">
                <Users className="w-8 h-8 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mentor Community</h3>
              <p className="text-indigo-200 text-sm mb-6">Connect with other mentors and share teaching strategies.</p>
              <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-gray-50 transition">
                Join Discussion
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorDashboard

