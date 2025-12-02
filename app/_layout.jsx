import React from 'react'
import { StatusBar, View } from 'react-native'
import { Stack } from 'expo-router'

const HEADER_HEIGHT = 40

const headerStyle = {
  backgroundColor: 'white',
  height: HEADER_HEIGHT,
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingBottom: 0,
}

function MinimalHeader() {
  return <View style={headerStyle} />
}

export default function Layout() {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitle: '',
          header: MinimalHeader,
        }}
      />
    </>
  )
}
