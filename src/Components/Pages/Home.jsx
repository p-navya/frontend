import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Heart, Briefcase, BookOpen, Search, FileText, Target, MessageCircle } from 'lucide-react'

function Home() {
  const navigate = useNavigate()

  const features = [
    {
      title: 'Mental Health Module',
      icon: Heart,
      color: 'bg-teal-500',
      features: ['Emotion-Adaptive Chat', 'Stress/Burnout Alerts'],
      description: 'AI-powered emotional support system that adapts to your mood and helps you manage stress.'
    },
    {
      title: 'Career Guidance Module',
      icon: Briefcase,
      color: 'bg-orange-500',
      features: ['Resume Analysis', 'Job/Skill Matching'],
      description: 'Get personalized career advice and match with opportunities that fit your skills.'
    },
    {
      title: 'Academic Resource Module',
      icon: BookOpen,
      color: 'bg-green-500',
      features: ['Smart Search', 'Study Groups'],
      description: 'Access curated academic resources and connect with study partners effortlessly.'
    }
  ]

  const aiCapabilities = [
    { name: 'NLP', icon: Brain, description: 'Natural Language Processing' },
    { name: 'Sentiment Analysis', icon: MessageCircle, description: 'Understand your emotions' },
    { name: 'Recommendations', icon: Target, description: 'Personalized suggestions' },
    { name: 'Document Intelligence', icon: FileText, description: 'Smart document analysis' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">AI-Powered Digital Companion</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              StudyBuddy AI Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your Holistic AI-Powered Digital Companion for Academic Success, Career Growth, and Mental Well-being
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all shadow-lg border-2 border-purple-200"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Unified Student Data Visualization */}
          <div className="mt-20 bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Unified Student Data</h2>
              <p className="text-gray-600">All your academic, career, and wellness data in one place</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((module, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                    <div className={`w-16 h-16 ${module.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <module.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{module.title}</h3>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <ul className="space-y-2">
                      {module.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Powered by Advanced AI/ML</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cutting-edge artificial intelligence and machine learning technologies working together
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiCapabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <capability.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{capability.name}</h3>
                <p className="text-gray-600 text-sm">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Integrated Data Sources</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connected to multiple data sources for comprehensive support
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <Briefcase className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Job Market Data</h3>
              <p className="text-gray-600">Real-time job market insights and opportunities</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <BookOpen className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Course Catalogs</h3>
              <p className="text-gray-600">Access to comprehensive course information</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <Search className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Online Learning Platforms</h3>
              <p className="text-gray-600">Integration with popular learning resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Student Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who are already using StudyBuddy AI to achieve their goals
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home

