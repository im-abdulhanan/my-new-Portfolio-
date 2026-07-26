import React, { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'

interface LogoItem {
  id: string
  name: string
  src: string
  width: number
  height: number
}

const TECH_LOGOS: LogoItem[] = [
  { id: 'react', name: 'React', src: '/sequences/Teach Stack/react.png', width: 64, height: 64 },
  { id: 'typescript', name: 'TypeScript', src: '/sequences/Teach Stack/typescript.png', width: 60, height: 60 },
  { id: 'js', name: 'JavaScript', src: '/sequences/Teach Stack/js.png', width: 60, height: 60 },
  { id: 'nodejs', name: 'Node.js', src: '/sequences/Teach Stack/nodejs.png', width: 68, height: 68 },
  { id: 'nestjs', name: 'Nest.js', src: '/sequences/Teach Stack/nestjs.png', width: 60, height: 60 },
  { id: 'docker', name: 'Docker', src: '/sequences/Teach Stack/docker.png', width: 68, height: 68 },
  { id: 'git', name: 'Git', src: '/sequences/Teach Stack/git.png', width: 60, height: 60 },
  { id: 'github', name: 'GitHub', src: '/sequences/Teach Stack/github.png', width: 64, height: 64 },
  { id: 'copilot', name: 'Copilot', src: '/sequences/Teach Stack/copilotgithub.png', width: 60, height: 60 },
  { id: 'gemini', name: 'Gemini', src: '/sequences/Teach Stack/gemini.png', width: 64, height: 64 },
  { id: 'openai', name: 'OpenAI', src: '/sequences/Teach Stack/openai.png', width: 60, height: 60 },
  { id: 'linux', name: 'Linux', src: '/sequences/Teach Stack/linux.png', width: 64, height: 64 },
  { id: 'postman', name: 'Postman', src: '/sequences/Teach Stack/postman.png', width: 60, height: 60 },
  { id: 'vite', name: 'Vite', src: '/sequences/Teach Stack/vitejs.png', width: 64, height: 64 },
  { id: 'vscode', name: 'VS Code', src: '/sequences/Teach Stack/vscode.png', width: 60, height: 60 },
  { id: 'hyper', name: 'Hyper', src: '/sequences/Teach Stack/hyper.png', width: 60, height: 60 },
  { id: 'win', name: 'Windows', src: '/sequences/Teach Stack/win.png', width: 56, height: 56 },
  { id: 'microsoft', name: 'Microsoft', src: '/sequences/Teach Stack/microsoft.png', width: 56, height: 56 },
  { id: 'npm', name: 'npm', src: '/sequences/Teach Stack/npm.png', width: 64, height: 64 },
  { id: 'frame2', name: 'Frame 2', src: '/sequences/Teach Stack/Frame 2.png', width: 60, height: 60 },
  { id: 'frame5', name: 'Frame 5', src: '/sequences/Teach Stack/Frame 5.png', width: 60, height: 60 },
  { id: 'frame21', name: 'Frame 21', src: '/sequences/Teach Stack/Frame 21.png', width: 60, height: 60 },
  { id: 'frame24', name: 'Frame 24', src: '/sequences/Teach Stack/Frame 24.png', width: 60, height: 60 },
  { id: 'vector', name: 'Vector', src: '/sequences/Teach Stack/Vector.png', width: 60, height: 60 },
]

export const TechPhysicsPlayground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cursorStyle, setCursorStyle] = useState<'grab' | 'grabbing' | 'default'>('default')

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // Preload image assets
    const loadedImages = new Map<string, HTMLImageElement>()
    TECH_LOGOS.forEach((logo) => {
      const img = new Image()
      img.src = logo.src
      loadedImages.set(logo.id, img)
    })

    // Matter.js Modules
    const { Engine, World, Bodies, Body, Mouse, MouseConstraint, Composite, Events } = Matter

    // Create Matter Engine
    const engine = Engine.create({
      enableSleeping: true,
      gravity: { x: 0, y: 1.2, scale: 0.001 },
    })

    const world = engine.world

    let animFrameId: number | null = null
    let runnerId: number | null = null
    let isVisible = true

    // Canvas & DPR Scaling setup
    const getBounds = () => {
      const rect = container.getBoundingClientRect()
      return {
        width: Math.floor(rect.width),
        height: Math.floor(container.clientHeight || 600),
      }
    }

    let bounds = getBounds()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = bounds.width * dpr
    canvas.height = bounds.height * dpr
    canvas.style.width = `${bounds.width}px`
    canvas.style.height = `${bounds.height}px`

    const ctx = canvas.getContext('2d')

    // Create Static Boundaries (Floor, Left Wall, Right Wall)
    const wallOptions = { isStatic: true, friction: 0.8, frictionStatic: 1.0, restitution: 0.1 }
    const wallThickness = 100

    let ground = Bodies.rectangle(
      bounds.width / 2,
      bounds.height + wallThickness / 2,
      bounds.width * 2,
      wallThickness,
      wallOptions
    )
    let leftWall = Bodies.rectangle(
      -wallThickness / 2,
      bounds.height / 2,
      wallThickness,
      bounds.height * 2,
      wallOptions
    )
    let rightWall = Bodies.rectangle(
      bounds.width + wallThickness / 2,
      bounds.height / 2,
      wallThickness,
      bounds.height * 2,
      wallOptions
    )

    Composite.add(world, [ground, leftWall, rightWall])

    // Create Mouse & MouseConstraint
    const mouse = Mouse.create(canvas)

    // Scale mouse coordinates for DPR
    mouse.pixelRatio = dpr

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        damping: 0.1,
        render: { visible: false },
      },
    })

    Composite.add(world, mouseConstraint)

    // Cursor Feedback Logic
    Events.on(mouseConstraint, 'mousemove', (event: any) => {
      const mousePosition = event.mouse.position
      const hoveredBody = Matter.Query.point(Composite.allBodies(world), mousePosition).find(
        (b) => !b.isStatic
      )

      if (mouseConstraint.body) {
        setCursorStyle('grabbing')
      } else if (hoveredBody) {
        setCursorStyle('grab')
      } else {
        setCursorStyle('default')
      }
    })

    Events.on(mouseConstraint, 'startdrag', () => setCursorStyle('grabbing'))
    Events.on(mouseConstraint, 'enddrag', () => setCursorStyle('grab'))

    // Custom Canvas 2D Rendering Loop
    const renderLoop = () => {
      if (!ctx) return

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.scale(dpr, dpr)

      // Draw all physics bodies
      const bodies = Composite.allBodies(world)
      bodies.forEach((body) => {
        if (body.isStatic) return

        const logoData = (body as any).logoData as LogoItem | undefined
        if (!logoData) return

        const img = loadedImages.get(logoData.id)

        ctx.save()
        ctx.translate(body.position.x, body.position.y)
        ctx.rotate(body.angle)

        // Soft ambient shadow under bodies
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
        ctx.shadowBlur = 14
        ctx.shadowOffsetY = 6

        const drawW = logoData.width * 1.15
        const drawH = logoData.height * 1.15

        if (img && img.complete) {
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
        } else {
          // Fallback circle if image is still loading
          ctx.fillStyle = '#171717'
          ctx.beginPath()
          ctx.arc(0, 0, drawW / 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      })

      ctx.restore()

      if (isVisible) {
        animFrameId = requestAnimationFrame(renderLoop)
      }
    }

    // Engine Runner Step
    const runPhysicsStep = () => {
      if (isVisible) {
        Engine.update(engine, 1000 / 60)
        runnerId = window.setTimeout(runPhysicsStep, 1000 / 60)
      }
    }

    // Staggered Spawning of Logos on Viewport Entrance
    let hasSpawned = false
    const spawnLogos = () => {
      if (hasSpawned) return
      hasSpawned = true

      TECH_LOGOS.forEach((logo, index) => {
        setTimeout(() => {
          // Center-focused spawn distribution for natural pile stacking
          const center = bounds.width / 2
          const spread = Math.min(bounds.width * 0.7, 550)
          const spawnX = center - spread / 2 + Math.random() * spread
          const spawnY = -50 - Math.random() * 50

          const radius = (Math.max(logo.width, logo.height) * 1.12) / 2

          const body = Bodies.circle(spawnX, spawnY, radius, {
            friction: 0.55,         // High friction allows stable stacking without sliding
            frictionStatic: 0.85,   // Prevents stacked items from slipping
            frictionAir: 0.015,     // Natural gravity drop speed
            restitution: 0.15,      // Low bounce so logos settle cleanly into piles
            density: 0.003,         // Heavy physical mass
          })

          ;(body as any).logoData = logo

          // Initial subtle velocity & torque for cinematic drop
          Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 1.5,
            y: Math.random() * 2 + 1.5,
          })
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06)

          Composite.add(world, body)
        }, index * 90) // 90ms staggered reveal stream
      })
    }

    // IntersectionObserver to start spawning and pause/resume engine
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true
            spawnLogos()

            if (!animFrameId) {
              animFrameId = requestAnimationFrame(renderLoop)
            }
            if (!runnerId) {
              runPhysicsStep()
            }
          } else {
            isVisible = false
            if (animFrameId) {
              cancelAnimationFrame(animFrameId)
              animFrameId = null
            }
            if (runnerId) {
              clearTimeout(runnerId)
              runnerId = null
            }
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(container)

    // Handle Window Resize
    const handleResize = () => {
      bounds = getBounds()
      canvas.width = bounds.width * dpr
      canvas.height = bounds.height * dpr
      canvas.style.width = `${bounds.width}px`
      canvas.style.height = `${bounds.height}px`

      Body.setPosition(ground, { x: bounds.width / 2, y: bounds.height + wallThickness / 2 })
      Body.setPosition(leftWall, { x: -wallThickness / 2, y: bounds.height / 2 })
      Body.setPosition(rightWall, { x: bounds.width + wallThickness / 2, y: bounds.height / 2 })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)

      if (animFrameId) cancelAnimationFrame(animFrameId)
      if (runnerId) clearTimeout(runnerId)

      World.clear(world, false)
      Engine.clear(engine)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] bg-transparent rounded-3xl border border-neutral-800/30 overflow-hidden shadow-xl mt-4 sm:mt-6"
      style={{ cursor: cursorStyle }}
    >
      {/* Subtle Ambient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-transparent to-neutral-950/30 pointer-events-none"></div>

      {/* Matter.js Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-auto" />
    </div>
  )
}
