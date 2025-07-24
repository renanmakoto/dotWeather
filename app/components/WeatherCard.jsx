import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const weatherCodeToIcon = code => {
  if (code < 0) return 'cloud-outline'
  if (code >= 0 && code < 15) return 'partly-sunny'
  if (code >= 15 && code < 25) return 'sunny'
  if (code >= 25) return 'thermometer'
  return 'cloud-outline'
}

export default function WeatherCard({ weatherData }) {
  if (!weatherData) return null

  const {
    location: { city, country },
    current,
    hourly,
  } = weatherData

  const weatherIcon = weatherCodeToIcon(current.weatherCode)

  return (
    <View style={styles.container}>
      <Text style={styles.location}>
        {city}, {country}
      </Text>
      <Ionicons
        name={weatherIcon}
        size={100}
        color="#fff"
        style={styles.icon}
      />
      <Text style={styles.currentTemp}>{current.temperature}°C</Text>
      <Text style={styles.currentDetails}>
        Wind Speed: {current.windSpeed} m/s
      </Text>
      <Text style={styles.sectionTitle}>Next 5 Hours</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {hourly.time.slice(0, 5).map((time, index) => (
          <View style={styles.hourlyItem} key={index}>
            <Text style={styles.hourlyTime}>
              {new Date(time).getHours()}:00
            </Text>
            <Ionicons name="thermometer" size={20} color="#fff" />
            <Text style={styles.hourlyTemp}>
              {hourly.temperature[index]}°C
            </Text>
            <Ionicons name="water" size={20} color="#fff" />
            <Text style={styles.hourlyHumidity}>
              {hourly.humidity[index]}%
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 20,
  },
  location: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
    marginVertical: 10,
  },
  currentTemp: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  currentDetails: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  hourlyItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 8,
    width: 64,
    marginRight: 10,
  },
  hourlyTime: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  hourlyTemp: {
    fontSize: 14,
    color: '#fff',
  },
  hourlyHumidity: {
    fontSize: 14,
    color: '#fff',
  },
})
