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
  { id: 'claude', name: 'Claude', src: '/sequences/Teach Stack/claude.png', width: 60, height: 60 },
  { id: 'anthropic', name: 'Anthropic', src: '/sequences/Teach Stack/anthoripic.png', width: 60, height: 60 },
  { id: 'bootstrap', name: 'Bootstrap', src: '/sequences/Teach Stack/bootstrap.png', width: 60, height: 60 },
  { id: 'antigravity', name: 'Antigravity', src: '/sequences/Teach Stack/antigravity.png', width: 60, height: 60 },
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

    // Create Matter Engine with sleeping enabled
    const engine = Engine.create({
      enableSleeping: true,
      gravity: { x: 0, y: 0.9, scale: 0.001 }, // Realistic low gravity
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
        height: Math.floor(container.clientHeight || 460),
      }
    }

    let bounds = getBounds()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = bounds.width * dpr
    canvas.height = bounds.height * dpr
    canvas.style.width = `${bounds.width}px`
    canvas.style.height = `${bounds.height}px`

    const ctx = canvas.getContext('2d')

    // 1. Calculate Horizontal Spawn Zones (Shelf Distribution)
    const numZones = Math.max(6, Math.min(8, Math.floor(bounds.width / 115)))
    const zoneWidth = bounds.width / numZones

    // 2. Create Static Boundaries & Invisible Separators
    const wallOptions = { isStatic: true, friction: 0.8, frictionStatic: 0.95, restitution: 0.1 }
    const wallThickness = 100

    const ground = Bodies.rectangle(
      bounds.width / 2,
      bounds.height + wallThickness / 2,
      bounds.width * 2,
      wallThickness,
      wallOptions
    )
    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      bounds.height / 2,
      wallThickness,
      bounds.height * 2,
      wallOptions
    )
    const rightWall = Bodies.rectangle(
      bounds.width + wallThickness / 2,
      bounds.height / 2,
      wallThickness,
      bounds.height * 2,
      wallOptions
    )

    // Invisible Vertical Zone Separator Barriers (discourages cross-zone migration)
    const separators: Matter.Body[] = []
    const barrierHeight = bounds.height * 0.45
    for (let z = 1; z < numZones; z++) {
      const sepX = z * zoneWidth
      const separator = Bodies.rectangle(
        sepX,
        bounds.height - barrierHeight / 2,
        8, // thin invisible separator
        barrierHeight,
        {
          isStatic: true,
          friction: 0.2,
          restitution: 0.1,
          render: { visible: false },
        }
      )
      separators.push(separator)
    }

    Composite.add(world, [ground, leftWall, rightWall, ...separators])

    // Create Mouse & MouseConstraint
    const mouse = Mouse.create(canvas)
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

      // Draw all physics bodies (Static separators are ignored so they remain 100% invisible)
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

    // Engine Runner Step + Zone Horizontal Steering
    const runPhysicsStep = () => {
      if (isVisible) {
        // Apply gentle horizontal steering force toward assigned zone center during descent
        const allBodies = Composite.allBodies(world)
        allBodies.forEach((b) => {
          if (b.isStatic || b.isSleeping) return
          const assignedX = (b as any).assignedZoneCenterX as number | undefined
          if (assignedX !== undefined && b.position.y < bounds.height * 0.7) {
            const dx = assignedX - b.position.x
            Body.applyForce(b, b.position, { x: dx * 0.00003, y: 0 })
          }
        })

        Engine.update(engine, 1000 / 60)
        runnerId = window.setTimeout(runPhysicsStep, 1000 / 60)
      }
    }

    // Zone-Assigned Staggered Spawning of Logos
    let hasSpawned = false
    const spawnLogos = () => {
      if (hasSpawned) return
      hasSpawned = true

      // Track logos per zone to limit max 2-3 logos per zone
      const zoneCounts = new Array(numZones).fill(0)

      TECH_LOGOS.forEach((logo, index) => {
        setTimeout(() => {
          // Assign to zone with least items or round-robin
          let assignedZone = index % numZones
          if (zoneCounts[assignedZone] >= 3) {
            assignedZone = zoneCounts.indexOf(Math.min(...zoneCounts))
          }
          zoneCounts[assignedZone]++

          const zoneCenterX = (assignedZone + 0.5) * zoneWidth
          // Slight jitter around assigned zone center
          const spawnX = zoneCenterX + (Math.random() - 0.5) * (zoneWidth * 0.35)
          const spawnY = -60 - Math.random() * 40

          const radius = (Math.max(logo.width, logo.height) * 1.1) / 2

          const body = Bodies.circle(spawnX, spawnY, radius, {
            friction: 0.45,         // High friction for stable resting state on shelf
            frictionStatic: 0.9,    // Prevents settled bodies from being pushed across the floor
            frictionAir: 0.02,      // Moderate air friction for smooth low-gravity descent
            restitution: 0.15,      // Low bounce for clean, shelf-like settling
            density: 0.003,
          })

          ;(body as any).logoData = logo
          ;(body as any).assignedZoneCenterX = zoneCenterX

          // Small initial velocity & slight rotation
          Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 1.2,
            y: Math.random() * 1.5 + 1.0,
          })
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06)

          Composite.add(world, body)
        }, index * 95) // 95ms staggered drop
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
