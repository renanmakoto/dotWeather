import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function SearchBar({ onSearch, accentColor = '#ffe082', loading = false }) {
  const [city, setCity] = useState('')

  const handleSearch = () => {
    const trimmed = city.trim()
    if (trimmed) {
      onSearch(trimmed)
      setCity('')
    }
  }

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={22} color="rgba(255,255,255,0.72)" />
      <TextInput
        style={styles.input}
        placeholder="Search city or region"
        placeholderTextColor="rgba(255,255,255,0.66)"
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
        style={[
          styles.button,
          {
            backgroundColor: accentColor,
            opacity: loading ? 0.6 : 1,
          },
        ]}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-forward" size={20} color="#1d1d1f" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 12,
    width: '100%',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
