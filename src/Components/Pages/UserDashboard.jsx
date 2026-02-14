import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { GraduationCap, BookOpen, Users, Award, Heart, FileText, Send, Paperclip, Bot, X, ChevronRight, ArrowRight, Play, Edit, Clock, Check } from 'lucide-react'
import { sendChatMessage } from '../../services/chatbotService'
import EditProfileModal from './EditProfileModal' // Import the modal

const ViewProfileModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imageUrl}
          alt="Profile"
          className="w-full h-full object-contain max-h-[85vh] rounded-xl shadow-2xl"
        />
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'

function UserDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  console.log("UserDashboard Loaded - Study Assistant Widget Ready");
  // Initialize stats and profile from localStorage
  const calculateStats = () => {
    const myGroups = JSON.parse(localStorage.getItem('studybuddy_my_groups') || '[]');
    const history = JSON.parse(localStorage.getItem('studybuddy_achievements') || '[]');
    const totalXP = history.reduce((sum, item) => sum + item.xp, 0);
    const studyHours = parseFloat(localStorage.getItem('studybuddy_study_hours') || '0');
    const notesCount = parseInt(localStorage.getItem('studybuddy_notes_count') || '0');

    return {
      groups: myGroups.length,
      achievements: history.length,
      score: totalXP,
      studyHours,
      notesCount
    };
  };

  const getSavedProfile = () => {
    try {
      return JSON.parse(localStorage.getItem('user_profile_data') || '{}');
    } catch {
      return {};
    }
  };

  const [activeTab, setActiveTab] = useState('overview')

  const [stats, setStats] = useState(calculateStats())
  const [userProfile, setUserProfile] = useState(getSavedProfile())
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showEditProfile, setShowEditProfile] = useState(false) // State for modal
  const [viewProfileImage, setViewProfileImage] = useState(null) // State for viewing image


  // Listen for storage changes to update profile and stats
  useEffect(() => {
    const handleStorageChange = () => {
      setStats(calculateStats());
      setUserProfile(getSavedProfile());
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event dispatch for same-window updates
    window.addEventListener('profileUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleStorageChange);
    };
  }, []);


  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<span key={`empty-${i}`}></span>)
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear()

      days.push(
        <span
          key={i}
          className={`p-1 rounded-full cursor-pointer transition-all w-8 h-8 flex items-center justify-center mx-auto ${isToday
            ? 'bg-pink-500 text-white shadow-md shadow-pink-200 dark:shadow-pink-900/40'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
        >
          {i}
        </span>
      )
    }
    return days
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  useEffect(() => {
    const handleStorageChange = () => setStats(calculateStats());
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange); // Also update on focus
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);
  const [mentalSupportMessages, setMentalSupportMessages] = useState([])
  const [resumeBuilderMessages, setResumeBuilderMessages] = useState([])
  const [studentHelperMessages, setStudentHelperMessages] = useState([])

  const [inputMessage, setInputMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mentalSupportMessages, resumeBuilderMessages, studentHelperMessages])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    } else {
      alert('Please select a PDF file')
    }
  }

  const handleSendMessage = async (mode) => {
    if ((!inputMessage.trim() && !selectedFile) || loading) return

    const userMessage = inputMessage.trim()
    const fileToSend = selectedFile

    setInputMessage('')
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''

    setLoading(true)

    // Get current conversation history (simplify mapping)
    let currentMessages = []
    let setMessages = null

    if (mode === 'mental-support') {
      currentMessages = mentalSupportMessages
      setMessages = setMentalSupportMessages
    } else if (mode === 'resume-builder') {
      currentMessages = resumeBuilderMessages
      setMessages = setResumeBuilderMessages
    } else {
      currentMessages = studentHelperMessages
      setMessages = setStudentHelperMessages
    }

    const conversationHistory = currentMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Add user message to UI
    const displayContent = fileToSend
      ? `[Attached: ${fileToSend.name}] ${userMessage}`
      : userMessage

    const newUserMessage = { role: 'user', content: displayContent }
    setMessages(prev => [...prev, newUserMessage])

    // Specific logic for mode if file is attached
    let actualMode = mode
    if (fileToSend) {
      if (mode === 'resume-builder') actualMode = 'resume-review'
      if (mode === 'student-helper') actualMode = 'pdf-qa'
    }

    try {
      const response = await sendChatMessage(userMessage, conversationHistory, actualMode, fileToSend)

      if (response.success) {
        const aiMessage = { role: 'assistant', content: response.data.response }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error(response.message || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = { role: 'assistant', content: `Sorry, I encountered an error: ${error.message}` }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 pt-20 pb-6 px-4 md:px-8 md:pt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">{getGreeting()}, {user?.name || 'Student'}!</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Welcome to your Student Dashboard</p>
          </div>
        </div>


        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-1 gap-1 mb-4 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'study-helper', label: 'Study Helper' },
            { id: 'resume-builder', label: 'Resume Architect' },
            { id: 'resources', label: 'Resource Hub' },
            { id: 'wellness', label: 'Wellness' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'study-helper') {
                  navigate('/chat')
                } else if (tab.id === 'resume-builder') {
                  navigate('/resume')
                } else if (tab.id === 'resources') {
                  navigate('/resources')
                } else if (tab.id === 'wellness') {
                  navigate('/wellness')
                } else {
                  setActiveTab(tab.id)
                }
              }}
              className={`px-3 md:px-5 py-2 text-sm font-semibold transition whitespace-nowrap ${activeTab === tab.id
                ? 'text-purple-700 border-b-2 border-purple-700 dark:text-purple-400 dark:border-purple-400'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm p-3 rounded-2xl border border-white/20 dark:border-white/5">

              {/* Left Column - Chat & Actionable */}
              <div className="md:col-span-3 flex flex-col gap-4">
                {/* Chat / Study Helper Widget */}
                <div
                  onClick={() => navigate('/chat')}
                  className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-white/5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden group h-72 flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="w-20 h-20 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full blur-xl" />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-800 dark:text-gray-200">
                      <Bot className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">Study Assistant</h3>
                      <p className="text-xs text-gray-400">Ask anything...</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-t-2xl rounded-br-2xl text-xs text-gray-600 dark:text-gray-300">
                      Can you explain the theory of relativity?
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-t-2xl rounded-bl-2xl text-xs text-indigo-700 dark:text-indigo-300 ml-auto max-w-[90%]">
                      Sure! It essentially states that...
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-green-600 text-xs font-bold group-hover:gap-3 transition-all">
                    Start new session <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Resume Architect Widget */}
                <div
                  onClick={() => navigate('/resume')}
                  className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-teal-200/50 dark:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-200/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-2xl text-teal-600 dark:text-teal-300">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold px-2 py-1 rounded-full">New</div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Resume Architect</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mb-4">Build professional resumes with AI assistance.</p>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-teal-500 h-full w-3/4 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span>Profile Strength</span>
                    <span>75%</span>
                  </div>
                </div>
              </div>

              {/* Middle Column - Stats & Activity */}
              <div className="md:col-span-6 flex flex-col gap-4">

                {/* Top Row Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Study Groups Stat */}
                  <div
                    onClick={() => navigate('/study-groups')}
                    className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-green-200/50 dark:border-green-500/30 hover:shadow-2xl hover:shadow-green-200/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Study Groups</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-gray-800 dark:text-white">{stats.groups}</span>
                      <span className="text-xs text-green-500 font-bold bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">Active</span>
                    </div>

                    {/* Mini Line Chart Visualization */}
                    <div className="mt-4 h-12 flex items-end gap-1 opacity-50">
                      <div className="w-1/5 bg-green-200 dark:bg-green-700 h-[40%] rounded-t-sm"></div>
                      <div className="w-1/5 bg-green-300 dark:bg-green-600 h-[70%] rounded-t-sm"></div>
                      <div className="w-1/5 bg-green-400 dark:bg-green-500 h-[50%] rounded-t-sm"></div>
                      <div className="w-1/5 bg-green-500 dark:bg-green-400 h-[90%] rounded-t-sm"></div>
                      <div className="w-1/5 bg-green-600 dark:bg-green-300 h-[60%] rounded-t-sm"></div>
                    </div>
                  </div>

                  {/* Achievements Stat */}
                  <div
                    onClick={() => navigate('/achievements')}
                    className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-purple-200/50 dark:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-200/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Achievements</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-gray-800 dark:text-white">{stats.achievements}</span>
                      <span className="text-xs text-purple-500 font-bold bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-full">Tests</span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-gray-400 dark:text-gray-500">
                      Score: <span className="text-purple-600 dark:text-purple-400">{stats.score} XP</span>
                    </div>

                    {/* Mini Progress Circle */}
                    <div className="absolute right-4 bottom-4 w-12 h-12 rounded-full border-4 border-purple-100 dark:border-purple-800 border-t-purple-500 flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                </div>

                {/* Activity Hours Chart */}
                <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-orange-200/50 dark:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-200/40 transition-all duration-300 flex-1 min-h-[200px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">Activity Hours</h3>
                    <select className="bg-gray-50 dark:bg-gray-700 border-none text-xs text-gray-500 dark:text-gray-300 rounded-lg px-2 py-1 outline-none font-medium">
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div className="flex items-end justify-between h-40 gap-2 md:gap-4 px-2">
                    {/* Mock Bars */}
                    {[35, 55, 40, 70, 50, 65, 45].map((h, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 w-full">
                        <div
                          className="w-full max-w-[24px] bg-orange-100 rounded-full relative group transition-all hover:bg-orange-200"
                          style={{ height: '100%' }}
                        >
                          <div
                            className="absolute bottom-0 w-full bg-orange-400 rounded-full transition-all group-hover:bg-orange-500"
                            style={{ height: `${h}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Classes / Schedule */}
                <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-blue-200/50 dark:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white">Today's Schedule</h3>
                    <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="w-4 h-4 text-gray-400" /></button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md rounded-2xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-blue-100">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">10</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Physics Mechanics</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">10:00 AM - 11:30 AM</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center shadow-sm group-hover:bg-blue-500 group-hover:text-white transition group-hover:border-transparent">
                        <Play className="w-3 h-3 ml-0.5 fill-current" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold">12</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Design Principles</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">12:00 PM - 01:30 PM</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center shadow-sm group-hover:bg-pink-500 group-hover:text-white transition group-hover:border-transparent">
                        <Play className="w-3 h-3 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column - Profile & Calendar */}
              <div className="md:col-span-3 flex flex-col gap-4">

                {/* Profile Card */}
                <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-blue-200/50 dark:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-300 text-center relative">
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-gray-700/50 rounded-full hover:bg-white dark:hover:bg-gray-700 text-gray-400 backdrop-blur-sm transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-4 p-1 bg-white dark:bg-gray-700 shadow-md cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => userProfile.profileImage && setViewProfileImage(userProfile.profileImage)}
                  >
                    <div className="w-full h-full rounded-full flex items-center justify-center text-2xl overflow-hidden bg-gray-100 dark:bg-gray-600">
                      {userProfile.profileImage ? (
                        <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">👨‍🎓</span>
                      )}
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">{userProfile.name || user?.name || 'Student'}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">@{userProfile.email?.split('@')[0] || user?.email?.split('@')[0] || 'username'}</p>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-purple-50 dark:bg-purple-900/40 p-2 rounded-2xl" title="Study Hours">
                      <Clock className="w-4 h-4 text-purple-500 dark:text-purple-300 mx-auto mb-1" />
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{stats.studyHours}h</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/40 p-2 rounded-2xl" title="Notes/Resources">
                      <FileText className="w-4 h-4 text-orange-500 dark:text-orange-300 mx-auto mb-1" />
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{stats.notesCount}</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/40 p-2 rounded-2xl" title="Achievements Unlocked">
                      <Check className="w-4 h-4 text-green-500 dark:text-green-300 mx-auto mb-1" />
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{stats.achievements}</div>
                    </div>
                  </div>
                </div>

                {/* Resource Hub Link (styled as Total Courses) */}
                <div
                  onClick={() => navigate('/resources')}
                  className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-pink-200/50 dark:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-200/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">Resource Hub</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-extrabold text-gray-800 dark:text-white">20+</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-8 bg-pink-400 rounded-full opacity-60"></div>
                      <div className="w-2 h-6 bg-purple-400 rounded-full opacity-60"></div>
                      <div className="w-2 h-10 bg-indigo-400 rounded-full opacity-60"></div>
                      <div className="w-2 h-5 bg-blue-400 rounded-full opacity-60"></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Access semester materials</p>
                </div>

                {/* Wellness / Calendar Widget */}
                <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-rose-200/50 dark:border-rose-500/30 hover:shadow-2xl hover:shadow-rose-200/40 transition-all duration-300 flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                    <div className="flex gap-2">
                      <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full bg-white/50 dark:bg-gray-700/50 shadow-sm transition"><ChevronRight className="w-3 h-3 rotate-180 dark:text-gray-300" /></button>
                      <button onClick={handleNextMonth} className="p-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full bg-white/50 dark:bg-gray-700/50 shadow-sm transition"><ChevronRight className="w-3 h-3 dark:text-gray-300" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-400 font-medium">
                    <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-700 dark:text-gray-300">
                    {renderCalendarDays()}
                  </div>
                  <button
                    onClick={() => navigate('/wellness')}
                    className="mt-6 w-full py-2 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 rounded-xl text-xs font-bold hover:bg-pink-100 dark:hover:bg-pink-900/50 transition flex items-center justify-center gap-2 border border-transparent dark:border-pink-500/30"
                  >
                    <Heart className="w-3 h-3" /> Wellness Check-in
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === 'mental-support' && (
          <ChatInterface
            messages={mentalSupportMessages}
            mode="mental-support"
            title="Mental Support Assistant"
            icon={Heart}
            color="bg-pink-500"
            loading={loading}
            messagesEndRef={messagesEndRef}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'resume-builder' && (
          <ChatInterface
            messages={resumeBuilderMessages}
            mode="resume-builder"
            title="Resume Builder & Review"
            icon={FileText}
            color="bg-teal-500"
            loading={loading}
            messagesEndRef={messagesEndRef}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'student-helper' && (
          <ChatInterface
            messages={studentHelperMessages}
            mode="student-helper"
            title="AI Study Helper"
            icon={Bot}
            color="bg-indigo-500"
            loading={loading}
            messagesEndRef={messagesEndRef}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
          />
        )}

        {/* Render Edit Profile Modal */}
        {showEditProfile && (
          <EditProfileModal onClose={() => setShowEditProfile(false)} />
        )}

        {/* Render View Profile Modal */}
        {viewProfileImage && (
          <ViewProfileModal imageUrl={viewProfileImage} onClose={() => setViewProfileImage(null)} />
        )}

      </div>
    </div>
  )
}

const ChatInterface = ({
  messages,
  mode,
  title,
  icon,
  color,
  loading,
  messagesEndRef,
  selectedFile,
  setSelectedFile,
  fileInputRef,
  handleFileSelect,
  inputMessage,
  setInputMessage,
  handleSendMessage
}) => {
  const Icon = icon
  const showFileUpload = mode === 'resume-builder' || mode === 'student-helper'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-[600px] flex flex-col border border-transparent dark:border-gray-700">
      {/* Chat Header */}
      <div className={`${color} text-white p-4 rounded-t-2xl flex items-center gap-3`}>
        <Icon className="w-6 h-6" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>




      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold mb-2">Start a conversation</p>
              <p className="text-sm max-w-xs mx-auto">
                {mode === 'mental-support' && "I'm here to support you. Share how you're feeling."}
                {mode === 'resume-builder' && "I can help write your resume, or upload one for review!"}
                {mode === 'student-helper' && "Ask me anything, or upload a PDF to analyze."}
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        {/* File Preview */}
        {selectedFile && (
          <div className="mb-2 inline-flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
            <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">{selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-2 items-end">
          {showFileUpload && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-500 hover:text-purple-700 hover:bg-gray-100 rounded-full transition"
                title="Attach PDF"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </>
          )}

          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(mode)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-purple-500 resize-none h-[50px] max-h-[100px]"
            disabled={loading}
            rows={1}
          />
          <button
            onClick={() => handleSendMessage(mode)}
            disabled={loading || (!inputMessage.trim() && !selectedFile)}
            className="p-3 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition disabled:opacity-50 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
