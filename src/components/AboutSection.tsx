import React from 'react'
import { EditorialWordReveal } from './EditorialWordReveal'
import { TechPhysicsPlayground } from './TechPhysicsPlayground'

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

        {/* Feature Grid / Key Capabilities */}
        <div id="skills-section" className="space-y-8 scroll-mt-24">
          <span className="text-[11px] font-technical tracking-[0.35em] uppercase text-neutral-400 block text-center mx-auto">
            03 // CAPABILITIES
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Interactive Experiences',
                desc: 'Frame-by-frame canvas sequences, scroll-driven storytelling, and immersive motion systems engineered for fluid, cinematic interactions.',
              },
              {
                num: '02',
                title: 'Creative Engineering',
                desc: 'Modern web applications built with scalable architecture, clean TypeScript, and performance-first development practices.',
              },
              {
                num: '03',
                title: 'Premium Digital Design',
                desc: 'Minimal interfaces inspired by editorial design, crafted with attention to typography, composition, and user experience.',
              },
              {
                num: '04',
                title: 'Performance & Motion',
                desc: 'Smooth scrolling, GPU-accelerated animations, and optimized rendering designed to maintain a responsive, high-quality experience.',
              },
            ].map((card) => (
              <div
                key={card.num}
                className="group p-8 rounded-2xl bg-neutral-950/60 border border-neutral-800/60 hover:border-neutral-700 transition-all duration-500 hover:-translate-y-1 shadow-lg"
              >
                <span className="text-[11px] font-technical tracking-[0.3em] uppercase text-neutral-500 block mb-8">
                  {card.num}
                </span>
                <h3 className="font-thunder text-2xl sm:text-3xl text-white mb-3 tracking-tighter uppercase font-normal group-hover:text-neutral-200 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs font-technical text-neutral-400 leading-relaxed tracking-wider">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

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

        {/* Selected Works Preview Section */}
        <div id="works-section" className="space-y-12">
          <div className="text-center space-y-3 max-w-4xl mx-auto border-b border-neutral-900 pb-8">
            <span className="text-[11px] font-technical tracking-[0.35em] uppercase text-neutral-400 block text-center mx-auto">
              05 // SELECTED SHOWCASE
            </span>
            <h3 className="font-thunder text-4xl sm:text-6xl md:text-7xl text-white uppercase tracking-tighter font-normal">
              CRAFTED <span className="text-[#990000]">EXPERIENCES</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'NEXUS CYBERNETICS // DRACO WATCH',
                category: '3D Sequence / Product Reveal',
                year: '2026',
                desc: 'Full viewport canvas animation with real-time shader feedback.',
                image: '/sequences/Projects Pics/Dracu-watch.PNG',
                link: 'https://draco-lux-watch.vercel.app/',
              },
              {
                title: 'SPECTRA TRAVEL EXPERIENCE',
                category: 'Interactive WebGL Experience',
                year: '2025',
                desc: 'Cinematic travel interface with dynamic physics choreography.',
                image: '/sequences/Projects Pics/Travel.PNG',
                link: 'https://travel-agency-snowy-eight.vercel.app/',
              },
            ].map((project, idx) => (
              <a
                key={idx}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-neutral-600 transition-all duration-700 shadow-xl cursor-pointer"
              >
                {/* Project Screenshot Banner */}
                <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/60">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent"></div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-technical text-neutral-400">
                    <span className="uppercase tracking-widest">{project.category}</span>
                    <span>{project.year}</span>
                  </div>

                  <h4 className="font-thunder text-2xl sm:text-3xl text-white uppercase tracking-wider font-normal group-hover:text-neutral-200 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-xs font-technical text-neutral-400 leading-relaxed tracking-wide">
                    {project.desc}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs font-technical uppercase tracking-widest text-white group-hover:text-neutral-300 pt-2 border-t border-neutral-900">
                  <span>Explore Case Study</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Call to Action */}
        <div id="contact-section" className="text-center py-20 border-t border-neutral-900 space-y-8">
          <span className="text-[11px] font-technical tracking-[0.4em] uppercase text-neutral-500 block">
            INITIATE COLLABORATION
          </span>
          <h2 className="font-thunder text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tighter font-normal text-white drop-shadow-sm">
            LET’S BUILD SOMETHING <br />
            <span className="text-[#990000]">UNFORGETTABLE.</span>
          </h2>
          <div className="pt-4">
            <button
              onClick={() => onOpenContactModal ? onOpenContactModal() : (window.location.href = 'mailto:contact@antigravity.dev')}
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-white text-black font-thunder uppercase text-xl sm:text-2xl tracking-wider font-normal hover:bg-neutral-200 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
            >
              <span>Get in Touch</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
