import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

const CTASection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-0 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-linear-to-r from-sky-400 via-green-400 to-blue-400 opacity-95" />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-size-[40px_40px]"
      />

      <div className="container mx-auto px-4 py-3 md:py-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 text-balance leading-tight">
            Ready to Transform Your
            <span className="block italic mt-0.5">Student Experience?</span>
          </h2>

          {/* Description */}
          <p className="text-xs text-white/80 mb-4 max-w-xl mx-auto">
            Join thousands of students thrive academically, professionally, and personally with StudyBuddy AI.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-white text-gray-900 hover:bg-gray-100 shadow-md font-bold text-xs transition-all hover:scale-[1.02]"
            >
              Get Started for Free
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg text-white hover:bg-white/10 border border-white/20 font-bold text-xs transition-all hover:scale-[1.02]"
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection

