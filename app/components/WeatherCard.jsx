import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import ForecastStrip from './ForecastStrip'
import { formatObservedAt } from '../../lib/weatherPresentation'

const COLORS = {
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: 'rgba(255,255,255,0.74)',
  TEXT_MUTED: 'rgba(255,255,255,0.72)',
  CHIP_BG: 'rgba(255,255,255,0.16)',
  ICON_BUBBLE_BG: 'rgba(255,255,255,0.18)',
}

const DEFAULTS = {
  ACCENT: '#00ADA2',
  ICON: 'partly-sunny-outline',
  CARD_GRADIENT: ['rgba(255,255,255,0.9)', 'rgba(0,173,162,0.18)'],
}

const EFFECTS_WITHOUT_ICON = ['clear', 'breeze']
const FORECAST_DISPLAY_COUNT = 6
const PLACEHOLDER = '--'

function formatValue(value, suffix = '', roundValue = true) {
  if (typeof value !== 'number') return PLACEHOLDER
  const formatted = roundValue ? Math.round(value) : value.toFixed(1).replace(/\.0$/, '')
  return `${formatted}${suffix}`
}

function createForecastItems(hourly) {
  if (!hourly?.time?.length) return []

  return hourly.time.slice(0, FORECAST_DISPLAY_COUNT).map((time, index) => ({
    id: `${time}-${index}`,
    time,
    temperature: typeof hourly.temperature?.[index] === 'number'
      ? Math.round(hourly.temperature[index])
      : null,
    humidity: typeof hourly.humidity?.[index] === 'number'
      ? Math.round(hourly.humidity[index])
      : null,
  }))
}

function MetricChip({ icon, label, value }) {
  return (
    <View style={styles.metricChip} accessibilityLabel={`${label}: ${value}`}>
      <Ionicons name={icon} size={16} color={COLORS.TEXT_PRIMARY} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  )
}

function CardHeader({ location, iconName, showIcon }) {
  return (
    <View style={[styles.cardHeader, !showIcon && styles.cardHeaderCompact]}>
      <View style={styles.locationBlock}>
        <Text style={styles.locationCity}>{location.city}</Text>
        <Text style={styles.locationCountry}>{location.country}</Text>
      </View>

      {showIcon && (
        <View style={styles.iconBubble}>
          <Ionicons name={iconName} size={48} color={COLORS.TEXT_PRIMARY} />
        </View>
      )}
    </View>
  )
}

function TemperatureDisplay({ temperature, windSpeed, condition, accentColor }) {
  return (
    <View style={styles.temperatureRow}>
      <Text style={styles.temperature}>
        {formatValue(temperature, '°')}
      </Text>
      <View style={styles.temperatureDetails}>
        <Text style={[styles.condition, { color: accentColor }]}>{condition}</Text>
        <Text style={styles.wind}>Wind · {formatValue(windSpeed, ' m/s', false)}</Text>
      </View>
    </View>
  )
}

function MetricsRow({ windSpeed, humidity, nextHourTemp }) {
  return (
    <View style={styles.metricsRow}>
      <MetricChip
        icon="leaf-outline"
        label="Wind"
        value={formatValue(windSpeed, ' m/s', false)}
      />
      {humidity !== null && (
        <MetricChip icon="water-outline" label="Humidity" value={`${humidity}%`} />
      )}
      {nextHourTemp !== null && (
        <MetricChip icon="time-outline" label="Next hour" value={`${nextHourTemp}°`} />
      )}
    </View>
  )
}

export default function WeatherCard({ weatherData, presentation }) {
  if (!weatherData) return null

  const { location, current, hourly } = weatherData

  const accent = presentation?.accent ?? DEFAULTS.ACCENT
  const iconName = presentation?.icon ?? DEFAULTS.ICON
  const cardGradient = presentation?.cardGradient ?? DEFAULTS.CARD_GRADIENT
  const showIcon = !EFFECTS_WITHOUT_ICON.includes(presentation?.effect)

  const humidityNow = typeof hourly?.humidity?.[0] === 'number'
    ? Math.round(hourly.humidity[0])
    : null
  const nextHourTemp = typeof hourly?.temperature?.[1] === 'number'
    ? Math.round(hourly.temperature[1])
    : null

  const forecastItems = useMemo(
    () => createForecastItems(hourly),
    [hourly]
  )

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={cardGradient} style={styles.card}>
        <CardHeader
          location={location}
          iconName={iconName}
          showIcon={showIcon}
        />

        <Text style={styles.observedAt}>
          {formatObservedAt(current.time)}
        </Text>

        <TemperatureDisplay
          temperature={current?.temperature}
          windSpeed={current?.windSpeed}
          condition={presentation?.label}
          accentColor={accent}
        />

        <MetricsRow
          windSpeed={current?.windSpeed}
          humidity={humidityNow}
          nextHourTemp={nextHourTemp}
        />
      </LinearGradient>

      <View style={styles.forecastSection}>
        <Text style={styles.sectionTitle}>Hourly outlook</Text>
        <ForecastStrip items={forecastItems} accentColor={accent} />
      </View>
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
