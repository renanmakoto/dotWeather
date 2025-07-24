import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar, View, Text } from 'react-native'

export default function Layout() {
  return (
    <>
      {/* Set status bar icons to dark so they are visible on white background */}
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitle: '',
          header: () => (
            <View
              style={{
                backgroundColor: 'white',
                height: 140,
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#00ADA2',
                }}
              >
                dotWeather
              </Text>
            </View>
          ),
        }}
      />
    </>
  )
}
