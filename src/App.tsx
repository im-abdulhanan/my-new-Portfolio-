import { useState } from 'react'
import { useLenisScroll } from './hooks/useLenisScroll'
import { Navbar } from './components/Navbar'
import { HeroCanvas } from './components/HeroCanvas'
import { AboutSection } from './components/AboutSection'
import { FloatingTouchButton } from './components/FloatingTouchButton'

export function App() {
  const [scrollProgress, setScrollProgress] = useState(0)

  // Initialize Lenis smooth scroll + GSAP ScrollTrigger ticker integration
  useLenisScroll()

  return (
    <div className="relative min-h-screen bg-[#030303] text-white selection:bg-white selection:text-black">
      {/* Floating Glassmorphism Navigation */}
      <Navbar scrollProgress={scrollProgress} />

      {/* Main Pinned Cinematic Hero Section (600vh scroll height) */}
      <main>
        <HeroCanvas onScrollProgressChange={setScrollProgress} />
        
        {/* Seamless Transition Target: Philosophy & Capabilities Section */}
        <AboutSection />
      </main>

      {/* Floating Bottom Center Scramble CTA Button */}
      <FloatingTouchButton />

      {/* Minimal Footer */}
      <footer className="w-full bg-[#030303] border-t border-neutral-900 py-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-[11px] font-technical uppercase tracking-widest text-neutral-500 gap-4">
        <div>© 2026 ANTIGRAVITY. ALL RIGHTS RESERVED.</div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">TWITTER / X</a>
          <a href="#" className="hover:text-white transition-colors">GITHUB</a>
          <a href="#" className="hover:text-white transition-colors">LINKEDIN</a>
          <a href="#" className="hover:text-white transition-colors">AWWWARDS</a>
        </div>
      </footer>
    </div>
  )
}

export default App
