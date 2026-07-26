import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ProjectItem {
  id: string
  title: string
  category: string
  year: string
  desc: string
  image: string
  link: string
  accent: string
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'draco-watch',
    title: 'DRACO LUX // 3D WATCH SHOWCASE',
    category: '3D Sequence / Product Reveal',
    year: '2026',
    desc: 'Full viewport 3D canvas animation with real-time shader feedback, physics choreography, and interactive sequence scrubbing.',
    image: '/sequences/Projects Pics/Dracu-watch.PNG',
    link: 'https://draco-lux-watch.vercel.app/',
    accent: 'from-neutral-950 via-neutral-900 to-black',
  },
  {
    id: 'travel-agency',
    title: 'SPECTRA // CINEMATIC TRAVEL EXPERIENCE',
    category: 'Interactive WebGL Experience',
    year: '2025',
    desc: 'Immersive travel agency interface featuring dynamic hero motion, micro-interactions, and hardware-accelerated rendering.',
    image: '/sequences/Projects Pics/Travel.PNG',
    link: 'https://travel-agency-snowy-eight.vercel.app/',
    accent: 'from-[#080808] via-zinc-950 to-[#030303]',
  },
]

export const StackedProjectsShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]

    if (!container || cards.length < 2) return

    // Position cards: card 0 is fixed at top, cards 1+ start at translateY(100%)
    cards.forEach((card, idx) => {
      if (idx > 0) {
        gsap.set(card, { yPercent: 100 })
      }
    })

    // GSAP ScrollTrigger timeline pinned for stacked viewport slides
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${cards.length * 100}%`,
        pin: true,
        scrub: 0.5, // Smooth physical scrub tied directly to scroll
        anticipatePin: 1,
      },
    })

    // Animate each incoming card sliding up over the previous pinned card
    for (let i = 1; i < cards.length; i++) {
      tl.to(cards[i], {
        yPercent: 0,
        duration: 1,
        ease: 'none',
      })
    }

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [])

  return (
    <div id="works-section" ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#030303] z-30">
      {/* Section Header Fixed at Top of Pin Container */}
      <div className="absolute top-8 inset-x-0 z-50 text-center space-y-2 pointer-events-none px-6">
        <span className="text-[11px] font-technical tracking-[0.35em] uppercase text-neutral-400 block mx-auto">
          05 // SELECTED SHOWCASE
        </span>
        <h3 className="font-thunder text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tighter font-normal">
          CRAFTED <span className="text-[#990000]">EXPERIENCES</span>
        </h3>
      </div>

      {/* Stacked Viewport Cards (100vh each, overlapping z-index) */}
      {PROJECTS.map((project, idx) => (
        <div
          key={project.id}
          ref={(el) => {
            cardsRef.current[idx] = el
          }}
          className="absolute inset-0 w-full h-full pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-12 md:px-20 flex items-center justify-center"
          style={{ zIndex: 10 + idx }}
        >
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative w-full max-w-6xl h-full max-h-[82vh] rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br ${project.accent} border border-neutral-800/80 p-6 sm:p-10 md:p-12 flex flex-col justify-between shadow-[0_-20px_60px_rgba(0,0,0,0.9)] cursor-pointer hover:border-neutral-600 transition-colors duration-500 overflow-hidden`}
          >
            {/* Ambient Background Gradient Accent */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#990000]/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Metadata */}
            <div className="flex justify-between items-center text-xs font-technical text-neutral-400 z-10 border-b border-neutral-800/80 pb-4">
              <span className="uppercase tracking-widest">{project.category}</span>
              <span className="font-semibold text-white">{project.year}</span>
            </div>

            {/* Main Showcase Grid (Image + Description) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center z-10 my-auto">
              {/* Image Preview Banner */}
              <div className="lg:col-span-7 relative w-full h-48 sm:h-64 lg:h-80 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>

              {/* Text Info */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <h4 className="font-thunder text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tighter font-normal leading-[0.9] group-hover:text-neutral-200 transition-colors">
                  {project.title}
                </h4>
                <p className="font-technical text-xs sm:text-sm text-neutral-400 leading-relaxed tracking-wide font-normal">
                  {project.desc}
                </p>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between text-xs font-technical uppercase tracking-widest text-white pt-4 border-t border-neutral-800/80 z-10">
              <span className="text-neutral-400">0{idx + 1} // 0{PROJECTS.length}</span>
              <div className="flex items-center space-x-2 group-hover:text-neutral-300">
                <span>Explore Live Case Study</span>
                <span className="inline-block transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-300">
                  ↗
                </span>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  )
}
