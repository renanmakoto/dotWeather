import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import useWeather from '../hooks/useWeather'
import { SafeAreaView } from 'react-native-safe-area-context'

const getBackgroundColors = (condition, temperature) => {
  if (temperature >= 25) return ['#FF7300', '#FEF253']
  if (temperature < 15) return ['#00C6FB', '#005BEA']
  return ['#4facfe', '#00f2fe']
}

export default function WeatherScreen() {
  const { weatherData, fetchWeather, loading, error } = useWeather()
  const [showWeather, setShowWeather] = useState(false)
  const [backgroundColors, setBackgroundColors] = useState(['#4facfe', '#00f2fe'])

  const handleSearch = city => {
    fetchWeather(city)
    setShowWeather(true)
    const temperature = weatherData?.current?.temperature || 20
    setBackgroundColors(getBackgroundColors(null, temperature))
  }

  const handleBack = () => {
    setShowWeather(false)
    setBackgroundColors(['#4facfe', '#00f2fe'])
  }

  useEffect(() => {
    if (weatherData) {
      const temperature = weatherData?.current?.temperature || 20
      setBackgroundColors(getBackgroundColors(null, temperature))
    }
  }, [weatherData])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={{ flex: 1, marginTop: 10 }}>
            <LinearGradient colors={backgroundColors} style={styles.container}>
              <SearchBar onSearch={handleSearch} />
              {loading && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              )}
              {error && <Text style={styles.errorText}>{error}</Text>}
              {showWeather && weatherData && !loading && !error && (
                <>
                  <WeatherCard weatherData={weatherData} />
                  <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back to Home</Text>
                  </TouchableOpacity>
                </>
              )}
            </LinearGradient>
          </View>
          {/* Footer stays fixed at bottom regardless of keyboard */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>2025 - by dotExtension</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  loadingContainer: { marginTop: 50 },
  loadingText: { fontSize: 18, color: '#fff' },
  errorText: {
    marginTop: 20,
    fontSize: 18,
    color: '#ff3333',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 5, // fixed at bottom of screen
  },
  footerText: { fontSize: 16, color: '#fff' },
  backButton: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: { color: '#fff', fontSize: 16 },
})
