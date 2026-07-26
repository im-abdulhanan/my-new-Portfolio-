import React, { useState, useEffect, useRef } from 'react'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { getLenisInstance } from '../hooks/useLenisScroll'

interface NavbarProps {
  scrollProgress: number
}

const NAV_ITEMS = [
  { label: 'Overview', id: 'hero-pinned' },
  { label: 'Philosophy', id: 'about-section' },
  { label: 'Capabilities', id: 'skills-section' },
  { label: 'Technologies', id: 'tech-section' },
  { label: 'Works', id: 'works-section' },
]

export const Navbar: React.FC<NavbarProps> = ({ scrollProgress }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScrollUpdate = () => {
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current

      setIsScrolled(currentScrollY > 50 || scrollProgress > 0.05)

      // Hide navbar when scrolling down past 80px, reveal when scrolling up or at top
      if (currentScrollY > 80 && currentScrollY > lastScrollY + 5) {
        if (!isMobileMenuOpen) {
          setIsVisible(false) // Scroll down -> hide navbar (unless mobile menu is open)
        }
      } else if (currentScrollY < lastScrollY - 5 || currentScrollY <= 80) {
        setIsVisible(true) // Scroll up or at top -> show navbar
      }

      lastScrollYRef.current = currentScrollY

      // Section position detection for active tab highlight
      const aboutEl = document.getElementById('about-section')
      const skillsEl = document.getElementById('skills-section')
      const techEl = document.getElementById('tech-section')
      const worksEl = document.getElementById('works-section')

      if (worksEl && worksEl.getBoundingClientRect().top <= window.innerHeight * 0.5) {
        setActiveTab('Works')
      } else if (techEl && techEl.getBoundingClientRect().top <= window.innerHeight * 0.5) {
        setActiveTab('Technologies')
      } else if (skillsEl && skillsEl.getBoundingClientRect().top <= window.innerHeight * 0.5) {
        setActiveTab('Capabilities')
      } else if (aboutEl && aboutEl.getBoundingClientRect().top <= window.innerHeight * 0.5) {
        setActiveTab('Philosophy')
      } else {
        setActiveTab('Overview')
      }
    }

    window.addEventListener('scroll', handleScrollUpdate, { passive: true })

    // Also attach to Lenis scroll event if available
    const lenis = getLenisInstance()
    if (lenis) {
      lenis.on('scroll', handleScrollUpdate)
    }

    return () => {
      window.removeEventListener('scroll', handleScrollUpdate)
      if (lenis) {
        lenis.off('scroll', handleScrollUpdate)
      }
    }
  }, [scrollProgress, isMobileMenuOpen])

  const scrollToSection = (id: string, tabName: string) => {
    setActiveTab(tabName)
    setIsVisible(true)
    setIsMobileMenuOpen(false)
    const lenis = getLenisInstance()
    const target = document.getElementById(id)

    if (lenis && target) {
      lenis.scrollTo(target, { duration: 1.5, offset: -20 })
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Floating Header & Navigation Pill */}
      <header
        className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none transition-transform duration-500 ease-out px-4"
        style={{
          transform: isVisible ? 'translateY(0%)' : 'translateY(-150%)',
        }}
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-out glass-pill rounded-full px-5 py-2.5 w-full sm:w-auto ${
            isScrolled
              ? 'bg-neutral-950/85 border-white/15 shadow-2xl shadow-black/80 backdrop-blur-xl scale-[0.98]'
              : 'bg-neutral-950/50 border-white/10 shadow-lg backdrop-blur-md'
          }`}
        >
          {/* Brand Identity */}
          <div className="flex items-center space-x-2.5 pr-2 sm:pr-4">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="font-technical text-xs uppercase tracking-widest text-white font-medium">
              <span className="text-[#990000] font-semibold">ABDUL</span> HANAN
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center space-x-1 sm:space-x-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id, item.label)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-technical tracking-wide transition-all duration-300 ${
                  activeTab === item.label
                    ? 'text-white font-medium bg-white/10 shadow-inner'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                }`}
              >
                {item.label}
                {activeTab === item.label && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-[1.5px] bg-white rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Desktop Action CTA Button */}
          <div className="hidden sm:block pl-2 sm:pl-4">
            <button
              onClick={() => scrollToSection('contact-section', 'Contact')}
              className="inline-flex items-center space-x-1.5 text-xs font-technical uppercase tracking-wider text-black bg-white hover:bg-neutral-200 px-4 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium shadow-sm"
            >
              <span>Initiate</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Icon Toggle (Visible only on small devices) */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-white hover:text-neutral-300 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <HiX className="w-5 h-5 text-white" />
              ) : (
                <HiMenuAlt3 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu (Smooth slide down from top on small devices) */}
      <div
        className={`fixed inset-x-0 top-0 z-40 bg-neutral-950/95 backdrop-blur-2xl border-b border-neutral-800 pt-24 pb-8 px-6 transition-all duration-500 ease-out pointer-events-auto sm:hidden ${
          isMobileMenuOpen
            ? 'translate-y-0 opacity-100 shadow-2xl'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-4 text-center">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.id, item.label)}
              className={`py-3 text-sm font-technical uppercase tracking-widest border-b border-neutral-900/60 transition-colors ${
                activeTab === item.label
                  ? 'text-white font-semibold text-base'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-4">
            <button
              onClick={() => scrollToSection('contact-section', 'Contact')}
              className="w-full py-3 rounded-full text-xs font-technical uppercase tracking-widest text-black bg-white hover:bg-neutral-200 transition-all font-semibold shadow-md"
            >
              Initiate Contact
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
