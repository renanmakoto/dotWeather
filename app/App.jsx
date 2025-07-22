import React from 'react'
import { View, StatusBar } from 'react-native'
import { WeatherScreen } from './screens/WeatherScreen'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <WeatherScreen />
      </View>
    </SafeAreaProvider>
  )
}
