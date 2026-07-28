import React, { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFrameSequenceLoader } from '../hooks/useFrameSequenceLoader'
import { useCanvasRenderer } from '../hooks/useCanvasRenderer'
import { HeroTypography } from './HeroTypography'
import { DevTelemetry } from './DevTelemetry'
import { SEQUENCE_CONFIG } from '../types/sequence'

gsap.registerPlugin(ScrollTrigger)

interface HeroCanvasProps {
  onScrollProgressChange?: (progress: number) => void
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ onScrollProgressChange }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false)

  // Custom frame sequence preloader hook
  const { state: loaderState, getFrameImage } = useFrameSequenceLoader()

  // Custom Retina-aware canvas renderer hook
  const { renderFrame } = useCanvasRenderer(canvasRef, getFrameImage)

  // Check prefers-reduced-motion setting
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  /**
   * GSAP ScrollTrigger Scrubbing Setup
   */
  const initScrollTrigger = useCallback(() => {
    const container = containerRef.current
    if (!container || prefersReducedMotion) return

    // Proxy object for GSAP frame interpolation
    const frameObj = { frame: 1 }

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8, // 0.8s physical dampening for ultra-smooth frame sequence scrubbing
      onUpdate: (self) => {
        const progress = self.progress
        setScrollProgress(progress)
        if (onScrollProgressChange) {
          onScrollProgressChange(progress)
        }

        // Interpolate target frame between 1 and 240
        const targetFrame = 1 + progress * (SEQUENCE_CONFIG.totalFrames - 1)
        frameObj.frame = targetFrame
        renderFrame(targetFrame)
      },
    })

    return () => {
      trigger.kill()
    }
  }, [prefersReducedMotion, renderFrame, onScrollProgressChange])

  // Bind ScrollTrigger once first frame is ready
  useEffect(() => {
    if (!loaderState.isFirstFrameReady) return

    // Immediately render frame 1 on canvas
    renderFrame(1, true)

    const cleanup = initScrollTrigger()
    return () => {
      if (cleanup) cleanup()
    }
  }, [loaderState.isFirstFrameReady, initScrollTrigger, renderFrame])

  return (
    <div
      id="hero-pinned"
      ref={containerRef}
      className="relative w-full bg-[#E0E3E0]"
      style={{ height: prefersReducedMotion ? '100vh' : `${SEQUENCE_CONFIG.pinnedScrollHeightVh}vh` }}
    >
      {/* Sticky 100vh Canvas Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#E0E3E0]">
        {/* HTML5 Canvas Element */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-center pointer-events-none"
        />

        {/* Editorial Typography Overlays */}
        <HeroTypography
          scrollProgress={scrollProgress}
          isFirstFrameReady={loaderState.isFirstFrameReady}
        />
      </div>

      {/* Dev Telemetry Stats completely removed */}
      <DevTelemetry />
    </div>
  )
}
