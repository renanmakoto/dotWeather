import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
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

  return (
    <View style={styles.container}>
      <Text style={styles.location}>
        {city}, {country}
      </Text>
      <Ionicons
        name={weatherCodeToIcon(current.weatherCode)}
        size={100}
        color="#fff"
        style={styles.icon}
      />
      <Text style={styles.currentTemp}>{current.temperature}°C</Text>
      <Text style={styles.currentDetails}>
        Wind Speed: {current.windSpeed} m/s
      </Text>
      <Text style={styles.sectionTitle}>Next 5 Hours</Text>
      <FlatList
        data={hourly.time}
        keyExtractor={item => item}
        horizontal
        renderItem={({ item, index }) => (
          <View style={styles.hourlyItem}>
            <Text style={styles.hourlyTime}>
              {new Date(item).getHours()}:00
            </Text>
            <Ionicons
              name="thermometer"
              size={24}
              color="#fff"
              style={styles.hourlyIcon}
            />
            <Text style={styles.hourlyTemp}>
              {hourly.temperature[index]}°C
            </Text>
            <Ionicons
              name="water"
              size={24}
              color="#fff"
              style={styles.hourlyIcon}
            />
            <Text style={styles.hourlyHumidity}>
              {hourly.humidity[index]}%
            </Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        style={styles.hourlyList}
      />
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
  hourlyList: {
    width: '100%',
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 10,
  },
  hourlyTime: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  hourlyIcon: {
    marginVertical: 2,
  },
  hourlyTemp: {
    fontSize: 16,
    color: '#fff',
  },
  hourlyHumidity: {
    fontSize: 16,
    color: '#fff',
  },
})
