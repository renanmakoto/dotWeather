import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
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
  const items = hourly.time.slice(0,5).map((t, i) => ({
    time: new Date(t).getHours(),
    temp: hourly.temperature[i],
    hum: hourly.humidity[i],
  }))

  return (
    <View style={styles.container}>
      <Text style={styles.location}>{city}, {country}</Text>
      <Ionicons name={weatherIcon} size={100} color="#fff" style={styles.icon} />
      <Text style={styles.currentTemp}>{current.temperature}°C</Text>
      <Text style={styles.currentDetails}>Wind Speed: {current.windSpeed} m/s</Text>

      <Text style={styles.sectionTitle}>Next 5 Hours</Text>
      <View style={styles.list}>
        {items.map((it, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.time}>{it.time}:00</Text>
            <View style={styles.meta}>
              <Ionicons name="thermometer" size={16} color="#fff" />
              <Text style={styles.metaText}>{it.temp}°C</Text>
            </View>
            <View style={styles.meta}>
              <Ionicons name="water" size={16} color="#fff" />
              <Text style={styles.metaText}>{it.hum}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 20,
  },
  location: { 
    fontSize: 28, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  icon: { 
    marginVertical: 10 
  },
  currentTemp: { 
    fontSize: 48, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  currentDetails: { 
    fontSize: 18, color: '#fff', marginVertical: 5 },

  sectionTitle: { fontSize: 18, color: '#fff', fontWeight: '600', marginTop: 16, marginBottom: 8, alignSelf: 'flex-start' },

  list: { width: '100%', gap: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 16,
  },
  time: { width: 60, fontSize: 14, color: '#fff', fontWeight: '600' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 14, color: '#fff' },
})
