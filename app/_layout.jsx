import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar, View } from 'react-native'

export default function Layout() {
  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="black" />
      <Stack
        screenOptions={{
          headerTitle: 'dotWeather',
          headerTitleAlign: 'center',
          headerTintColor: '#00ADA2',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            color: '#00ADA2',
            fontWeight: 'bold',
          },
          headerTransparent: true,
          headerBackground: () => (
            <View style={{ backgroundColor: 'white', height: 80, paddingTop: StatusBar.currentHeight }} />
          ),
          headerStatusBarHeight: 0,
        }}
      />
    </>
  )
}
