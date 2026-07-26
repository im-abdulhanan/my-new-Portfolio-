import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { getLenisInstance } from '../hooks/useLenisScroll'

const TARGET_TEXT = 'GET IN TOUCH'
const GLYPHS = '#%$@&*!?/\\X01'

export const FloatingTouchButton: React.FC = () => {
  const [displayText, setDisplayText] = useState(TARGET_TEXT)
  const [isHidden, setIsHidden] = useState(false)
  const intervalRef = useRef<number | null>(null)

  // Cybernetic Hash-to-Text Scramble Effect on Hover
  const handleMouseEnter = useCallback(() => {
    let iteration = 0
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = window.setInterval(() => {
      setDisplayText((_) =>
        TARGET_TEXT.split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iteration) {
              return TARGET_TEXT[index]
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join('')
      )

      if (iteration >= TARGET_TEXT.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }

      iteration += 1 / 2
    }, 30)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setDisplayText(TARGET_TEXT)
  }, [])

  // Auto-hide when contact section / footer is reached
  useEffect(() => {
    const handleScroll = () => {
      const contactEl = document.getElementById('contact-section')
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect()
        // Hide button when user reaches the contact section in viewport
        if (rect.top <= window.innerHeight * 0.75) {
          setIsHidden(true)
        } else {
          setIsHidden(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    const lenis = getLenisInstance()
    const target = document.getElementById('contact-section')
    if (lenis && target) {
      lenis.scrollTo(target, { duration: 1.5, offset: -20 })
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out pointer-events-auto ${
        isHidden
          ? 'opacity-0 translate-y-10 pointer-events-none scale-95'
          : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative flex items-center space-x-3 px-6 py-3 rounded-full bg-neutral-950/90 text-white border border-white/20 backdrop-blur-xl shadow-2xl hover:border-white/50 hover:bg-black transition-all duration-300 transform hover:scale-105 active:scale-95 font-technical text-xs tracking-[0.25em] uppercase font-semibold cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
        <span className="font-mono min-w-[120px] text-center tracking-widest">{displayText}</span>
        <FaTelegramPlane className="w-3.5 h-3.5 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform text-neutral-400 group-hover:text-white" />
      </button>
    </div>
  )
}
