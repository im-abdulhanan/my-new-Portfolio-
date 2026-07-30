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
  const totalFrames = SEQUENCE_CONFIG.totalFrames
  const totalStatic = STATIC_ASSETS.length
  const totalAssets = totalFrames + totalStatic

  let loadedCount = 0
  let isComplete = false

  const notifyProgress = () => {
    if (isComplete) return
    loadedCount++
    const rawProgress = Math.floor((loadedCount / totalAssets) * 100)
    const progress = Math.min(100, rawProgress)

    options.onProgress(progress, loadedCount, totalAssets)

    if (loadedCount >= totalAssets && !isComplete) {
      isComplete = true
      options.onComplete()
    }
  }

  // 1. Single frame loader with memory caching and async decoding
  const loadSingleFrame = async (frameIndex: number): Promise<void> => {
    if (globalFrameCache.has(frameIndex)) {
      notifyProgress()
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
      // Fallback
    } finally {
      notifyProgress()
    }
  }

  // 2. Static image loader
  const loadStaticImage = async (url: string): Promise<void> => {
    if (globalStaticImageCache.has(url)) {
      notifyProgress()
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
    notifyProgress()
  }

  // 3. Load all 240 frames + static assets in managed parallel chunks
  const loadAllAssets = async () => {
    const tasks: (() => Promise<void>)[] = []

    // Priority 1: Frame 1 and Frame 240
    await loadSingleFrame(1)
    await loadSingleFrame(totalFrames)

    // All remaining frames (2..239)
    for (let i = 2; i < totalFrames; i++) {
      const idx = i
      tasks.push(() => loadSingleFrame(idx))
    }

    // All static images
    STATIC_ASSETS.forEach((url) => {
      tasks.push(() => loadStaticImage(url))
    })

    // Parallel chunk processing with concurrency pool of 8 to pace loading smoothly over 6-10s
    const CONCURRENCY = 8
    for (let i = 0; i < tasks.length; i += CONCURRENCY) {
      const batch = tasks.slice(i, i + CONCURRENCY)
      await Promise.all(batch.map((t) => t()))
    }

    if (document.fonts) {
      await document.fonts.ready
    }
  }

  loadAllAssets()
}
