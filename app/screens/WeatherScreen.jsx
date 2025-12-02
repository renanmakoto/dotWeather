import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import useWeather from '../hooks/useWeather'
import {
  getDefaultPresentation,
  getWeatherPresentation,
} from '../../lib/weatherPresentation'
import AnimatedBackground from '../components/AnimatedBackground'

const LAYOUT = {
  SCROLL_PADDING_TOP: 16,
  SCROLL_PADDING_BOTTOM: 32,
  FOOTER_PADDING_BOTTOM: 6,
}

const COPY = {
  LOADING: 'Fetching latest weather',
  EMPTY_HEADLINE: 'Track any city in seconds.',
  EMPTY_BODY: 'Search above to reveal temperature trends and insights tailored to your next destination.',
  FOOTER: '2025 · dotExtension',
  AD_LABEL: 'Ad space available',
  AD_COPY: 'Reserve this spot for promotions, partners, or local travel tips.',
}

const SHOW_AD_SLOT = false

function LoadingIndicator() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingDot} />
      <Text style={styles.loadingText}>{COPY.LOADING}</Text>
    </View>
  )
}

function ErrorMessage({ message }) {
  return (
    <View style={styles.errorPill}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  )
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyHeadline}>{COPY.EMPTY_HEADLINE}</Text>
      <Text style={styles.emptyCopy}>{COPY.EMPTY_BODY}</Text>
    </View>
  )
}

function Footer({ bottomInset }) {
  return (
    <View style={[styles.footer, { paddingBottom: bottomInset + LAYOUT.FOOTER_PADDING_BOTTOM }]}>
      <View style={styles.footerBadge}>
        <Text style={styles.footerText}>{COPY.FOOTER}</Text>
      </View>
    </View>
  )
}

function AdSlot() {
  if (!SHOW_AD_SLOT) return null

  return (
    <View style={styles.adContainer}>
      <Text style={styles.adLabel}>{COPY.AD_LABEL}</Text>
      <Text style={styles.adCopy}>{COPY.AD_COPY}</Text>
    </View>
  )
}

export default function WeatherScreen() {
  const { weatherData, fetchWeather, loading, error } = useWeather()
  const [presentation, setPresentation] = useState(getDefaultPresentation())
  const insets = useSafeAreaInsets()

  const handleSearch = useCallback(
    (city) => fetchWeather(city),
    [fetchWeather]
  )

  useEffect(() => {
    if (weatherData?.current) {
      const { weatherCode, time, sunrise, sunset } = weatherData.current
      setPresentation(getWeatherPresentation(weatherCode, time, { sunrise, sunset }))
    } else {
      setPresentation(getDefaultPresentation())
    }
  }, [weatherData])

  const scrollContentStyle = [
    styles.scrollContent,
    {
      paddingTop: insets.top + LAYOUT.SCROLL_PADDING_TOP,
      paddingBottom: insets.bottom + LAYOUT.SCROLL_PADDING_BOTTOM,
    },
  ]

  const showEmptyState = !loading && !error && !weatherData
  const showWeatherCard = weatherData && !loading && !error

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <AnimatedBackground
        colors={presentation.gradient}
        effect={presentation.effect}
        accentColor={presentation.accent}
        mode={presentation.mode}
        windSpeed={weatherData?.current?.windSpeed ?? 0}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={scrollContentStyle}
              keyboardShouldPersistTaps="handled"
            >
              <SearchBar
                onSearch={handleSearch}
                accentColor={presentation.accent}
                loading={loading}
              />

              {error && <ErrorMessage message={error} />}
              {loading && <LoadingIndicator />}
              {showEmptyState && <EmptyState />}
              {showWeatherCard && (
                <WeatherCard weatherData={weatherData} presentation={presentation} />
              )}

              <AdSlot />
            </ScrollView>
          </KeyboardAvoidingView>

          <Footer bottomInset={insets.bottom} />
        </SafeAreaView>
      </AnimatedBackground>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
  },
  errorPill: {
    backgroundColor: 'rgba(255,99,71,0.22)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorText: {
    color: '#ffecec',
    fontSize: 15,
  },
  emptyState: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  emptyHeadline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyCopy: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.84)',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBadge: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.32)',
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  footerText: {
    color: 'rgba(230,240,255,0.92)',
    fontSize: 14,
  },
  adContainer: {
    backgroundColor: 'rgba(0,173,162,0.16)',
    borderRadius: 18,
    padding: 20,
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,173,162,0.32)',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  adCopy: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
  },
})
