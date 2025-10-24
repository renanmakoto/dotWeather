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
                height: 40,
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 0,
              }}
            >
            </View>
          ),
        }}
      />
    </>
  )
}