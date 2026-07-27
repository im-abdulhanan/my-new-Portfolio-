import React, { useState, useEffect, useRef } from 'react'

interface HeroTypographyProps {
  scrollProgress: number
  isFirstFrameReady: boolean
}

const RIGHT_PHRASES = [
  'FULL STACK ENGINEER',
  'AI-POWERED DEVELOPER',
  'CYBERSECURITY ENTHUSIAST',
  'CREATIVE PROBLEM SOLVER',
  'BUILDING DIGITAL EXPERIENCES',
]

const NAME_TRANSLATIONS = [
  { name: 'ABDUL HANAN', lang: 'EN' },
  { name: '阿布杜尔·哈南', lang: 'ZH' },
  { name: 'АБДУЛ ХАНАН', lang: 'RU' },
  { name: 'عبدالحنان', lang: 'UR' },
  { name: 'अब्दुल हनान', lang: 'HI' },
  { name: 'АБДУЛ ХАНАН', lang: 'DE' },
]

const GLYPHS = '#%$@&*!?/\\X01'

export const HeroTypography: React.FC<HeroTypographyProps> = ({
  scrollProgress,
  isFirstFrameReady,
}) => {
  // Calculate current frame index based on 240 total frames
  const currentFrame = 1 + scrollProgress * 239

  /**
   * LEFT SIDE STAGE 1 (Frame 0001 -> 0096):
   * "YO! I'M ABDUL HANAN" (Rotates multilingual name every 3s)
   */
  let introOpacity = 0
  let introTranslateY = 0

  if (isFirstFrameReady) {
    if (currentFrame < 87) {
      introOpacity = 1
      introTranslateY = 0
    } else if (currentFrame <= 97) {
      const fadeRatio = (97 - currentFrame) / 10
      introOpacity = Math.max(0, Math.min(1, fadeRatio))
      introTranslateY = (1 - fadeRatio) * -20
    } else {
      introOpacity = 0
    }
  }

  /**
   * LEFT SIDE STAGE 2 (Frame 0097 -> 0240):
   * "IN THE ERA OF AI, WE BUILD DIFFERENT."
   */
  let statementOpacity = 0
  let statementTranslateY = 20

  if (isFirstFrameReady && currentFrame >= 87) {
    if (currentFrame < 97) {
      statementOpacity = 0
      statementTranslateY = 20
    } else if (currentFrame < 107) {
      const progressRatio = (currentFrame - 97) / 10
      statementOpacity = Math.max(0, Math.min(1, progressRatio))
      statementTranslateY = (1 - progressRatio) * 20
    } else {
      statementOpacity = 1
      statementTranslateY = 0
    }
  }

  /**
   * RIGHT SIDE TYPOGRAPHY BEHAVIOR:
   * Visible continuously from Frame 0001 through Frame 0240
   */
  const rightOpacity = isFirstFrameReady ? 1 : 0

  // 1. Right Side Specialization Rotation Timer
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState(RIGHT_PHRASES[0])
  const [redWordIndices, setRedWordIndices] = useState<number[]>([1])
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => {
        const nextIndex = (prev + 1) % RIGHT_PHRASES.length
        const targetPhrase = RIGHT_PHRASES[nextIndex]

        const words = targetPhrase.split(' ')
        const randomRedIdx = Math.floor(Math.random() * words.length)
        setRedWordIndices([randomRedIdx])

        let iteration = 0
        if (intervalRef.current) clearInterval(intervalRef.current)

        intervalRef.current = window.setInterval(() => {
          setDisplayText(
            targetPhrase
              .split('')
              .map((char, idx) => {
                if (char === ' ') return ' '
                if (idx < iteration) return targetPhrase[idx]
                return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              })
              .join('')
          )

          if (iteration >= targetPhrase.length) {
            if (intervalRef.current) clearInterval(intervalRef.current)
          }
          iteration += 1 / 1.5
        }, 25)

        return nextIndex
      })
    }, 3000)

    return () => {
      clearInterval(timer)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // 2. Left Side Multilingual "ABDUL HANAN" Name Rotation Timer (Every 3s)
  const [, setNameIndex] = useState(0)
  const [displayName, setDisplayName] = useState(NAME_TRANSLATIONS[0].name)
  const nameIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    const nameTimer = setInterval(() => {
      setNameIndex((prev) => {
        const nextIdx = (prev + 1) % NAME_TRANSLATIONS.length
        const targetName = NAME_TRANSLATIONS[nextIdx].name

        let iteration = 0
        if (nameIntervalRef.current) clearInterval(nameIntervalRef.current)

        nameIntervalRef.current = window.setInterval(() => {
          setDisplayName(
            targetName
              .split('')
              .map((char, idx) => {
                if (char === ' ' || char === '·') return char
                if (idx < iteration) return targetName[idx]
                return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              })
              .join('')
          )

          if (iteration >= targetName.length) {
            if (nameIntervalRef.current) clearInterval(nameIntervalRef.current)
          }
          iteration += 1 / 1.2
        }, 30)

        return nextIdx
      })
    }, 3000)

    return () => {
      clearInterval(nameTimer)
      if (nameIntervalRef.current) clearInterval(nameIntervalRef.current)
    }
  }, [])

  // Helper to render phrase with random dark red word highlight
  const renderPhraseWords = (text: string) => {
    const words = text.split(' ')
    return words.map((word, idx) => {
      const isRed = redWordIndices.includes(idx)
      return (
        <span key={idx} className={isRed ? 'text-[#800000]' : 'text-[#777875] lg:text-neutral-800'}>
          {word}{' '}
        </span>
      )
    })
  }

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col lg:flex-row items-center justify-end lg:justify-between pb-28 lg:pb-0 p-6 lg:p-20 select-none overflow-hidden space-y-4 lg:space-y-0">
      {/* LEFT SIDE CONTAINER (Hosts Stage 1 Intro & Stage 2 Statement) */}
      <div className="relative max-w-[280px] sm:max-w-[340px] lg:max-w-[460px] text-center lg:text-left mx-auto lg:mx-0">
        {/* Stage 1: Frame 0001 -> 0096 Multilingual Intro Text */}
        <div
          className="transition-all duration-300 ease-out"
          style={{
            opacity: introOpacity,
            transform: `translateY(${introTranslateY}px)`,
            display: currentFrame > 105 ? 'none' : 'block',
          }}
        >
          <h1 className="font-thunder text-3xl sm:text-4xl lg:text-8xl text-[#777875] lg:text-neutral-900 tracking-tighter uppercase leading-[0.85] drop-shadow-sm">
            YO! I'M<br />
            <span className="text-[#990000]">{displayName}</span>
          </h1>
        </div>

        {/* Stage 2: Frame 0097 -> 0240 Statement Text */}
        <div
          className="transition-all duration-300 ease-out"
          style={{
            opacity: statementOpacity,
            transform: `translateY(${statementTranslateY}px)`,
            position: currentFrame <= 105 ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
          <h1 className="font-thunder text-3xl sm:text-4xl lg:text-8xl text-[#777875] lg:text-neutral-900 tracking-tighter uppercase leading-[0.85] drop-shadow-sm">
            IN THE ERA OF <span className="text-[#800000]">AI</span>,<br />
            <span className="text-[#777875] lg:text-neutral-800">WE </span>
            <span className="text-[#990000]">BUILD</span>
            <span className="text-[#777875] lg:text-neutral-800"> DIFFERENT.</span>
          </h1>
        </div>
      </div>

      {/* RIGHT SIDE DYNAMIC SCRAMBLE TYPOGRAPHY */}
      <div
        className="max-w-[280px] sm:max-w-[340px] lg:max-w-[460px] text-center lg:text-right mx-auto lg:ml-auto lg:mr-0 transition-opacity duration-500 ease-out space-y-1 lg:space-y-2"
        style={{
          opacity: rightOpacity,
        }}
      >
        <div className="text-[9px] sm:text-[10px] font-technical uppercase tracking-[0.3em] text-[#777875] lg:text-neutral-600 block">
          SPECIALIZATION // 0{phraseIndex + 1}
        </div>
        <h2 className="font-thunder text-3xl sm:text-4xl lg:text-8xl text-[#777875] lg:text-neutral-900 tracking-tighter uppercase leading-[0.85] drop-shadow-sm">
          {renderPhraseWords(displayText)}
        </h2>
      </div>
    </div>
  )
}
