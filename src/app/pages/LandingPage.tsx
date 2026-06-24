import Navbar from '../components/sections/Navbar'
import HeroSection from '../components/sections/HeroSection'
import ValuePropSection from '../components/sections/ValuePropSection'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import StatsSection from '../components/sections/StatsSection'
import CTASection from '../components/sections/CTASection'
import Footer from '../components/sections/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ValuePropSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </main>
  )
}