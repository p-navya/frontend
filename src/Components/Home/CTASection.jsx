import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

const CTASection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-0 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-green-400 to-blue-400 opacity-95" />
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:40px_40px]" 
      />

      <div className="container mx-auto px-4 py-6 md:py-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-balance">
            Ready to Transform Your
            <span className="block">Student Experience?</span>
          </h2>

          {/* Description */}
          <p className="text-base text-white/80 mb-6 max-w-xl mx-auto">
            Join thousands of students already using StudyBuddy AI to thrive academically, professionally, and personally.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-gray-900 hover:bg-gray-100 shadow-lg font-semibold text-base transition-all hover:scale-[1.02]"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white hover:bg-white/10 border border-white/20 font-semibold text-base transition-all hover:scale-[1.02]"
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

