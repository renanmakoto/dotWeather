import React from 'react'
import { View, StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import useWeather from '../hooks/useWeather'

const getBackgroundColors = (condition, temperature) => {
  if (temperature >= 15 && temperature < 25) {
    return ['#4facfe', '#00f2fe']
  }
  switch (condition) {
    case 'rain':
      return ['#00C6FB', '#005BEA']
    case 'cloudy':
      return ['#D7D2CC', '#304352']
    case 'partly-cloudy':
      return ['#EFEFBB', '#D4D3DD']
    case 'snowflake':
      return ['#83a4d4', '#b6fbff']
    case 'sun':
    default:
      return temperature < 15
        ? ['#00C6FB', '#005BEA']
        : ['#FF7300', '#FEF253']
  }
}

export default function WeatherScreen() {
  const { weatherData, fetchWeather, loading, error } = useWeather()

  const handleSearch = city => {
    fetchWeather(city)
  }

  const temperature = weatherData?.current?.temperature || 20
  const weatherCondition = weatherData?.current?.condition || 'sun'

  const backgroundColors = getBackgroundColors(weatherCondition, temperature)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={backgroundColors} style={styles.container}>
        <SearchBar onSearch={handleSearch} />
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {weatherData && !loading && !error && (
          <WeatherCard weatherData={weatherData} />
        )}
        <View style={styles.footer}>
          <Text style={styles.footerText}>2024 - by dotExtension</Text>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
  },
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
  },
  footerText: {
    fontSize: 16,
    color: '#ffffff',
  },
})
