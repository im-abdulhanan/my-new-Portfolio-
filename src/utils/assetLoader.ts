import { SEQUENCE_CONFIG, getFramePath } from '../types/sequence'

export type LoadedAsset = ImageBitmap | HTMLImageElement

// Global memory cache for loaded sequence frames & static images
export const globalFrameCache = new Map<number, LoadedAsset>()
export const globalStaticImageCache = new Map<string, HTMLImageElement>()

const STATIC_ASSETS: string[] = [
  '/sequences/Projects Pics/Dracu-watch.PNG',
  '/sequences/Projects Pics/Travel.PNG',
  '/me.png',
  '/favicon.svg',
  '/sequences/Teach Stack/react.png',
  '/sequences/Teach Stack/typescript.png',
  '/sequences/Teach Stack/js.png',
  '/sequences/Teach Stack/nodejs.png',
  '/sequences/Teach Stack/nestjs.png',
  '/sequences/Teach Stack/docker.png',
  '/sequences/Teach Stack/git.png',
  '/sequences/Teach Stack/github.png',
  '/sequences/Teach Stack/copilotgithub.png',
  '/sequences/Teach Stack/gemini.png',
  '/sequences/Teach Stack/openai.png',
  '/sequences/Teach Stack/linux.png',
  '/sequences/Teach Stack/postman.png',
  '/sequences/Teach Stack/vitejs.png',
  '/sequences/Teach Stack/vscode.png',
  '/sequences/Teach Stack/hyper.png',
  '/sequences/Teach Stack/win.png',
  '/sequences/Teach Stack/microsoft.png',
  '/sequences/Teach Stack/npm.png',
  '/sequences/Teach Stack/claude.png',
  '/sequences/Teach Stack/anthoripic.png',
  '/sequences/Teach Stack/bootstrap.png',
  '/sequences/Teach Stack/antigravity.png',
  '/sequences/Teach Stack/Vector.png',
]

export interface AssetLoaderOptions {
  onProgress: (progress: number, loadedCount: number, totalCount: number) => void
  onComplete: () => void
}

export function startMasterAssetLoader(options: AssetLoaderOptions) {
  const CRITICAL_FRAME_COUNT = 30
  const totalFrames = SEQUENCE_CONFIG.totalFrames
  const totalStatic = STATIC_ASSETS.length
  
  // Total critical assets required for preloader completion
  const totalCriticalAssets = CRITICAL_FRAME_COUNT + totalStatic
  let criticalLoadedCount = 0
  let isPreloaderComplete = false

  const notifyProgress = () => {
    if (isPreloaderComplete) return
    criticalLoadedCount++
    const rawProgress = Math.floor((criticalLoadedCount / totalCriticalAssets) * 100)
    const progress = Math.min(100, rawProgress)

    options.onProgress(progress, criticalLoadedCount, totalCriticalAssets)

    if (criticalLoadedCount >= totalCriticalAssets && !isPreloaderComplete) {
      isPreloaderComplete = true
      options.onComplete()
      // Continue loading remaining background frames (31..240)
      loadBackgroundFrames()
    }
  }

  // 1. Single frame loader with memory caching and async decoding
  const loadSingleFrame = async (frameIndex: number): Promise<void> => {
    if (globalFrameCache.has(frameIndex)) {
      return
    }

    const path = getFramePath(frameIndex)
    try {
      if ('createImageBitmap' in window) {
        const response = await fetch(path)
        if (response.ok) {
          const blob = await response.blob()
          const bitmap = await createImageBitmap(blob)
          globalFrameCache.set(frameIndex, bitmap)
        }
      } else {
        await new Promise<void>((resolve) => {
          const img: HTMLImageElement = new Image()
          img.crossOrigin = 'anonymous'
          img.src = path
          if ('decode' in img && typeof img.decode === 'function') {
            img.decode().then(() => {
              globalFrameCache.set(frameIndex, img)
              resolve()
            }).catch(() => {
              globalFrameCache.set(frameIndex, img)
              resolve()
            })
          } else {
            img.onload = () => {
              globalFrameCache.set(frameIndex, img)
              resolve()
            }
            img.onerror = () => resolve()
          }
        })
      }
    } catch (e) {
      // Graceful fallback on network error
    }
  }

  // 2. Static image loader with memory caching and async decoding
  const loadStaticImage = async (url: string): Promise<void> => {
    if (globalStaticImageCache.has(url)) {
      return
    }

    await new Promise<void>((resolve) => {
      const img: HTMLImageElement = new Image()
      img.crossOrigin = 'anonymous'
      img.src = url
      if ('decode' in img && typeof img.decode === 'function') {
        img.decode().then(() => {
          globalStaticImageCache.set(url, img)
          resolve()
        }).catch(() => {
          globalStaticImageCache.set(url, img)
          resolve()
        })
      } else {
        img.onload = () => {
          globalStaticImageCache.set(url, img)
          resolve()
        }
        img.onerror = () => resolve()
      }
    })
  }

  // 3. Priority 1 Loading: First 30 frames + static assets + document fonts
  const loadCriticalAssets = async () => {
    const criticalTasks: (() => Promise<void>)[] = []

    // Critical frames 1..30
    for (let i = 1; i <= CRITICAL_FRAME_COUNT; i++) {
      const idx = i
      criticalTasks.push(async () => {
        await loadSingleFrame(idx)
        notifyProgress()
      })
    }

    // Also include boundary frame 240 in critical batch for smooth tail transition
    criticalTasks.push(async () => {
      await loadSingleFrame(totalFrames)
    })

    // Static images
    STATIC_ASSETS.forEach((url) => {
      criticalTasks.push(async () => {
        await loadStaticImage(url)
        notifyProgress()
      })
    })

    // Run critical tasks in parallel pool of 12
    const CONCURRENCY = 12
    for (let i = 0; i < criticalTasks.length; i += CONCURRENCY) {
      const batch = criticalTasks.slice(i, i + CONCURRENCY)
      await Promise.all(batch.map((task) => task()))
    }

    if (document.fonts) {
      await document.fonts.ready
    }
  }

  // 4. Background Loading: Progressive background loading for remaining frames (31..239)
  const loadBackgroundFrames = async () => {
    const remainingFrames: number[] = []
    for (let i = CRITICAL_FRAME_COUNT + 1; i < totalFrames; i++) {
      if (!globalFrameCache.has(i)) {
        remainingFrames.push(i)
      }
    }

    const CONCURRENCY = 6
    while (remainingFrames.length > 0) {
      const chunk = remainingFrames.splice(0, CONCURRENCY)
      await Promise.all(chunk.map((idx) => loadSingleFrame(idx)))
    }
  }

  loadCriticalAssets()
}
