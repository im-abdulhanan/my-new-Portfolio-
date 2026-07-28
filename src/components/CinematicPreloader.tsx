import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { startMasterAssetLoader } from '../utils/assetLoader'

interface CinematicPreloaderProps {
  onComplete: () => void
}

export const CinematicPreloader: React.FC<CinematicPreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayPercent, setDisplayPercent] = useState<number>(0)
  const targetPercentRef = useRef<number>(0)
  const currentValRef = useRef<{ value: number }>({ value: 0 })
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const isFinishedRef = useRef<boolean>(false)

  useEffect(() => {
    // Lock scroll during preloading
    document.body.style.overflow = 'hidden'

    // 1. Initialize Master Asset Loader
    startMasterAssetLoader({
      onProgress: (progress) => {
        targetPercentRef.current = progress

        // Smoothly animate display percentage count toward real progress using GSAP tweening
        if (tweenRef.current) tweenRef.current.kill()

        tweenRef.current = gsap.to(currentValRef.current, {
          value: progress,
          duration: 0.35,
          ease: 'power1.out',
          onUpdate: () => {
            setDisplayPercent(Math.floor(currentValRef.current.value))
          },
        })
      },
      onComplete: () => {
        // Guarantee 100% progress animation completes smoothly
        if (isFinishedRef.current) return
        isFinishedRef.current = true

        gsap.to(currentValRef.current, {
          value: 100,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate: () => {
            setDisplayPercent(Math.floor(currentValRef.current.value))
          },
          onComplete: () => {
            // 2. Wait 300ms when 100% is reached
            setTimeout(() => {
              // 3. Cinematic Outro Animation (Opacity 1->0, Blur 0->20px, Scale 1->1.03)
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
          },
        })
      },
    })

    return () => {
      document.body.style.overflow = ''
      if (tweenRef.current) tweenRef.current.kill()
    }
  }, [onComplete])

  // Format number as 3-digit string (e.g. 004%, 042%, 100%)
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
