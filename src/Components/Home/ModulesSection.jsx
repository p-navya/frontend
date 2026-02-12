import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, Briefcase, BookOpen } from 'lucide-react'

const ModuleCard = ({ title, description, features, icon, colorClass, buttonText, link }) => {
  const colorStyles = {
    mental: {
      bg: "bg-green-50",
      border: "border-green-500/20",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      text: "text-green-700",
      dotBg: "bg-gradient-to-br from-green-500 to-green-600",
    },
    career: {
      bg: "bg-blue-50",
      border: "border-blue-500/20",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      text: "text-blue-700",
      dotBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    resources: {
      bg: "bg-orange-50",
      border: "border-orange-500/20",
      iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
      text: "text-orange-700",
      dotBg: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
  }

  const styles = colorStyles[colorClass]

  return (
    <div className={`${styles.bg} border ${styles.border} shadow-md hover:shadow-lg group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 cursor-pointer`}>
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl ${styles.iconBg} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-white">
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className={`text-xl font-bold ${styles.text} mb-3`}>{title}</h3>
      <p className="text-gray-600 mb-5 text-sm leading-relaxed">{description}</p>

      {/* Features list */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <div className={`w-1.5 h-1.5 rounded-full ${styles.dotBg} mt-2 flex-shrink-0`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <Link to={link}>
        <button className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] ${colorClass === 'mental'
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
            : colorClass === 'career'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg'
          }`}>
          {buttonText}
        </button>
      </Link>
    </div>
  )
}

const ModulesSection = () => {
  const modules = [
    {
      title: "Mental Health Support",
      description: "An empathetic AI companion that understands your emotions and provides supportive conversations when you need them most.",
      features: [
        "Emotion-adaptive conversations",
        "Stress & burnout detection",
        "Crisis support & resources",
        "Anonymous & FERPA compliant",
      ],
      icon: <Brain className="w-7 h-7" />,
      colorClass: "mental",
      buttonText: "Start Chatting",
      link: "/dashboard",
    },
    {
      title: "Career Guidance",
      description: "Upload your resume and get AI-powered feedback, interview prep, and personalized career path recommendations.",
      features: [
        "Resume analysis & ATS scoring",
        "Custom interview Q&A prep",
        "Skill gap identification",
        "Job matching & recommendations",
      ],
      icon: <Briefcase className="w-7 h-7" />,
      colorClass: "career",
      buttonText: "Analyze Resume",
      link: "/dashboard",
    },
    {
      title: "Academic Resources",
      description: "Share and discover study materials, notes, and question papers with intelligent semantic search.",
      features: [
        "Smart content categorization",
        "Natural language search",
        "Peer resource ratings",
        "Course-specific collections",
      ],
      icon: <BookOpen className="w-7 h-7" />,
      colorClass: "resources",
      buttonText: "Browse Resources",
      link: "/dashboard",
    },
  ]

  return (
    <section className="py-0 bg-white relative">
      <div className="container mx-auto px-4 pt-4 pb-12 md:pt-6 md:pb-16">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Three Powerful Modules,
            <span className="block text-sky-500">One Unified Platform</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to thrive academically, professionally, and personally.
          </p>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <div
              key={module.title}
              className="animate-[fade-in-up_0.8s_ease-out_forwards] opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ModuleCard {...module} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ModulesSection

