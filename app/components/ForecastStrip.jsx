import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { formatHourLabel } from '../../lib/weatherPresentation'
import { LinearGradient } from 'expo-linear-gradient'

export default function ForecastStrip({ items = [], accentColor = '#ffffff' }) {
  if (!items.length) return null

  const highlightTop = toRgba(accentColor, 0.35)

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map(item => (
        <View key={item.id} style={styles.card}>
          <LinearGradient
            colors={[highlightTop, 'rgba(255,255,255,0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.cardHighlight}
          />
          <Text style={styles.time}>{formatHourLabel(item.time)}</Text>
          <Text style={styles.temperature}>
            {typeof item.temperature === 'number' ? `${item.temperature}°` : '--'}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="water-outline" size={14} color="rgba(255,255,255,0.72)" />
            <Text style={styles.metaText}>
              {typeof item.humidity === 'number' ? `${item.humidity}%` : '--'}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {
    gap: 12,
    paddingHorizontal: 4,
  },
  card: {
    width: 110,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    gap: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  temperature: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
  },
})

function toRgba(color, alpha) {
  if (typeof color !== 'string') {
    return `rgba(255,255,255,${alpha})`
  }

  if (color.startsWith('#')) {
    const hex = color.slice(1)
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
    const values = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map(part => part.trim())
      .slice(0, 3)
    if (values.length < 3) {
      return `rgba(255,255,255,${alpha})`
    }
    return `rgba(${values.join(',')},${alpha})`
  }

  return `rgba(255,255,255,${alpha})`
}
