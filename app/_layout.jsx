import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar, View, Text } from 'react-native'

export default function Layout() {
  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitle: '',
          header: () => (
            <View
              style={{
                backgroundColor: 'white',
                height: 90,
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 5,
              }}
            >
              {/* <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#00ADA2',
                }}
              >
                dotWeather
              </Text> */}
            </View>
          ),
        }}
      />
    </>
  )
}