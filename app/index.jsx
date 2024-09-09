import React from 'react'
import WeatherScreen from './screens/WeatherScreen'
import { useNavigation } from 'expo-router'

export default function Index() {
  const navigation = useNavigation()

  React.useEffect(() => {
    navigation.setOptions({
      title: 'dotWeather',
      headerTitleAlign: 'center',
    })
  }, [navigation])

  return <WeatherScreen />
}
