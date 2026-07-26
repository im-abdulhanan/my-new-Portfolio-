import React, { useRef, useState } from 'react'

interface CapabilityCard {
  num: string
  title: string
  desc: string
}

const CAPABILITIES: CapabilityCard[] = [
  {
    num: '01',
    title: 'INTERACTIVE EXPERIENCES',
    desc: 'Frame-by-frame canvas sequences, scroll-driven storytelling, and immersive motion systems engineered for fluid, cinematic interactions.',
  },
  {
    num: '02',
    title: 'CREATIVE ENGINEERING',
    desc: 'Modern web applications built with scalable architecture, clean TypeScript, and performance-first development practices.',
  },
  {
    num: '03',
    title: 'PREMIUM DIGITAL DESIGN',
    desc: 'Minimal interfaces inspired by editorial design, crafted with attention to typography, composition, and user experience.',
  },
  {
    num: '04',
    title: 'PERFORMANCE & MOTION',
    desc: 'Smooth scrolling, GPU-accelerated animations, and optimized rendering designed to maintain a responsive, high-quality experience.',
  },
]

export const CapabilitiesMarquee: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Triplicate cards for seamless 100% infinite marquee loop
  const marqueeItems = [...CAPABILITIES, ...CAPABILITIES, ...CAPABILITIES]

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setIsPaused(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsPaused(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsPaused(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <div id="skills-section" className="space-y-8 scroll-mt-24 w-full overflow-hidden py-4">
      {/* Centered Section Header */}
      <span className="text-[11px] font-technical tracking-[0.35em] uppercase text-neutral-400 block text-center mx-auto">
        03 // CAPABILITIES
      </span>

      {/* Interactive Marquee Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPaused(true)}
        className="relative w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none py-2"
      >
        {/* Infinite GPU-Accelerated Marquee Track */}
        <div
          className="flex space-x-6 w-max py-4 animate-marquee"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {marqueeItems.map((card, idx) => (
            <div
              key={idx}
              className="group relative w-[300px] sm:w-[380px] flex-shrink-0 p-8 sm:p-10 rounded-3xl bg-neutral-950/75 border border-neutral-800/80 backdrop-blur-xl shadow-xl hover:border-neutral-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col justify-between space-y-8"
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-technical tracking-[0.3em] uppercase text-[#990000] font-semibold block">
                  {card.num}
                </span>
                <span className="w-2 h-2 rounded-full bg-neutral-700 group-hover:bg-[#990000] transition-colors duration-300"></span>
              </div>

              <div className="space-y-3 text-left">
                <h3 className="font-thunder text-2xl sm:text-3xl text-white tracking-tighter uppercase font-normal leading-tight group-hover:text-neutral-200 transition-colors">
                  {card.title}
                </h3>
                <p className="font-technical text-xs sm:text-sm text-neutral-400 leading-relaxed tracking-wide font-normal">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[10px] font-technical uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300 transition-colors">
                <span>CORE CAPABILITY</span>
                <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                  ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
