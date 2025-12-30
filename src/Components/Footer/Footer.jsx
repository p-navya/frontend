import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, Github, Linkedin, Mail } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">StudyBuddy AI</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your holistic AI-powered digital companion for academic success, career growth, and mental well-being.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Features</a>
              </li>
            </ul>
          </div>

          {/* Modules */}
          <div>
            <h3 className="text-white font-semibold mb-4">Modules</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">Mental Health</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Career Guidance</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Academic Resources</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} StudyBuddy AI Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
