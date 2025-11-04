import React, { useEffect, useMemo, useRef } from 'react'
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window')

export default function AnimatedBackground({
  colors,
  effect = 'ambient',
  accentColor = '#ffffff',
  mode = 'day',
  windSpeed = 0,
  children,
}) {
  const showAmbient = mode !== 'night' && ['clear', 'breeze', 'ambient'].includes(effect)

  return (
    <LinearGradient colors={colors} style={styles.container}>
      {showAmbient && <AmbientBlobs accentColor={accentColor} />}
      <HorizonGlow mode={mode} />
      <WeatherEffectLayer effect={effect} mode={mode} windSpeed={windSpeed} />
      {children}
    </LinearGradient>
  )
}

function AmbientBlobs({ accentColor }) {
  const floatPrimary = useRef(new Animated.Value(0)).current
  const floatSecondary = useRef(new Animated.Value(0)).current
  const shimmer = useRef(new Animated.Value(0)).current
  const accentSoft = useMemo(() => hexToRgba(accentColor, 0.12), [accentColor])
  const accentFaint = useMemo(() => hexToRgba(accentColor, 0.05), [accentColor])
  const accentGlow = useMemo(() => hexToRgba(accentColor, 0.16), [accentColor])

  useEffect(() => {
    const animations = []

    const createFloat = (animatedValue, delay = 0, duration = 16000) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        { resetBeforeIteration: true }
      )

      loop.start()
      animations.push(loop)
    }

    createFloat(floatPrimary, 0, 18000)
    createFloat(floatSecondary, 3600, 20000)

    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    )

    shimmerLoop.start()
    animations.push(shimmerLoop)

    return () => {
      animations.forEach(animation => animation.stop())
    }
  }, [floatPrimary, floatSecondary, shimmer])

  const blobPrimaryStyle = {
    transform: [
      {
        translateX: floatPrimary.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, 40],
        }),
      },
      {
        translateY: floatPrimary.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 30],
        }),
      },
      {
        scale: floatPrimary.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.18],
        }),
      },
      {
        rotate: floatPrimary.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '12deg'],
        }),
      },
    ],
  }

  const blobSecondaryStyle = {
    transform: [
      {
        translateX: floatSecondary.interpolate({
          inputRange: [0, 1],
          outputRange: [40, -50],
        }),
      },
      {
        translateY: floatSecondary.interpolate({
          inputRange: [0, 1],
          outputRange: [30, -25],
        }),
      },
      {
        scale: floatSecondary.interpolate({
          inputRange: [0, 1],
          outputRange: [1.05, 0.88],
        }),
      },
    ],
  }

  const shimmerStyle = {
    opacity: shimmer.interpolate({
      inputRange: [0, 1],
      outputRange: [0.12, 0.32],
    }),
    transform: [
      {
        translateY: shimmer.interpolate({
          inputRange: [0, 1],
          outputRange: [-120, 20],
        }),
      },
    ],
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <AnimatedLinearGradient
        colors={['rgba(255,255,255,0.22)', accentFaint]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 0.9 }}
        style={[styles.blob, styles.blobTop, blobPrimaryStyle]}
      />
      <AnimatedLinearGradient
        colors={[accentSoft, 'rgba(255,255,255,0)']}
        start={{ x: 0.1, y: 0.15 }}
        end={{ x: 0.9, y: 0.85 }}
        style={[styles.blob, styles.blobBottom, blobSecondaryStyle]}
      />
      <AnimatedLinearGradient
        colors={['rgba(255,255,255,0.16)', accentGlow]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.shimmer, shimmerStyle]}
      />
    </View>
  )
}

function HorizonGlow({ mode }) {
  const pulse = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 7000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 7000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: true }
    )

    loop.start()
    return () => loop.stop()
  }, [pulse])

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: mode === 'night' ? [0.28, 0.46] : [0.38, 0.68],
  })

  const colors =
    mode === 'night'
      ? ['rgba(6,11,30,0)', 'rgba(26,48,92,0.42)', 'rgba(102,142,210,0.26)']
      : ['rgba(255,255,255,0)', 'rgba(255,220,168,0.55)', 'rgba(255,182,98,0.32)']

  return (
    <AnimatedLinearGradient
      pointerEvents="none"
      colors={colors}
      start={{ x: 0.5, y: 0.45 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.horizonGlow, { opacity }]}
    />
  )
}

function WeatherEffectLayer({ effect, mode, windSpeed = 0 }) {
  const fallbackStrength = effect === 'breeze' ? 'light' : null
  const measuredStrength = getWindStrength(windSpeed)
  const windStrength = mergeWindStrength(fallbackStrength, measuredStrength)
  const windLayer = windStrength ? <WindLayer mode={mode} strength={windStrength} /> : null

  if (effect === 'clear') {
    if (mode === 'night') {
      return (
        <>
          <MoonLayer />
          <StarLayer density={32} />
          {windLayer}
        </>
      )
    }

    return (
      <>
        <SunLayer />
        <SparkleLayer density={10} tintColor="rgba(255,236,179,0.85)" />
        {windLayer}
      </>
    )
  }

  if (effect === 'breeze') {
    if (mode === 'night') {
      return (
        <>
          <MoonLayer />
          <CloudLayer variant="soft-night" />
          <StarLayer density={24} />
          {windLayer}
        </>
      )
    }

    return (
      <>
        <SunLayer withClouds />
        <CloudLayer variant="soft" />
        <SparkleLayer density={14} tintColor="rgba(255,247,213,0.8)" />
        {windLayer}
      </>
    )
  }

  if (effect === 'rain') {
    return (
      <>
        <CloudLayer variant={mode === 'night' ? 'storm-night' : 'storm-day'} />
        <RainLayer />
        {windLayer}
        <MistLayer mode={mode} density="rain" />
      </>
    )
  }

  if (effect === 'drizzle') {
    return (
      <>
        <CloudLayer variant={mode === 'night' ? 'dense-night' : 'dense-day'} />
        <RainLayer intensity="light" />
        {windLayer}
        <MistLayer mode={mode} density="light" />
      </>
    )
  }

  if (effect === 'storm') {
    return (
      <>
        <CloudLayer variant={mode === 'night' ? 'storm-night' : 'storm-day'} />
        <StormLayer />
        {windLayer}
        <MistLayer mode={mode} density="storm" />
      </>
    )
  }

  if (effect === 'snow') {
    return (
      <>
        <CloudLayer variant={mode === 'night' ? 'snow-night' : 'snow-day'} />
        <SnowLayer />
        {windLayer}
        <MistLayer mode={mode} density="snow" />
      </>
    )
  }

  if (effect === 'clouds') {
    return (
      <>
        <CloudLayer variant={mode === 'night' ? 'dense-night' : 'dense-day'} />
        {windLayer}
        <MistLayer mode={mode} density="light" />
      </>
    )
  }

  if (mode === 'night') {
    return (
      <>
        <StarLayer density={18} />
        {windLayer}
      </>
    )
  }

  return (
    <>
      <SparkleLayer density={8} tintColor="rgba(255,255,255,0.24)" />
      {windLayer}
    </>
  )
}

function SunLayer({ withClouds = false }) {
  const rotation = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const rotationLoop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      { resetBeforeIteration: true }
    )

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: true }
    )

    rotationLoop.start()
    pulseLoop.start()

    return () => {
      rotationLoop.stop()
      pulseLoop.stop()
    }
  }, [pulse, rotation])

  const rotateDeg = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1.06],
  })

  const rays = useMemo(() => Array.from({ length: 12 }).map((_, index) => index * 30), [])

  return (
    <View pointerEvents="none" style={styles.sunWrapper}>
      <Animated.View style={[styles.sunGlow, { transform: [{ scale: pulseScale }] }]} />
      <Animated.View style={[styles.sunCore, { transform: [{ scale: pulseScale }] }]} />
      <Animated.View style={[styles.sunRays, { transform: [{ rotate: rotateDeg }] }]}>
        {rays.map(angle => (
          <View key={`sun-ray-${angle}`} style={[styles.sunRay, { transform: [{ rotate: `${angle}deg` }] }]} />
        ))}
      </Animated.View>

      {withClouds && <SunCloudShadows />}
    </View>
  )
}

function SunCloudShadows() {
  const drift = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: true }
    )

    loop.start()
    return () => loop.stop()
  }, [drift])

  const translateX = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 12],
  })

  return (
    <Animated.View style={[styles.sunCloudGroup, { transform: [{ translateX }] }]}>
      <View style={styles.sunCloudBase} />
      <View style={[styles.sunCloudFluff, { width: 78, height: 78, top: -26, left: 20 }]} />
      <View style={[styles.sunCloudFluff, { width: 62, height: 62, top: -18, left: 70 }]} />
      <View style={[styles.sunCloudFluff, { width: 48, height: 48, top: -16, left: 0 }]} />
    </Animated.View>
  )
}

function MoonLayer({ withGlow = true }) {
  const bob = useRef(new Animated.Value(0)).current
  const glowPulse = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 5200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: true }
    )

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 6800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 6800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: true }
    )

    bobLoop.start()
    glowLoop.start()

    return () => {
      bobLoop.stop()
      glowLoop.stop()
    }
  }, [bob, glowPulse])

  const translateY = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  })

  const glowScale = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.06],
  })

  return (
    <Animated.View style={[styles.moonWrapper, { transform: [{ translateY }] }]}>
      {withGlow && <Animated.View style={[styles.moonGlow, { transform: [{ scale: glowScale }] }]} />}
      <View style={styles.moonCore}>
        <View style={[styles.moonCrater, { top: 40, left: 34, width: 24, height: 24 }]} />
        <View style={[styles.moonCrater, { top: 76, left: 72, width: 18, height: 18 }]} />
        <View style={[styles.moonCrater, { top: 96, left: 40, width: 16, height: 16 }]} />
        <View style={[styles.moonCrater, { top: 58, left: 100, width: 12, height: 12 }]} />
      </View>
    </Animated.View>
  )
}

function StarLayer({ density = 24 }) {
  const stars = useMemo(
    () =>
      Array.from({ length: density }).map(() => ({
        progress: new Animated.Value(Math.random()),
        duration: 3600 + Math.random() * 3200,
        delay: Math.random() * 1600,
        left: Math.random() * WINDOW_WIDTH,
        top: Math.random() * WINDOW_HEIGHT * 0.55,
        size: 1.2 + Math.random() * 1.8,
      })),
    [density]
  )

  useEffect(() => {
    const loops = stars.map(star => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(star.progress, {
            toValue: 1,
            duration: star.duration,
            delay: star.delay,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(star.progress, {
            toValue: 0,
            duration: star.duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      )

      loop.start()
      return loop
    })

    return () => loops.forEach(loop => loop.stop())
  }, [stars])

  return (
    <View pointerEvents="none" style={styles.effectOverlay}>
      {stars.map((star, index) => {
        const opacity = star.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.1, 0.85, 0.1],
        })

        const scale = star.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.7, 1.2, 0.7],
        })

        return (
          <Animated.View
            key={`star-${index}`}
            style={[
              styles.star,
              {
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity,
                transform: [{ scale }],
              },
            ]}
          />
        )
      })}
    </View>
  )
}

const WIND_STRENGTH_PRIORITY = {
  light: 1,
  medium: 2,
  heavy: 3,
}

function getWindStrength(speed) {
  if (!Number.isFinite(speed)) {
    return null
  }

  const magnitude = Math.abs(speed)
  if (magnitude >= 14) return 'heavy'
  if (magnitude >= 8) return 'medium'
  if (magnitude >= 4) return 'light'
  return null
}

function mergeWindStrength(base, overlay) {
  if (!base) return overlay ?? null
  if (!overlay) return base
  return WIND_STRENGTH_PRIORITY[overlay] > WIND_STRENGTH_PRIORITY[base] ? overlay : base
}

function WindLayer({ mode = 'day', strength = 'medium' }) {
  const streamCount = strength === 'light' ? 7 : strength === 'heavy' ? 14 : 9
  const baseColor = mode === 'night' ? 'rgba(192,214,255,0.52)' : 'rgba(255,255,255,0.6)'
  const trailColor = mode === 'night' ? 'rgba(192,214,255,0.2)' : 'rgba(255,255,255,0.24)'
  const fadeColor = mode === 'night' ? 'rgba(192,214,255,0)' : 'rgba(255,255,255,0)'

  const streams = useMemo(
    () =>
      Array.from({ length: streamCount }).map(() => ({
        progress: new Animated.Value(Math.random()),
        length: WINDOW_WIDTH * (0.36 + Math.random() * 0.32),
        top: WINDOW_HEIGHT * 0.22 + Math.random() * WINDOW_HEIGHT * 0.42,
        thickness: 2 + Math.random() * 2.4,
        curvature: (Math.random() * 2 - 1) * 18,
        opacityTarget: 0.2 + Math.random() * 0.3,
        delay: Math.random() * 2400,
        duration: 4200 + Math.random() * 2400,
      })),
    [streamCount]
  )

  useEffect(() => {
    const loops = streams.map(stream => {
      stream.progress.setValue(0)
      const animation = Animated.timing(stream.progress, {
        toValue: 1,
        duration: stream.duration,
        delay: stream.delay,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
      const loop = Animated.loop(animation, { resetBeforeIteration: true })
      loop.start()
      return loop
    })

    return () => loops.forEach(loop => loop.stop())
  }, [streams])

  return (
    <View pointerEvents="none" style={styles.effectOverlay}>
      {streams.map((stream, index) => {
        const translateX = stream.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-stream.length - 90, WINDOW_WIDTH + 90],
        })
        const translateY = stream.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, stream.curvature, 0],
        })
        const opacity = stream.progress.interpolate({
          inputRange: [0, 0.2, 0.7, 1],
          outputRange: [0, stream.opacityTarget, stream.opacityTarget * 0.6, 0],
        })

        return (
          <AnimatedLinearGradient
            key={`wind-${index}`}
            colors={[trailColor, baseColor, fadeColor]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[
              styles.windStream,
              {
                top: stream.top,
                height: stream.thickness,
                width: stream.length,
                opacity,
                transform: [{ translateX }, { translateY }],
              },
            ]}
          />
        )
      })}
    </View>
  )
}

function MistLayer({ mode, density = 'light' }) {
  const veil = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(veil, {
          toValue: 1,
          duration: 5400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(veil, {
          toValue: 0,
          duration: 5400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: true }
    )

    loop.start()
    return () => loop.stop()
  }, [veil])

  const opacityMap = {
    light: [0.18, 0.28],
    rain: [0.24, 0.38],
    snow: [0.22, 0.34],
    storm: [0.3, 0.45],
  }

  const [minOpacity, maxOpacity] = opacityMap[density] ?? [0.18, 0.3]

  const opacity = veil.interpolate({
    inputRange: [0, 1],
    outputRange: [minOpacity, maxOpacity],
  })

  const height = density === 'storm' ? 360 : density === 'rain' ? 320 : density === 'snow' ? 300 : 260

  const colors =
    mode === 'night'
      ? ['rgba(8,16,36,0)', 'rgba(36,54,92,0.42)', 'rgba(102,132,181,0.38)']
      : ['rgba(255,255,255,0)', 'rgba(214,233,255,0.4)', 'rgba(207,223,241,0.46)']

  return (
    <AnimatedLinearGradient
      pointerEvents="none"
      colors={colors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.mistLayer, { opacity, height }]}
    />
  )
}

function SparkleLayer({ density = 12, tintColor = 'rgba(255,255,255,0.9)' }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: density }).map(() => ({
        progress: new Animated.Value(0),
        delay: Math.random() * 2000,
        duration: 2600 + Math.random() * 2000,
        left: Math.random() * WINDOW_WIDTH,
        top: Math.random() * WINDOW_HEIGHT,
        size: 2 + Math.random() * 3,
        peakOpacity: 0.6 + Math.random() * 0.35,
      })),
    [density]
  )

  useEffect(() => {
    const loops = sparkles.map(sparkle => {
      sparkle.progress.setValue(0)
      const animation = Animated.timing(sparkle.progress, {
        toValue: 1,
        duration: sparkle.duration,
        delay: sparkle.delay,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
      const loop = Animated.loop(animation, { resetBeforeIteration: true })
      loop.start()
      return loop
    })

    return () => loops.forEach(loop => loop.stop())
  }, [sparkles])

  return (
    <View pointerEvents="none" style={styles.effectOverlay}>
      {sparkles.map((sparkle, index) => {
        const opacity = sparkle.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, sparkle.peakOpacity, 0],
        })
        const scale = sparkle.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.4, 1, 0.4],
        })

        return (
          <Animated.View
            key={`sparkle-${index}`}
            style={[
              styles.sparkle,
              {
                left: sparkle.left,
                top: sparkle.top,
                width: sparkle.size,
                height: sparkle.size,
                borderRadius: sparkle.size / 2,
                backgroundColor: tintColor,
                opacity,
                transform: [{ scale }],
              },
            ]}
          />
        )
      })}
    </View>
  )
}

function hexToRgba(color, alpha) {
  if (typeof color !== 'string') {
    return `rgba(255,255,255,${alpha})`
  }

  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const normalized = hex.length === 3 ? hex.split('').map(char => char + char).join('') : hex
    if (normalized.length !== 6) {
      return `rgba(255,255,255,${alpha})`
    }
    const bigint = parseInt(normalized, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r},${g},${b},${alpha})`
  }

  if (color.startsWith('rgb')) {
    return color
  }

  return `rgba(255,255,255,${alpha})`
}

function RainLayer({ intensity = 'moderate' }) {
  const dropCount = intensity === 'light' ? 18 : intensity === 'heavy' ? 40 : 28
  const drops = useMemo(
    () =>
      Array.from({ length: dropCount }).map(() => ({
        progress: new Animated.Value(0),
        delay: Math.random() * 2000,
        duration: 2200 + Math.random() * 1200,
        left: Math.random() * WINDOW_WIDTH,
        scale: 0.6 + Math.random() * 0.9,
        opacity: intensity === 'light' ? 0.24 + Math.random() * 0.25 : 0.35 + Math.random() * 0.35,
      })),
    [dropCount, intensity]
  )

  useEffect(() => {
    const loops = drops.map(drop => {
      drop.progress.setValue(0)
      const animation = Animated.timing(drop.progress, {
        toValue: 1,
        duration: drop.duration,
        delay: drop.delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
      const loop = Animated.loop(animation, { resetBeforeIteration: true })
      loop.start()
      return loop
    })

    return () => loops.forEach(loop => loop.stop())
  }, [drops])

  return (
    <View pointerEvents="none" style={styles.effectOverlay}>
      {drops.map((drop, index) => {
        const translateY = drop.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-WINDOW_HEIGHT, WINDOW_HEIGHT + 140],
        })

        return (
          <Animated.View
            key={`rain-${index}`}
            style={[
              styles.rainDrop,
              {
                left: drop.left,
                opacity: drop.opacity,
                transform: [{ translateY }, { scaleY: drop.scale }],
              },
            ]}
          />
        )
      })}
    </View>
  )
}

function StormLayer() {
  return (
    <>
      <RainLayer intensity="heavy" />
      <LightningFlash />
    </>
  )
}

function LightningFlash() {
  const flash = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(2200 + Math.random() * 2400),
        Animated.timing(flash, {
          toValue: 1,
          duration: 90,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(flash, {
          toValue: 0,
          duration: 260,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    )

    loop.start()
    return () => loop.stop()
  }, [flash])

  const flashOpacity = flash.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.55],
  })

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.lightningFlash, { opacity: flashOpacity }]}
    />
  )
}

function SnowLayer() {
  const flakeCount = 20
  const flakes = useMemo(
    () =>
      Array.from({ length: flakeCount }).map(() => ({
        progress: new Animated.Value(0),
        delay: Math.random() * 4000,
        duration: 9000 + Math.random() * 4000,
        left: Math.random() * WINDOW_WIDTH,
        size: 8 + Math.random() * 14,
        sway: (Math.random() * 2 - 1) * 30,
        opacity: 0.45 + Math.random() * 0.4,
      })),
    [flakeCount]
  )

  useEffect(() => {
    const loops = flakes.map(flake => {
      flake.progress.setValue(0)
      const animation = Animated.timing(flake.progress, {
        toValue: 1,
        duration: flake.duration,
        delay: flake.delay,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
      const loop = Animated.loop(animation, { resetBeforeIteration: true })
      loop.start()
      return loop
    })

    return () => loops.forEach(loop => loop.stop())
  }, [flakes])

  return (
    <View pointerEvents="none" style={styles.effectOverlay}>
      {flakes.map((flake, index) => {
        const translateY = flake.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-80, WINDOW_HEIGHT + 80],
        })

        const translateX = flake.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, flake.sway, 0],
        })

        return (
          <Animated.View
            key={`snow-${index}`}
            style={[
              styles.snowFlake,
              {
                width: flake.size,
                height: flake.size,
                borderRadius: flake.size / 2,
                left: flake.left,
                opacity: flake.opacity,
                transform: [{ translateY }, { translateX }],
              },
            ]}
          />
        )
      })}
    </View>
  )
}

function CloudLayer({ variant = 'default' }) {
  const config = useMemo(() => {
    switch (variant) {
      case 'soft':
        return {
          count: 2,
          sizeBase: 200,
          sizeVariance: 60,
          topStart: 110,
          spacing: 92,
          spacingJitter: 18,
          durationBase: 26000,
          durationVariance: 7000,
          opacityBase: 0.16,
          opacityRange: 0.08,
          startOffset: -160,
          color: 'rgba(255,255,255,0.36)',
        }
      case 'soft-night':
        return {
          count: 2,
          sizeBase: 200,
          sizeVariance: 60,
          topStart: 120,
          spacing: 92,
          spacingJitter: 18,
          durationBase: 32000,
          durationVariance: 8000,
          opacityBase: 0.14,
          opacityRange: 0.08,
          startOffset: -170,
          color: 'rgba(136,162,210,0.3)',
        }
      case 'dense-day':
        return {
          count: 4,
          sizeBase: 240,
          sizeVariance: 100,
          topStart: 80,
          spacing: 110,
          spacingJitter: 42,
          durationBase: 25000,
          durationVariance: 6000,
          opacityBase: 0.26,
          opacityRange: 0.14,
          startOffset: -210,
          color: 'rgba(255,255,255,0.4)',
        }
      case 'dense-night':
        return {
          count: 4,
          sizeBase: 240,
          sizeVariance: 110,
          topStart: 70,
          spacing: 110,
          spacingJitter: 38,
          durationBase: 29000,
          durationVariance: 7000,
          opacityBase: 0.26,
          opacityRange: 0.14,
          startOffset: -210,
          color: 'rgba(118,144,198,0.38)',
        }
      case 'storm-day':
        return {
          count: 5,
          sizeBase: 280,
          sizeVariance: 120,
          topStart: 42,
          spacing: 90,
          spacingJitter: 32,
          durationBase: 23000,
          durationVariance: 5000,
          opacityBase: 0.34,
          opacityRange: 0.18,
          startOffset: -240,
          color: 'rgba(96,112,142,0.52)',
        }
      case 'storm-night':
        return {
          count: 5,
          sizeBase: 280,
          sizeVariance: 120,
          topStart: 36,
          spacing: 90,
          spacingJitter: 30,
          durationBase: 26000,
          durationVariance: 6000,
          opacityBase: 0.34,
          opacityRange: 0.18,
          startOffset: -240,
          color: 'rgba(58,76,112,0.56)',
        }
      case 'snow-day':
        return {
          count: 4,
          sizeBase: 240,
          sizeVariance: 90,
          topStart: 80,
          spacing: 112,
          spacingJitter: 40,
          durationBase: 28000,
          durationVariance: 7000,
          opacityBase: 0.24,
          opacityRange: 0.12,
          startOffset: -210,
          color: 'rgba(232,242,255,0.44)',
        }
      case 'snow-night':
        return {
          count: 4,
          sizeBase: 240,
          sizeVariance: 90,
          topStart: 70,
          spacing: 112,
          spacingJitter: 36,
          durationBase: 32000,
          durationVariance: 7000,
          opacityBase: 0.22,
          opacityRange: 0.12,
          startOffset: -210,
          color: 'rgba(176,198,236,0.4)',
        }
      default:
        return {
          count: 3,
          sizeBase: 220,
          sizeVariance: 140,
          topStart: 60,
          spacing: 120,
          spacingJitter: 40,
          durationBase: 28000,
          durationVariance: 9000,
          opacityBase: 0.18,
          opacityRange: 0.12,
          startOffset: -200,
          color: 'rgba(255,255,255,0.32)',
        }
    }
  }, [variant])

  const cloudCount = config.count
  const clouds = useMemo(
    () =>
      Array.from({ length: cloudCount }).map((_, index) => ({
        progress: new Animated.Value(0),
        delay: Math.random() * 2000,
        duration: config.durationBase + Math.random() * config.durationVariance,
        size: config.sizeBase + Math.random() * config.sizeVariance,
        top: config.topStart + index * config.spacing + Math.random() * config.spacingJitter,
        opacity: config.opacityBase + Math.random() * config.opacityRange,
      })),
    [cloudCount, config]
  )

  useEffect(() => {
    const loops = clouds.map(cloud => {
      cloud.progress.setValue(0)
      const animation = Animated.timing(cloud.progress, {
        toValue: 1,
        duration: cloud.duration,
        delay: cloud.delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
      const loop = Animated.loop(animation, { resetBeforeIteration: true })
      loop.start()
      return loop
    })

    return () => loops.forEach(loop => loop.stop())
  }, [clouds])

  return (
    <View pointerEvents="none" style={styles.effectOverlay}>
      {clouds.map((cloud, index) => {
        const translateX = cloud.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-cloud.size, WINDOW_WIDTH + cloud.size],
        })

        return (
          <Animated.View
            key={`cloud-${index}`}
            style={[
              styles.cloud,
              {
                width: cloud.size,
                height: cloud.size * 0.6,
                top: cloud.top,
                opacity: cloud.opacity,
                borderRadius: cloud.size * 0.4,
                backgroundColor: config.color,
                left: config.startOffset,
                transform: [{ translateX }],
              },
            ]}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  effectOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  horizonGlow: {
    position: 'absolute',
    left: -80,
    right: -80,
    bottom: -40,
    height: 320,
  },
  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 180,
  },
  blobTop: {
    top: -90,
    right: -70,
  },
  blobBottom: {
    bottom: -100,
    left: -60,
  },
  shimmer: {
    position: 'absolute',
    width: '140%',
    height: 320,
    top: '28%',
    left: '-20%',
    borderRadius: 60,
  },
  mistLayer: {
    position: 'absolute',
    left: -80,
    right: -80,
    bottom: -20,
    borderRadius: 0,
  },
  rainDrop: {
    position: 'absolute',
    top: -140,
    width: 2,
    height: 140,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  snowFlake: {
    position: 'absolute',
    top: -80,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  lightningFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  windStream: {
    position: 'absolute',
    borderRadius: 999,
  },
  sparkle: {
    position: 'absolute',
  },
  sunWrapper: {
    position: 'absolute',
    top: -50,
    right: -20,
    width: 340,
    height: 340,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,214,102,0.28)',
  },
  sunCore: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#FFE37B',
    shadowColor: '#FFD55A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 28,
    elevation: 12,
  },
  sunRays: {
    position: 'absolute',
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunRay: {
    position: 'absolute',
    top: 116,
    left: 150,
    width: 14,
    height: 104,
    borderRadius: 9,
    backgroundColor: 'rgba(255,210,120,0.68)',
  },
  sunCloudGroup: {
    position: 'absolute',
    bottom: 54,
    right: 120,
    width: 210,
    height: 96,
  },
  sunCloudBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 52,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  sunCloudFluff: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 999,
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6,
  },
  moonWrapper: {
    position: 'absolute',
    top: -24,
    right: -10,
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(108,134,210,0.32)',
  },
  moonCore: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F5F8FF',
    shadowColor: '#7086C6',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 10,
  },
  moonCrater: {
    position: 'absolute',
    backgroundColor: 'rgba(169,186,220,0.55)',
    borderRadius: 999,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
  },
})
