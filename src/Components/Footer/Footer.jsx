import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Twitter, Linkedin, Github, Mail } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    product: [
      { label: "Mental Health", href: "#modules" },
      { label: "Career Guidance", href: "#modules" },
      { label: "Academic Resources", href: "#modules" },
      { label: "Pricing", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "FERPA Compliance", href: "#" },
    ],
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-4 md:py-6 pl-6 md:pl-8">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
          {/* Brand column */}
          <div className="w-full md:w-1/3">
            <Link to="/" className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-linear-to-r from-teal-500 to-green-500 flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-base text-gray-900">
                StudyBuddy<span className="text-teal-600">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 mb-1.5 leading-tight">
              Your AI-powered companion for academic success, career growth, and mental wellness.
            </p>
            <div className="flex gap-1">
              <a href="#" className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors">
                <Twitter className="w-3 h-3" />
              </a>
              <a href="#" className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors">
                <Linkedin className="w-3 h-3" />
              </a>
              <a href="#" className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors">
                <Github className="w-3 h-3" />
              </a>
              <a href="#" className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors">
                <Mail className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Product</h4>
              <ul className="space-y-0.5">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Company</h4>
              <ul className="space-y-0.5">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Resources</h4>
              <ul className="space-y-0.5">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Legal</h4>
              <ul className="space-y-0.5">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} StudyBuddy AI. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 ml-auto mr-8 md:mr-12">
            Made with care for students everywhere.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
