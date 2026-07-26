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
          {[
            { label: 'TWITTER / X', href: 'https://x.com/abhanan_dev' },
            { label: 'GITHUB', href: 'https://github.com/im-abdulhanan' },
            { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/ihanan' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center space-x-1.5 hover:text-white transition-colors duration-300"
            >
              <span>{item.label}</span>
              <span className="inline-block transform transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 text-neutral-400 group-hover:text-white">
                ↗
              </span>
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default App
