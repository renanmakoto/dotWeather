import React, { useState, useCallback } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const COLORS = {
  ICON: 'rgba(255,255,255,0.72)',
  PLACEHOLDER: 'rgba(255,255,255,0.66)',
  INPUT_TEXT: '#ffffff',
  BUTTON_ICON: '#1d1d1f',
  CONTAINER_BG: 'rgba(255,255,255,0.18)',
}

const DEFAULT_ACCENT_COLOR = '#ffe082'
const DISABLED_OPACITY = 0.6

export default function SearchBar({
  onSearch,
  accentColor = DEFAULT_ACCENT_COLOR,
  loading = false,
}) {
  const [city, setCity] = useState('')

  const handleSearch = useCallback(() => {
    const trimmedCity = city.trim()
    if (trimmedCity) {
      onSearch(trimmedCity)
      setCity('')
    }
  }, [city, onSearch])

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: accentColor,
      opacity: loading ? DISABLED_OPACITY : 1,
    },
  ]

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={22} color={COLORS.ICON} />

      <TextInput
        style={styles.input}
        placeholder="Search city or region"
        placeholderTextColor={COLORS.PLACEHOLDER}
        value={city}
        onChangeText={setCity}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="words"
        selectionColor={accentColor}
      />

      <TouchableOpacity
        onPress={handleSearch}
        disabled={loading}
        style={buttonStyle}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Search"
      >
        <Ionicons name="arrow-forward" size={20} color={COLORS.BUTTON_ICON} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CONTAINER_BG,
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 12,
    width: '100%',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.INPUT_TEXT,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
