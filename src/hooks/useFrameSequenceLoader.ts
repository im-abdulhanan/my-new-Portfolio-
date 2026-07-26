import { useState, useEffect, useRef, useCallback } from 'react'
import { SEQUENCE_CONFIG, getFramePath, FrameSequenceState } from '../types/sequence'

type LoadedFrame = ImageBitmap | HTMLImageElement

export function useFrameSequenceLoader() {
  const [state, setState] = useState<FrameSequenceState>({
    currentFrameIndex: 1,
    totalFrames: SEQUENCE_CONFIG.totalFrames,
    loadedCount: 0,
    isFirstFrameReady: false,
    isFullyLoaded: false,
    loadPercentage: 0,
    error: null,
  })

  // Map of loaded frame images keyed by frame index (1..240)
  const framesCacheRef = useRef<Map<number, LoadedFrame>>(new Map())

  // Track active fetch/decode promises to avoid redundant network requests
  const loadingPromisesRef = useRef<Map<number, Promise<LoadedFrame | null>>>(new Map())

  // Keep track of requested target frame for adaptive window preloading
  const currentTargetFrameRef = useRef<number>(1)

  /**
   * Helper to decode an image into ImageBitmap (if supported) or HTMLImageElement
   */
  const loadSingleFrame = useCallback(async (index: number): Promise<LoadedFrame | null> => {
    if (framesCacheRef.current.has(index)) {
      return framesCacheRef.current.get(index)!
    }

    if (loadingPromisesRef.current.has(index)) {
      return loadingPromisesRef.current.get(index)!
    }

    const path = getFramePath(index)

    const promise = (async () => {
      try {
        if ('createImageBitmap' in window) {
          const response = await fetch(path)
          if (!response.ok) throw new Error(`HTTP error ${response.status} loading ${path}`)
          const blob = await response.blob()
          const bitmap = await createImageBitmap(blob)
          framesCacheRef.current.set(index, bitmap)
          return bitmap
        } else {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = path
            img.onload = () => {
              framesCacheRef.current.set(index, img)
              resolve(img)
            }
            img.onerror = (err) => reject(err)
          })
        }
      } catch (err) {
        console.warn(`[FrameSequenceLoader] Failed to load frame ${index}:`, err)
        return null
      } finally {
        loadingPromisesRef.current.delete(index)
      }
    })()

    loadingPromisesRef.current.set(index, promise)
    return promise
  }, [])

  /**
   * Memory management: purge distant ImageBitmaps outside the active window
   */
  const pruneUnusedFrames = useCallback((activeCenter: number) => {
    const minKeep = Math.max(1, activeCenter - SEQUENCE_CONFIG.cacheWindowBefore)
    const maxKeep = Math.min(SEQUENCE_CONFIG.totalFrames, activeCenter + SEQUENCE_CONFIG.cacheWindowAfter)

    // Always preserve Frame 1 and Frame 240 (boundaries)
    for (const [index, frame] of framesCacheRef.current.entries()) {
      if (index !== 1 && index !== SEQUENCE_CONFIG.totalFrames && (index < minKeep || index > maxKeep)) {
        if ('close' in frame && typeof frame.close === 'function') {
          frame.close() // Release GPU texture memory
        }
        framesCacheRef.current.delete(index)
      }
    }
  }, [])

  /**
   * Main Initialization & Preloading Cycle
   */
  useEffect(() => {
    let isMounted = true

    const initSequence = async () => {
      // 1. Immediately load Frame 1
      const frame1 = await loadSingleFrame(1)
      if (!isMounted) return

      if (frame1) {
        setState((prev) => ({
          ...prev,
          loadedCount: 1,
          isFirstFrameReady: true,
          loadPercentage: Math.round((1 / SEQUENCE_CONFIG.totalFrames) * 100),
        }))
      }

      // 2. Load Frame 240 immediately to ensure seamless tail transition end state
      loadSingleFrame(SEQUENCE_CONFIG.totalFrames)

      // 3. Batch load remaining frames sequentially / in chunks
      const remainingIndexes: number[] = []
      for (let i = 2; i < SEQUENCE_CONFIG.totalFrames; i++) {
        remainingIndexes.push(i)
      }

      // Process batch preloading with concurrency limit of 6 connections
      const CONCURRENCY = 6
      let loadedCounter = framesCacheRef.current.size

      const processBatch = async () => {
        while (remainingIndexes.length > 0) {
          if (!isMounted) break
          const chunk = remainingIndexes.splice(0, CONCURRENCY)
          await Promise.all(
            chunk.map(async (idx) => {
              const res = await loadSingleFrame(idx)
              if (res) {
                loadedCounter++
                if (isMounted) {
                  setState((prev) => {
                    const newLoaded = Math.min(SEQUENCE_CONFIG.totalFrames, prev.loadedCount + 1)
                    return {
                      ...prev,
                      loadedCount: newLoaded,
                      loadPercentage: Math.round((newLoaded / SEQUENCE_CONFIG.totalFrames) * 100),
                      isFullyLoaded: newLoaded >= SEQUENCE_CONFIG.totalFrames,
                    }
                  })
                }
              }
            })
          )
        }
      }

      processBatch()
    }

    initSequence()

    return () => {
      isMounted = false
      // Cleanup GPU textures on unmount
      for (const frame of framesCacheRef.current.values()) {
        if ('close' in frame && typeof frame.close === 'function') {
          frame.close()
        }
      }
      framesCacheRef.current.clear()
    }
  }, [loadSingleFrame])

  /**
   * Retrieve frame image for rendering, ensuring instant load if scrubbed into uncached region
   */
  const getFrameImage = useCallback(
    (index: number): LoadedFrame | null => {
      const clampedIndex = Math.max(1, Math.min(SEQUENCE_CONFIG.totalFrames, Math.floor(index)))
      currentTargetFrameRef.current = clampedIndex

      const cached = framesCacheRef.current.get(clampedIndex)
      if (cached) {
        return cached
      }

      // If frame is missing from cache, trigger high-priority load for it and surrounding window
      loadSingleFrame(clampedIndex)
      pruneUnusedFrames(clampedIndex)

      // Fall back to nearest available loaded frame
      let nearestFrame: LoadedFrame | null = null
      let minDistance = Infinity

      for (const [idx, frame] of framesCacheRef.current.entries()) {
        const dist = Math.abs(idx - clampedIndex)
        if (dist < minDistance) {
          minDistance = dist
          nearestFrame = frame
        }
      }

      return nearestFrame
    },
    [loadSingleFrame, pruneUnusedFrames]
  )

  return {
    state,
    getFrameImage,
    preloadWindow: pruneUnusedFrames,
  }
}
