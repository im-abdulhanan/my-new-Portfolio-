import { useEffect, useRef, useCallback } from 'react'
import { AdaptiveScaleConfig } from '../types/sequence'

type CanvasFrameSource = ImageBitmap | HTMLImageElement | null

export function useCanvasRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  getFrameImage: (index: number) => CanvasFrameSource
) {
  const lastRenderedFrameRef = useRef<number>(-1)
  const animFrameIdRef = useRef<number | null>(null)
  const currentFrameIndexRef = useRef<number>(1)

  /**
   * Adaptive Cinematic Scaling Calculation Strategy:
   * 1. Desktop: "contain" to preserve complete composition.
   * 2. Ultra-wide screens: Slight compositional zoom (1.05-1.10x) centered.
   * 3. Mobile: Prioritize face and upper torso while preserving natural aspect ratio.
   * 4. Zero stretching or distortion.
   */
  const calculateAdaptiveScale = useCallback(
    (
      canvasWidth: number,
      canvasHeight: number,
      imageWidth: number,
      imageHeight: number
    ): AdaptiveScaleConfig => {
      const canvasAspect = canvasWidth / canvasHeight

      let scale = 1.0
      let offsetX = 0
      let offsetY = 0

      const isMobile = window.innerWidth < 768 || canvasAspect < 0.85
      const isUltraWide = canvasWidth >= 1920 && canvasAspect > 1.9

      if (isMobile) {
        // Mobile Composition: Fit height/width focusing on upper torso and face (22% top offset)
        scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight)
        const drawW = imageWidth * scale
        const drawH = imageHeight * scale

        offsetX = (canvasWidth - drawW) / 2
        offsetY = (canvasHeight - drawH) * 0.22

        return {
          scale,
          offsetX,
          offsetY,
          drawWidth: drawW,
          drawHeight: drawH,
          canvasWidth,
          canvasHeight,
        }
      }

      // Desktop & Ultra-wide composition: "Contain" base fit
      let baseScale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight)

      if (isUltraWide) {
        // Ultra-wide: slight compositional zoom (1.08x) while preserving portrait centering
        baseScale *= 1.08
      }

      const drawW = imageWidth * baseScale
      const drawH = imageHeight * baseScale

      // Perfectly centered composition
      offsetX = (canvasWidth - drawW) / 2
      offsetY = (canvasHeight - drawH) / 2

      return {
        scale: baseScale,
        offsetX,
        offsetY,
        drawWidth: drawW,
        drawHeight: drawH,
        canvasWidth,
        canvasHeight,
      }
    },
    []
  )

  /**
   * Render function called on frame index changes or window resizes
   */
  const renderFrame = useCallback(
    (frameIndex: number, forceRedraw = false) => {
      currentFrameIndexRef.current = frameIndex

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) return

      // Skip duplicate renders unless forced by resize
      if (!forceRedraw && Math.floor(frameIndex) === lastRenderedFrameRef.current) {
        return
      }

      const image = getFrameImage(frameIndex)
      if (!image) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap DPR at 2 for crisp performance
      const rect = canvas.getBoundingClientRect()

      const targetWidth = Math.floor(rect.width * dpr)
      const targetHeight = Math.floor(rect.height * dpr)

      // Resize canvas backing store if dimensions changed
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth
        canvas.height = targetHeight
      }

      const imgWidth = 'width' in image ? image.width : (image as HTMLImageElement).naturalWidth
      const imgHeight = 'height' in image ? image.height : (image as HTMLImageElement).naturalHeight

      if (!imgWidth || !imgHeight) return

      // Calculate adaptive cinematic scaling for current backing store size
      const config = calculateAdaptiveScale(targetWidth, targetHeight, imgWidth, imgHeight)

      // High-quality image smoothing configuration
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // STEP 1: Fill canvas with exact background color #E0E3E0
      ctx.fillStyle = '#E0E3E0'
      ctx.fillRect(0, 0, targetWidth, targetHeight)

      // STEP 2: Render extremely subtle overhead radial gradient to extend soft light rays into the viewport
      const centerX = targetWidth * 0.5
      const centerY = targetHeight * 0.38
      const maxRadius = Math.max(targetWidth, targetHeight) * 0.7

      const radialGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius)
      radialGlow.addColorStop(0, '#E8EBE8') // +3% soft highlight for overhead light continuation
      radialGlow.addColorStop(0.5, '#E0E3E0') // Native sequence background color
      radialGlow.addColorStop(1, '#D8DBD8') // -3% subtle ambient vignette at viewport boundaries

      ctx.fillStyle = radialGlow
      ctx.fillRect(0, 0, targetWidth, targetHeight)

      // STEP 3: Draw active WebP image frame on top of the infinite canvas background
      ctx.drawImage(image, config.offsetX, config.offsetY, config.drawWidth, config.drawHeight)

      // STEP 4: Soft edge feathering overlay to guarantee 100% invisible transition between image edges & background
      const edgeFeather = Math.min(config.drawWidth, config.drawHeight) * 0.04
      if (edgeFeather > 2 && (config.offsetX > 0 || config.offsetY > 0)) {
        // Left Edge Feather
        if (config.offsetX > 0) {
          const grad = ctx.createLinearGradient(config.offsetX, 0, config.offsetX + edgeFeather, 0)
          grad.addColorStop(0, '#E0E3E0')
          grad.addColorStop(1, 'rgba(224, 227, 224, 0)')
          ctx.fillStyle = grad
          ctx.fillRect(config.offsetX - 1, config.offsetY, edgeFeather + 1, config.drawHeight)
        }
        // Right Edge Feather
        if (config.offsetX + config.drawWidth < targetWidth) {
          const rightX = config.offsetX + config.drawWidth
          const grad = ctx.createLinearGradient(rightX - edgeFeather, 0, rightX, 0)
          grad.addColorStop(0, 'rgba(224, 227, 224, 0)')
          grad.addColorStop(1, '#E0E3E0')
          ctx.fillStyle = grad
          ctx.fillRect(rightX - edgeFeather, config.offsetY, edgeFeather + 1, config.drawHeight)
        }
        // Top Edge Feather
        if (config.offsetY > 0) {
          const grad = ctx.createLinearGradient(0, config.offsetY, 0, config.offsetY + edgeFeather)
          grad.addColorStop(0, '#E0E3E0')
          grad.addColorStop(1, 'rgba(224, 227, 224, 0)')
          ctx.fillStyle = grad
          ctx.fillRect(config.offsetX, config.offsetY - 1, config.drawWidth, edgeFeather + 1)
        }
        // Bottom Edge Feather
        if (config.offsetY + config.drawHeight < targetHeight) {
          const bottomY = config.offsetY + config.drawHeight
          const grad = ctx.createLinearGradient(0, bottomY - edgeFeather, 0, bottomY)
          grad.addColorStop(0, 'rgba(224, 227, 224, 0)')
          grad.addColorStop(1, '#E0E3E0')
          ctx.fillStyle = grad
          ctx.fillRect(config.offsetX, bottomY - edgeFeather, config.drawWidth, edgeFeather + 1)
        }
      }

      lastRenderedFrameRef.current = Math.floor(frameIndex)
    },
    [canvasRef, getFrameImage, calculateAdaptiveScale]
  )

  /**
   * Handle high-frequency resize events using ResizeObserver
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new ResizeObserver(() => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      animFrameIdRef.current = requestAnimationFrame(() => {
        renderFrame(currentFrameIndexRef.current, true)
      })
    })

    observer.observe(canvas)

    return () => {
      observer.disconnect()
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
    }
  }, [canvasRef, renderFrame])

  return {
    renderFrame,
  }
}
