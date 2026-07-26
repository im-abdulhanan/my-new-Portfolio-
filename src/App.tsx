import { useState } from 'react'
import { useLenisScroll } from './hooks/useLenisScroll'
import { Navbar } from './components/Navbar'
import { HeroCanvas } from './components/HeroCanvas'
import { AboutSection } from './components/AboutSection'
import { FloatingTouchButton } from './components/FloatingTouchButton'
import { ContactModal } from './components/ContactModal'

export function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Initialize Lenis smooth scroll + GSAP ScrollTrigger ticker integration
  useLenisScroll()

  const openContactModal = () => setIsContactModalOpen(true)
  const closeContactModal = () => setIsContactModalOpen(false)

  return (
    <div className="relative min-h-screen bg-[#030303] text-white selection:bg-white selection:text-black">
      {/* Floating Glassmorphism Navigation */}
      <Navbar scrollProgress={scrollProgress} onOpenContactModal={openContactModal} />

      {/* Main Pinned Cinematic Hero Section (600vh scroll height) */}
      <main>
        <HeroCanvas onScrollProgressChange={setScrollProgress} />
        
        {/* Seamless Transition Target: Philosophy & Capabilities Section */}
        <AboutSection onOpenContactModal={openContactModal} />
      </main>

      {/* Floating Bottom Center Scramble CTA Button */}
      <FloatingTouchButton onOpenContactModal={openContactModal} />

      {/* Initiate Collaboration Modal Dialog */}
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />

      {/* Minimal Footer */}
      <footer className="w-full bg-[#030303] border-t border-neutral-900 py-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-[11px] font-technical uppercase tracking-widest text-neutral-500 gap-4">
        <div>© 2026 ABDUL HANAN. ALL RIGHTS RESERVED.</div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="https://x.com/abhanan_dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TWITTER / X</a>
          <a href="https://github.com/im-abdulhanan" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GITHUB</a>
          <a href="https://www.linkedin.com/in/ihanan" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LINKEDIN</a>
          <a href="mailto:imhanan.mail@gmail.com" className="hover:text-white transition-colors">imhanan.mail@gmail.com</a>
          <a href="tel:+923180522085" className="hover:text-white transition-colors">+92 318 0522085</a>
        </div>
      </footer>
    </div>
  )
}

export default App
