import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let globalLenisInstance: Lenis | null = null

export function getLenisInstance(): Lenis | null {
  return globalLenisInstance
}

export function useLenisScroll(enabled: boolean = true) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Instantiate Lenis with custom Apple-like physical scroll inertia
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // Smooth exponential decay curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis
    globalLenisInstance = lenis

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Bind GSAP ticker to Lenis RAF
    const updateGsapTicker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateGsapTicker)
    gsap.ticker.lagSmoothing(0)

    // Refresh GSAP ScrollTrigger once Lenis initializes after loading completes
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      gsap.ticker.remove(updateGsapTicker)
      lenis.destroy()
      lenisRef.current = null
      globalLenisInstance = null
    }
  }, [enabled])

  return lenisRef
}
