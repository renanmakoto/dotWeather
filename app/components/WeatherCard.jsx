import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import ForecastStrip from './ForecastStrip'
import { formatObservedAt } from '../../lib/weatherPresentation'

export default function WeatherCard({ weatherData, presentation }) {
  if (!weatherData) return null

  const { location, current, hourly } = weatherData
  const accent = presentation?.accent ?? '#00ADA2'
  const iconName = presentation?.icon ?? 'partly-sunny-outline'
  const cardGradient =
    presentation?.cardGradient ?? ['rgba(255,255,255,0.9)', 'rgba(0,173,162,0.18)']
  const hideIcon = ['clear', 'breeze'].includes(presentation?.effect)
  const showIconBubble = !hideIcon

  const currentTemp =
    typeof current?.temperature === 'number' ? Math.round(current.temperature) : null
  const windSpeed =
    typeof current?.windSpeed === 'number' ? current.windSpeed.toFixed(1).replace(/\.0$/, '') : null
  const humidityNow =
    typeof hourly?.humidity?.[0] === 'number' ? Math.round(hourly.humidity[0]) : null
  const nextHourTemp =
    typeof hourly?.temperature?.[1] === 'number' ? Math.round(hourly.temperature[1]) : null

  const forecastItems = useMemo(() => {
    if (!hourly?.time?.length) return []
    return hourly.time.slice(0, 6).map((time, index) => ({
      id: `${time}-${index}`,
      time,
      temperature:
        typeof hourly.temperature?.[index] === 'number'
          ? Math.round(hourly.temperature[index])
          : null,
      humidity:
        typeof hourly.humidity?.[index] === 'number'
          ? Math.round(hourly.humidity[index])
          : null,
    }))
  }, [hourly])

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={cardGradient} style={styles.card}>
        <View style={[styles.cardHeader, hideIcon && styles.cardHeaderCompact]}>
          <View style={styles.locationBlock}>
            <Text style={styles.locationCity}>{location.city}</Text>
            <Text style={styles.locationCountry}>{location.country}</Text>
          </View>
          {showIconBubble && (
            <View style={styles.iconBubble}>
              <Ionicons name={iconName} size={48} color="#ffffff" />
            </View>
          )}
        </View>

        <Text style={styles.observedAt}>{formatObservedAt(current.time)}</Text>

        <View style={styles.temperatureRow}>
          <Text style={styles.temperature}>
            {currentTemp !== null ? `${currentTemp}°` : '--'}
          </Text>
          <View style={styles.temperatureDetails}>
            <Text style={[styles.condition, { color: accent }]}>{presentation?.label}</Text>
            <Text style={styles.wind}>
              Wind · {windSpeed !== null ? `${windSpeed} m/s` : '--'}
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <MetricChip
            icon="leaf-outline"
            label="Wind"
            value={windSpeed !== null ? `${windSpeed} m/s` : '--'}
          />
          {humidityNow !== null && (
            <MetricChip icon="water-outline" label="Humidity" value={`${humidityNow}%`} />
          )}
          {nextHourTemp !== null && (
            <MetricChip icon="time-outline" label="Next hour" value={`${nextHourTemp}°`} />
          )}
        </View>
      </LinearGradient>

      <View style={styles.forecastSection}>
        <Text style={styles.sectionTitle}>Hourly outlook</Text>
        <ForecastStrip items={forecastItems} accentColor={accent} />
      </View>
    </View>
  )
}

function MetricChip({ icon, label, value }) {
  return (
    <View style={styles.metricChip}>
      <Ionicons name={icon} size={16} color="#ffffff" />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 18,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    gap: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderCompact: {
    justifyContent: 'flex-start',
  },
  locationBlock: {
    gap: 2,
  },
  locationCity: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  locationCountry: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.74)',
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  observedAt: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  temperature: {
    fontSize: 72,
    fontWeight: '700',
    color: '#ffffff',
  },
  temperatureDetails: {
    alignItems: 'flex-end',
    gap: 4,
  },
  condition: {
    fontSize: 18,
    fontWeight: '600',
  },
  wind: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.72)',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metricValue: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  forecastSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
})
