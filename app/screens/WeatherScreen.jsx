import React, { useState, useEffect } from 'react'
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

export default function WeatherScreen() {
  const { weatherData, fetchWeather, loading, error } = useWeather()
  const [presentation, setPresentation] = useState(getDefaultPresentation())
  const insets = useSafeAreaInsets()
  const showAdSlot = false

  const handleSearch = city => fetchWeather(city)

  useEffect(() => {
    if (weatherData?.current) {
      const { weatherCode, time, sunrise, sunset } = weatherData.current
      setPresentation(getWeatherPresentation(weatherCode, time, { sunrise, sunset }))
    } else {
      setPresentation(getDefaultPresentation())
    }
  }, [weatherData])

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
              contentContainerStyle={[
                styles.scrollContent,
                { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
              ]}
            >
              <SearchBar
                onSearch={handleSearch}
                accentColor={presentation.accent}
                loading={loading}
              />

              {error && (
                <View style={styles.errorPill}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {loading && (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingDot} />
                  <Text style={styles.loadingText}>Fetching latest weather</Text>
                </View>
              )}

              {!loading && !error && !weatherData && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyHeadline}>Track any city in seconds.</Text>
                  <Text style={styles.emptyCopy}>
                    Search above to reveal temperature trends and insights tailored to your next
                    destination.
                  </Text>
                </View>
              )}

              {weatherData && !loading && !error && (
                <WeatherCard weatherData={weatherData} presentation={presentation} />
              )}

              {showAdSlot && (
                <View style={styles.adContainer}>
                  <Text style={styles.adLabel}>Ad space available</Text>
                  <Text style={styles.adCopy}>
                    Reserve this spot for promotions, partners, or local travel tips.
                  </Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + 6 }]}>
            <View style={styles.footerBadge}>
              <Text style={styles.footerText}>2025 · dotExtension</Text>
            </View>
          </View>
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
