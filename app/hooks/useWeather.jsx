import { useState } from 'react'
import axios from 'axios'

export default function useWeather() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = async city => {
    setLoading(true)
    setError(null)

    try {
      // 1. Get coordinates by city name
      const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: {
          name: city,
          count: 1,
          language: 'en',
          format: 'json',
        },
      })

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        setError('City not found. Please enter a valid city name.')
        setLoading(false)
        return
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0]

      // 2. Fetch weather data using lat/lon
      const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current_weather: true,
          hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
          timezone: 'auto',
        },
      })

      const parsedData = parseWeatherData(weatherResponse.data, name, country)
      setWeatherData(parsedData)

    } catch (err) {
      console.error(err)
      setError('An error occurred while fetching weather data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const parseWeatherData = (data, cityName, countryName) => {
    const { current_weather, hourly } = data

    return {
      location: {
        city: cityName,
        country: countryName,
      },
      current: {
        time: current_weather.time,
        temperature: current_weather.temperature,
        windSpeed: current_weather.wind_speed,
        weatherCode: current_weather.weathercode,
      },
      hourly: {
        time: hourly.time.slice(0, 5),
        temperature: hourly.temperature_2m.slice(0, 5),
        humidity: hourly.relative_humidity_2m.slice(0, 5),
        windSpeed: hourly.wind_speed_10m.slice(0, 5),
      },
    }
  }

  return { weatherData, fetchWeather, loading, error }
}
