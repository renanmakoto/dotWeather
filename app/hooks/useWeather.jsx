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
      // 1) Geocode city → lat/lon
      const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: city, count: 1, language: 'en', format: 'json' },
      })

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        setError('City not found. Please enter a valid city name.')
        setLoading(false)
        return
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0]

      // 2) Weather for that location, in the city’s local timezone
      const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current_weather: true,
          hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
          timezone: 'auto', // -> local time for the city
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

  // ---- Helpers ----

  // Find the index in hourly.time that is >= current time string
  function findCurrentHourIndex(hourlyTimes, currentTimeStr) {
    // Timestamps are like "2025-08-22T16:00" in the city's local time.
    // Try exact match first:
    let idx = hourlyTimes.indexOf(currentTimeStr)
    if (idx !== -1) return idx

    // If exact not found, find the first time >= currentTimeStr
    idx = hourlyTimes.findIndex(t => t >= currentTimeStr)
    if (idx !== -1) return idx

    // Fallback: last hours of array
    return Math.max(0, hourlyTimes.length - 5)
  }

  const parseWeatherData = (data, cityName, countryName) => {
    const { current_weather, hourly } = data

    // Determine the slice starting from "now" in the city’s local time
    const startIdx = findCurrentHourIndex(hourly.time, current_weather.time)
    const endIdx = Math.min(startIdx + 5, hourly.time.length)

    const times = hourly.time.slice(startIdx, endIdx)
    const temps = hourly.temperature_2m.slice(startIdx, endIdx)
    const hums  = hourly.relative_humidity_2m.slice(startIdx, endIdx)
    const winds = hourly.wind_speed_10m.slice(startIdx, endIdx)

    return {
      location: { city: cityName, country: countryName },
      current: {
        time: current_weather.time,          // already in local city time
        temperature: current_weather.temperature,
        windSpeed: current_weather.wind_speed,
        weatherCode: current_weather.weathercode,
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
