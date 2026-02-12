import React from 'react'
import Navbar from '../Home/Navbar'
import Hero from '../Home/Hero'
import ModulesSection from '../Home/ModulesSection'
import FeaturesSection from '../Home/FeaturesSection'
import HowItWorksSection from '../Home/HowItWorksSection'
import CTASection from '../Home/CTASection'
import Footer from '../Footer/Footer'
import ResourcesSection from '../Home/ResourcesSection'
import PricingSection from '../Home/PricingSection'

const Home = () => {
  return (
    <div id="home" className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <section id="modules">
          <ModulesSection />
        </section>
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
        <section id="resources">
          <ResourcesSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default Home
