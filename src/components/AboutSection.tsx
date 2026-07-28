import React from 'react'
import { EditorialWordReveal } from './EditorialWordReveal'
import { CapabilitiesMarquee } from './CapabilitiesMarquee'
import { TechPhysicsPlayground } from './TechPhysicsPlayground'
import { StackedProjectsShowcase } from './StackedProjectsShowcase'

interface AboutSectionProps {
  onOpenContactModal?: () => void
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenContactModal }) => {
  const bioText =
    '“I design and engineer premium digital experiences that combine cinematic motion, modern web technologies, and intelligent systems. My work focuses on building fast, scalable, and immersive products where every interaction feels intentional and every detail serves a purpose. From Full Stack development to AI-powered applications and secure digital solutions, I strive to create experiences that are elegant, performant, and built for the future.”'

  return (
    <section
      id="about-section"
      className="relative w-full bg-[#030303] text-white pt-16 pb-20 px-6 sm:px-12 md:px-20 z-30 border-t border-neutral-900"
    >
      {/* Dark transition gradient sliding smoothly over hero final frame */}
      <div className="absolute -top-32 inset-x-0 h-32 bg-gradient-to-b from-transparent via-[#030303]/80 to-[#030303] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8">
          <span className="text-[11px] font-technical tracking-[0.35em] uppercase text-neutral-400 block">
            02 // PHILOSOPHY
          </span>
          <h2 className="font-thunder text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tighter uppercase leading-[0.88] drop-shadow-sm">
            Designing at the intersection of <br />
            <span className="text-neutral-300">human creativity, </span>
            <span className="text-[#990000]">AI</span>
            <span className="text-neutral-300"> & engineering.</span>
          </h2>

          {/* GSAP ScrollTrigger Editorial Word-by-Word Color Reveal */}
          <EditorialWordReveal
            text={bioText}
            className="font-thunder text-lg sm:text-2xl md:text-3xl font-normal leading-snug tracking-wider uppercase max-w-4xl mx-auto"
          />
        </div>

        {/* Premium Infinite Horizontal Marquee Capabilities Section */}
        <CapabilitiesMarquee />

        {/* Technologies Section */}
        <div id="tech-section" className="space-y-12 scroll-mt-24">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-technical tracking-[0.35em] uppercase text-neutral-400 block text-center mx-auto">
              04 // TECHNOLOGIES
            </span>
            <h3 className="font-thunder text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tighter font-normal">
              ENGINEERING <span className="text-[#990000]">TECH</span> STACK
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: 'CORE ENGINE', tech: 'React Ecosystem' },
              { category: 'FRONTEND', tech: 'React.js • Next.js • Vite' },
              { category: 'BACKEND', tech: 'Node.js • Express.js • Nest.js' },
              { category: 'DATABASE', tech: 'MongoDB • PostgreSQL • Firebase • Supabase' },
              { category: 'ANIMATION', tech: 'GSAP • ScrollTrigger' },
              { category: 'GRAPHICS', tech: 'HTML5 Canvas • WebGL' },
              { category: 'STYLING', tech: 'Tailwind CSS • Figma' },
              { category: 'SCROLL', tech: 'Lenis' },
              { category: 'AI', tech: 'Python • AI Integration' },
              { category: 'VERSION CONTROL', tech: 'Git • GitHub' },
              { category: 'DEPLOYMENT', tech: 'Vercel • Docker' },
              { category: 'PLATFORM', tech: 'Linux' },
            ].map((tech, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-neutral-950/60 border border-neutral-800/60 hover:border-neutral-700 transition-all duration-500 hover:-translate-y-1 shadow-lg space-y-3"
              >
                <span className="text-[10px] font-technical tracking-[0.3em] text-[#990000] uppercase font-semibold block">
                  {tech.category}
                </span>
                <p className="font-technical text-xs sm:text-sm text-neutral-300 group-hover:text-white leading-relaxed tracking-wide font-normal">
                  {tech.tech}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Matter.js PNG logos physics extension */}
          <TechPhysicsPlayground />
        </div>

        {/* Stacked Viewport Projects Showcase (Awwwards 100vh overlapping card stack) */}
        <StackedProjectsShowcase />

        {/* Contact Call to Action */}
        <div id="contact-section" className="text-center py-20 border-t border-neutral-900 space-y-8">
          <span className="text-[11px] font-technical tracking-[0.4em] uppercase text-neutral-500 block">
            INITIATE COLLABORATION
          </span>
          <h2 className="font-thunder text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tighter font-normal text-white drop-shadow-sm">
            LET’S BUILD SOMETHING <br />
            <span className="text-[#990000]">UNFORGETTABLE.</span>
          </h2>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenContactModal ? onOpenContactModal() : (window.location.href = 'mailto:imhanan.mail@gmail.com')}
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-white text-black font-technical uppercase text-xs sm:text-sm tracking-widest font-semibold hover:bg-neutral-200 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
            >
              <span>Get in Touch</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-xs font-technical uppercase tracking-widest text-neutral-400">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=imhanan.mail@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              imhanan.mail@gmail.com
            </a>
            <span className="text-neutral-700 hidden sm:inline">•</span>
            <a href="tel:+923180522085" className="hover:text-white transition-colors">
              +92 318 0522085
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
