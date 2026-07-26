export interface FrameSequenceState {
  currentFrameIndex: number
  totalFrames: number
  loadedCount: number
  isFirstFrameReady: boolean
  isFullyLoaded: boolean
  loadPercentage: number
  error: string | null
}

export interface AdaptiveScaleConfig {
  scale: number
  offsetX: number
  offsetY: number
  drawWidth: number
  drawHeight: number
  canvasWidth: number
  canvasHeight: number
}

export const SEQUENCE_CONFIG = {
  totalFrames: 240,
  basePath: '/sequences/terminator/frame_',
  extension: '.webp',
  padLength: 4,
  pinnedScrollHeightVh: 600,
  cacheWindowBefore: 15,
  cacheWindowAfter: 35,
} as const

export function formatFrameNumber(index: number): string {
  // Clamp between 1 and 240
  const clamped = Math.max(1, Math.min(SEQUENCE_CONFIG.totalFrames, Math.floor(index)))
  return String(clamped).padStart(SEQUENCE_CONFIG.padLength, '0')
}

export function getFramePath(index: number): string {
  return `${SEQUENCE_CONFIG.basePath}${formatFrameNumber(index)}${SEQUENCE_CONFIG.extension}`
}
