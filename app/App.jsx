import React from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { WeatherScreen } from './screens/WeatherScreen'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <WeatherScreen />
      </View>
    </SafeAreaProvider>
  )
}
