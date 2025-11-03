import { useState } from 'react'
import axios from 'axios'

export default function useWeather() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = async (city) => {
    setLoading(true)
    setError(null)

    try {
      const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: city, count: 1, language: 'en', format: 'json' },
      })

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        setError('City not found. Please enter a valid city name.')
        setLoading(false)
        return
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0]

      const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current_weather: true,
          hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
          daily: 'sunrise,sunset',
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

  function findCurrentHourIndex(hourlyTimes, currentTimeStr) {
    let idx = hourlyTimes.indexOf(currentTimeStr)
    if (idx !== -1) return idx

    idx = hourlyTimes.findIndex(t => t >= currentTimeStr)
    if (idx !== -1) return idx

    return Math.max(0, hourlyTimes.length - 5)
  }

  const parseWeatherData = (data, cityName, countryName) => {
    const { current_weather, hourly, daily } = data
    const currentDate = current_weather?.time?.split?.('T')?.[0]
    const dailyIndex = currentDate && Array.isArray(daily?.time) ? daily.time.findIndex(day => day === currentDate) : -1
    const sunrise = dailyIndex !== -1 ? daily?.sunrise?.[dailyIndex] ?? null : daily?.sunrise?.[0] ?? null
    const sunset = dailyIndex !== -1 ? daily?.sunset?.[dailyIndex] ?? null : daily?.sunset?.[0] ?? null

    const startIdx = findCurrentHourIndex(hourly.time, current_weather.time)
    const endIdx = Math.min(startIdx + 5, hourly.time.length)

    const times = hourly.time.slice(startIdx, endIdx)
    const temps = hourly.temperature_2m.slice(startIdx, endIdx)
    const hums  = hourly.relative_humidity_2m.slice(startIdx, endIdx)
    const winds = hourly.wind_speed_10m.slice(startIdx, endIdx)

    return {
      location: { city: cityName, country: countryName },
      current: {
        time: current_weather.time,
        temperature: current_weather.temperature,
        windSpeed: current_weather.wind_speed,
        weatherCode: current_weather.weathercode,
        sunrise,
        sunset,
      },
      hourly: {
        time: times,
        temperature: temps,
        humidity: hums,
        windSpeed: winds,
      },
    }
  }

  return { weatherData, fetchWeather, loading, error }
}
