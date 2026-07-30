import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { startMasterAssetLoader } from '../utils/assetLoader'

interface CinematicPreloaderProps {
  onComplete: () => void
}

export const CinematicPreloader: React.FC<CinematicPreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayPercent, setDisplayPercent] = useState<number>(0)
  const realProgressRef = useRef<number>(0)
  const isFinishedRef = useRef<boolean>(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const startTime = Date.now()
    const TARGET_DURATION_MS = 7500 // 7.5s cinematic rendering duration (6-10s window)

    // 1. Initialize Master Asset Loader for all 240 frames
    startMasterAssetLoader({
      onProgress: (progress) => {
        realProgressRef.current = progress
      },
      onComplete: () => {
        realProgressRef.current = 100
      },
    })

    // 2. Smooth 60 FPS animation loop that ticks numbers 0% -> 100% across ~7.5 seconds
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const timePercent = Math.min(100, Math.floor((elapsed / TARGET_DURATION_MS) * 100))

      // Display percentage is balanced between time progress and actual frame progress
      const targetVal = Math.min(100, Math.max(timePercent, realProgressRef.current))

      setDisplayPercent((prev) => {
        if (prev >= 100) return 100
        const next = Math.min(100, prev + 1)
        return next > targetVal ? prev : next
      })

      // When 100% is reached and time target elapsed
      if (elapsed >= TARGET_DURATION_MS && realProgressRef.current >= 95 && !isFinishedRef.current) {
        isFinishedRef.current = true
        clearInterval(interval)
        setDisplayPercent(100)

        // Wait 300ms, then run GSAP Outro (opacity: 0, blur: 20px, scale: 1.03)
        setTimeout(() => {
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              opacity: 0,
              filter: 'blur(20px)',
              scale: 1.03,
              duration: 0.8,
              ease: 'power4.inOut',
              onComplete: () => {
                document.body.style.overflow = ''
                onComplete()
              },
            })
          } else {
            document.body.style.overflow = ''
            onComplete()
          }
        }, 300)
      }
    }, 45) // ~22 updates per second for smooth number ticking (42% -> 43% -> 44%)

    return () => {
      clearInterval(interval)
      document.body.style.overflow = ''
    }
  }, [onComplete])

  const formattedPercent = String(displayPercent).padStart(3, '0')

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000000] text-white select-none overflow-hidden"
      style={{ willChange: 'opacity, filter, transform' }}
    >
      {/* Subtle Animated Ambient Film Grain */}
      <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none"></div>

      {/* Soft Vignette Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none"></div>

      {/* Center Cinematic Preloader Display */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 px-6 text-center">
        {/* Label */}
        <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-technical uppercase tracking-[0.4em] text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#990000] animate-pulse"></span>
          <span>SYSTEM INITIALIZING</span>
        </div>

        {/* 000% - 100% Thunder Font Display */}
        <div className="font-thunder text-7xl sm:text-9xl md:text-[11rem] text-white tracking-tighter uppercase font-normal leading-none drop-shadow-2xl">
          {formattedPercent}%
        </div>

        {/* Sleek Progress Bar */}
        <div className="w-40 sm:w-64 h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/50">
          <div
            className="h-full bg-gradient-to-r from-[#800000] to-[#990000] transition-all duration-200 ease-out"
            style={{ width: `${displayPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Bottom Minimal Subtitle */}
      <div className="absolute bottom-10 inset-x-0 text-center z-10 text-[10px] font-technical uppercase tracking-[0.3em] text-neutral-400">
        ABDUL HANAN // CREATIVE ENGINEERING
      </div>
    </div>
  )
}
