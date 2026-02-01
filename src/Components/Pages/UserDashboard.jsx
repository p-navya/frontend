import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { GraduationCap, BookOpen, Users, Award, Heart, FileText, Send, Paperclip, Bot, X } from 'lucide-react'
import { sendChatMessage } from '../../services/chatbotService'

import { useNavigate } from 'react-router-dom'

function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'mental-support', 'resume-builder', 'student-helper'
  const [mentalSupportMessages, setMentalSupportMessages] = useState([])
  const [resumeBuilderMessages, setResumeBuilderMessages] = useState([])
  const [studentHelperMessages, setStudentHelperMessages] = useState([])

  const [inputMessage, setInputMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const features = [
    { icon: Bot, label: 'Study Buddy', value: 'Ready', color: 'bg-indigo-500' },
    { icon: Users, label: 'Study Groups', value: '0', color: 'bg-green-500' },
    { icon: Award, label: 'Achievements', value: '0', color: 'bg-purple-500' }
  ]

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Student'}!</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-2 gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'mental-support', label: 'Mental Support' },
            { id: 'resume-builder', label: 'Resume Builder' },
            // { id: 'student-helper', label: 'Study Helper' } // Moved to separate page
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${activeTab === tab.id
                ? 'text-purple-700 border-b-2 border-purple-700'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div
                onClick={() => navigate('/chat')}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-indigo-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Study Helper</h3>
                    <p className="text-gray-600 text-sm">Upload PDFs, ask questions, get explanations</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('mental-support')}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-pink-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Mental Support</h3>
                    <p className="text-gray-600 text-sm">Emotional support and stress relief</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('resume-builder')}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-teal-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Resume Builder</h3>
                    <p className="text-gray-600 text-sm">Build or Review your Resume</p>
                  </div>
                </div>
              </div>
            </div>

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
          </>
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
    <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col">
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
                  ? 'bg-purple-700 text-white'
                  : 'bg-gray-100 text-gray-800'
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
          <div className="mb-2 flex items-center gap-2 bg-gray-100 p-2 rounded-lg inline-block">
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
            className="p-3 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition disabled:opacity-50 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
