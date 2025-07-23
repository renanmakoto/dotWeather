import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar, View, Platform } from 'react-native'

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
            height: 100,
          },
          headerTitleStyle: {
            color: '#00ADA2',
            fontWeight: 'bold',
          },
          headerTransparent: true,
          headerBackground: () => (
            <View
              style={{
                backgroundColor: 'white',
                height: 100,
                paddingTop: Platform.OS === 'android' ? 40 : 20,
              }}
            />
          ),
          headerStatusBarHeight: 0,
        }}
      />
    </>
  )
}
