import React, { useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface EditorialWordRevealProps {
  text: string
  className?: string
}

export const EditorialWordReveal: React.FC<EditorialWordRevealProps> = ({ text, className }) => {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])

  const words = useMemo(() => text.split(' '), [text])

  // Pre-calculate target colors (pure white vs dark red #990000) for random word highlights
  const wordTargets = useMemo(() => {
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()
      const isKeyHighlight = [
        'premium',
        'cinematic',
        'intelligent',
        'scalable',
        'ai-powered',
        'elegant',
        'future',
      ].includes(cleanWord)

      // Random dark red highlight seed (~15% of words)
      const isRed = isKeyHighlight || idx % 7 === 2 || idx % 11 === 4
      return isRed ? '#990000' : '#FFFFFF'
    })
  }, [words])

  useEffect(() => {
    const container = containerRef.current
    const wordSpans = wordsRef.current.filter(Boolean) as HTMLSpanElement[]

    if (!container || wordSpans.length === 0) return

    // Initialize all words with subdued light gray color (#7A7A7A)
    gsap.set(wordSpans, { color: '#7A7A7A' })

    // Create GSAP ScrollTrigger word-by-word color reveal timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'bottom 35%',
        scrub: 0.8, // Smooth physical scroll mapping matching Lenis inertia
      },
    })

    wordSpans.forEach((span, idx) => {
      const targetColor = wordTargets[idx] || '#FFFFFF'
      tl.to(
        span,
        {
          color: targetColor,
          duration: 0.4,
          ease: 'power2.out',
        },
        idx * 0.05
      )
    })

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [wordTargets])

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, idx) => (
        <span
          key={idx}
          ref={(el) => {
            wordsRef.current[idx] = el
          }}
          className="inline-block transition-colors duration-500 ease-out"
          style={{ color: '#7A7A7A', marginRight: '0.25em' }}
        >
          {word}
        </span>
      ))}
    </p>
  )
}
