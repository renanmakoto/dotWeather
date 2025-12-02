import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { formatHourLabel } from '../../lib/weatherPresentation'
import { toRgba } from '../../lib/colorUtils'

const COLORS = {
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: 'rgba(255,255,255,0.78)',
  ICON: 'rgba(255,255,255,0.72)',
  CARD_BG: 'rgba(255,255,255,0.12)',
  CARD_BORDER: 'rgba(255,255,255,0.18)',
  GRADIENT_END: 'rgba(255,255,255,0)',
}

const HIGHLIGHT_OPACITY = 0.35
const DEFAULT_ACCENT = '#ffffff'

function ForecastCard({ item, highlightColor }) {
  const temperature = typeof item.temperature === 'number' ? `${item.temperature}°` : '--'
  const humidity = typeof item.humidity === 'number' ? `${item.humidity}%` : '--'

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[highlightColor, COLORS.GRADIENT_END]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.cardHighlight}
      />

      <Text style={styles.time}>{formatHourLabel(item.time)}</Text>
      <Text style={styles.temperature}>{temperature}</Text>

      <View style={styles.metaRow}>
        <Ionicons name="water-outline" size={14} color={COLORS.ICON} />
        <Text style={styles.metaText}>{humidity}</Text>
      </View>
    </View>
  )
}

export default function ForecastStrip({ items = [], accentColor = DEFAULT_ACCENT }) {
  if (!items.length) return null

  const highlightColor = toRgba(accentColor, HIGHLIGHT_OPACITY)

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((item) => (
        <ForecastCard
          key={item.id}
          item={item}
          highlightColor={highlightColor}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  card: {
    width: 110,
    padding: 16,
    borderRadius: 20,
    backgroundColor: COLORS.CARD_BG,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
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
    color: COLORS.TEXT_PRIMARY,
  },
  temperature: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
})
