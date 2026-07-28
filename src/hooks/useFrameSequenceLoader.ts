import { useState, useEffect, useCallback } from 'react'
import { SEQUENCE_CONFIG, FrameSequenceState } from '../types/sequence'
import { globalFrameCache, LoadedAsset } from '../utils/assetLoader'

export function useFrameSequenceLoader() {
  const [state, setState] = useState<FrameSequenceState>({
    currentFrameIndex: 1,
    totalFrames: SEQUENCE_CONFIG.totalFrames,
    loadedCount: globalFrameCache.size || SEQUENCE_CONFIG.totalFrames,
    isFirstFrameReady: true,
    isFullyLoaded: true,
    loadPercentage: 100,
    error: null,
  })

  useEffect(() => {
    setState({
      currentFrameIndex: 1,
      totalFrames: SEQUENCE_CONFIG.totalFrames,
      loadedCount: globalFrameCache.size,
      isFirstFrameReady: true,
      isFullyLoaded: globalFrameCache.size >= SEQUENCE_CONFIG.totalFrames,
      loadPercentage: 100,
      error: null,
    })
  }, [])

  const getFrameImage = useCallback((index: number): LoadedAsset | null => {
    const clampedIndex = Math.max(1, Math.min(SEQUENCE_CONFIG.totalFrames, Math.floor(index)))

    if (globalFrameCache.has(clampedIndex)) {
      return globalFrameCache.get(clampedIndex)!
    }

    // Fallback to nearest cached frame if available
    let nearestFrame: LoadedAsset | null = null
    let minDistance = Infinity

    for (const [idx, frame] of globalFrameCache.entries()) {
      const dist = Math.abs(idx - clampedIndex)
      if (dist < minDistance) {
        minDistance = dist
        nearestFrame = frame
      }
    }

    return nearestFrame
  }, [])

  return {
    state,
    getFrameImage,
    preloadWindow: () => {},
  }
}
