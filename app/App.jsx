import React from 'react';
import { View, StatusBar } from 'react-native';
import { WeatherScreen } from './screens/WeatherScreen';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <WeatherScreen />
    </View>
  );
}
