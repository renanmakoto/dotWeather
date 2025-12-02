import { useState, useCallback } from 'react'
import axios from 'axios'

const API_ENDPOINTS = {
  GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
  FORECAST: 'https://api.open-meteo.com/v1/forecast',
}

const ERROR_MESSAGES = {
  CITY_NOT_FOUND: 'City not found. Please enter a valid city name.',
  FETCH_FAILED: 'An error occurred while fetching weather data. Please try again later.',
}

const FORECAST_HOURS_COUNT = 5

function findCurrentHourIndex(hourlyTimes, currentTimeStr) {
  const exactMatch = hourlyTimes.indexOf(currentTimeStr)
  if (exactMatch !== -1) return exactMatch

  const nextAvailable = hourlyTimes.findIndex((time) => time >= currentTimeStr)
  if (nextAvailable !== -1) return nextAvailable

  return Math.max(0, hourlyTimes.length - FORECAST_HOURS_COUNT)
}

function extractSunTimes(daily, currentDate) {
  if (!daily?.time || !Array.isArray(daily.time)) {
    return { sunrise: daily?.sunrise?.[0] ?? null, sunset: daily?.sunset?.[0] ?? null }
  }

  const dailyIndex = daily.time.findIndex((day) => day === currentDate)

  return {
    sunrise: dailyIndex !== -1 ? daily.sunrise?.[dailyIndex] : daily.sunrise?.[0] ?? null,
    sunset: dailyIndex !== -1 ? daily.sunset?.[dailyIndex] : daily.sunset?.[0] ?? null,
  }
}

function parseWeatherData(data, cityName, countryName) {
  const { current_weather: currentWeather, hourly, daily } = data
  const currentDate = currentWeather?.time?.split?.('T')?.[0]
  const { sunrise, sunset } = extractSunTimes(daily, currentDate)

  const startIndex = findCurrentHourIndex(hourly.time, currentWeather.time)
  const endIndex = Math.min(startIndex + FORECAST_HOURS_COUNT, hourly.time.length)

  return {
    location: {
      city: cityName,
      country: countryName,
    },
    current: {
      time: currentWeather.time,
      temperature: currentWeather.temperature,
      windSpeed: currentWeather.wind_speed,
      weatherCode: currentWeather.weathercode,
      sunrise,
      sunset,
    },
    hourly: {
      time: hourly.time.slice(startIndex, endIndex),
      temperature: hourly.temperature_2m.slice(startIndex, endIndex),
      humidity: hourly.relative_humidity_2m.slice(startIndex, endIndex),
      windSpeed: hourly.wind_speed_10m.slice(startIndex, endIndex),
    },
  }
}

async function geocodeCity(city) {
  const response = await axios.get(API_ENDPOINTS.GEOCODING, {
    params: {
      name: city,
      count: 1,
      language: 'en',
      format: 'json',
    },
  })

  const results = response.data?.results
  return results?.length > 0 ? results[0] : null
}

async function fetchForecast(latitude, longitude) {
  const response = await axios.get(API_ENDPOINTS.FORECAST, {
    params: {
      latitude,
      longitude,
      current_weather: true,
      hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
      daily: 'sunrise,sunset',
      timezone: 'auto',
    },
  })

  return response.data
}

export default function useWeather() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = useCallback(async (city) => {
    if (!city?.trim()) return

    setLoading(true)
    setError(null)

    try {
      const location = await geocodeCity(city)

      if (!location) {
        setError(ERROR_MESSAGES.CITY_NOT_FOUND)
        return
      }

      const { latitude, longitude, name, country } = location
      const forecastData = await fetchForecast(latitude, longitude)
      const parsedData = parseWeatherData(forecastData, name, country)

      setWeatherData(parsedData)
    } catch (err) {
      console.error('Weather fetch error:', err)
      setError(ERROR_MESSAGES.FETCH_FAILED)
    } finally {
      setLoading(false)
    }
  }, [])

  return { weatherData, fetchWeather, loading, error }
}
