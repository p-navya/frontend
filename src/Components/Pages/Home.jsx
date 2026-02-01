import React from 'react'
import Navbar from '../Home/Navbar'
import Hero from '../Home/Hero'
import ModulesSection from '../Home/ModulesSection'
import FeaturesSection from '../Home/FeaturesSection'
import HowItWorksSection from '../Home/HowItWorksSection'
import CTASection from '../Home/CTASection'
import Footer from '../Footer/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <section id="modules">
          <ModulesSection />
        </section>
        <FeaturesSection />
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default Home
