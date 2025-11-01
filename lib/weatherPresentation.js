const WEATHER_VARIANTS = [
  {
    name: 'clear',
    codes: [0],
    label: 'Clear skies',
    iconDay: 'sunny',
    iconNight: 'moon',
    dayGradient: ['#4facfe', '#00f2fe'],
    nightGradient: ['#0a1a4f', '#101d65'],
    accent: '#ffe082',
    effect: 'clear',
  },
  {
    name: 'mostly-clear',
    codes: [1, 2],
    label: 'Mostly clear',
    iconDay: 'partly-sunny',
    iconNight: 'cloudy-night',
    dayGradient: ['#66a6ff', '#89f7fe'],
    nightGradient: ['#1a2a6c', '#302b63'],
    accent: '#ffd7ba',
    effect: 'breeze',
  },
  {
    name: 'overcast',
    codes: [3, 45, 48],
    label: 'Cloudy',
    iconDay: 'cloud',
    iconNight: 'cloud-outline',
    dayGradient: ['#667db6', '#0082c8'],
    nightGradient: ['#232526', '#414345'],
    accent: '#b0c7ff',
    effect: 'clouds',
  },
  {
    name: 'drizzle',
    codes: [51, 53, 55, 56, 57],
    label: 'Drizzle',
    iconDay: 'rainy-outline',
    iconNight: 'rainy-outline',
    dayGradient: ['#5f72bd', '#9b23ea'],
    nightGradient: ['#3a3768', '#1e2a54'],
    accent: '#b4b9ff',
    effect: 'drizzle',
  },
  {
    name: 'rain',
    codes: [61, 63, 65, 66, 67, 80, 81, 82],
    label: 'Rain showers',
    iconDay: 'thunderstorm',
    iconNight: 'rainy',
    dayGradient: ['#005c97', '#363795'],
    nightGradient: ['#283c86', '#45a247'],
    accent: '#9fd3ff',
    effect: 'rain',
  },
  {
    name: 'snow',
    codes: [71, 73, 75, 77, 85, 86],
    label: 'Snowfall',
    iconDay: 'snow',
    iconNight: 'snow',
    dayGradient: ['#83a4d4', '#b6fbff'],
    nightGradient: ['#536976', '#292e49'],
    accent: '#f0f7ff',
    effect: 'snow',
  },
  {
    name: 'storm',
    codes: [95, 96, 99],
    label: 'Stormy',
    iconDay: 'thunderstorm-outline',
    iconNight: 'thunderstorm-outline',
    dayGradient: ['#141e30', '#243b55'],
    nightGradient: ['#0f2027', '#203a43'],
    accent: '#ffb347',
    effect: 'storm',
  },
]

const DEFAULT_PRESENTATION = {
  label: 'Discover the weather',
  icon: 'partly-sunny-outline',
  gradient: ['#00ADA2', '#FFFFFF'],
  accent: '#00ADA2',
  cardGradient: ['rgba(255,255,255,0.82)', 'rgba(0,173,162,0.18)'],
  effect: 'ambient',
  mode: 'day',
  isNight: false,
}

function findVariant(weatherCode) {
  return WEATHER_VARIANTS.find(variant => variant.codes.includes(weatherCode))
}

function isNightTime(timeString, sunTimes = {}) {
  if (!timeString) return false
  const current = new Date(timeString)
  if (Number.isNaN(current.getTime())) return false

  const sunrise = sunTimes.sunrise ? new Date(sunTimes.sunrise) : null
  const sunset = sunTimes.sunset ? new Date(sunTimes.sunset) : null
  const sunriseValid = sunrise && !Number.isNaN(sunrise.getTime())
  const sunsetValid = sunset && !Number.isNaN(sunset.getTime())

  if (sunriseValid && sunsetValid && sunrise < sunset) {
    return current < sunrise || current >= sunset
  }

  const hour = current.getHours()
  return hour >= 19 || hour < 6
}

export function getWeatherPresentation(weatherCode, timeString, sunTimes) {
  const variant = findVariant(weatherCode)

  if (!variant) {
    return DEFAULT_PRESENTATION
  }

  const nightMode = isNightTime(timeString, sunTimes)
  const gradient = nightMode ? variant.nightGradient : variant.dayGradient
  const icon = nightMode && variant.iconNight ? variant.iconNight : variant.iconDay
  const cardGradient = nightMode
    ? ['rgba(21,33,61,0.72)', 'rgba(11,17,32,0.58)']
    : ['rgba(255,255,255,0.32)', 'rgba(255,255,255,0.08)']
  const accent = nightMode ? '#f0f6ff' : variant.accent

  return {
    label: variant.label,
    icon,
    gradient,
    accent,
    effect: variant.effect ?? 'ambient',
    cardGradient,
    mode: nightMode ? 'night' : 'day',
    isNight: nightMode,
  }
}

export function formatObservedAt(timeString) {
  if (!timeString) return ''
  const parsed = new Date(timeString)
  if (Number.isNaN(parsed.getTime())) return ''

  const day = parsed.toLocaleDateString(undefined, { weekday: 'long' })
  const date = parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const time = parsed.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

  return `${day}, ${date} • ${time}`
}

export function formatHourLabel(timeString) {
  if (!timeString) return ''
  const parsed = new Date(timeString)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleTimeString(undefined, { hour: 'numeric' })
}

export function getDefaultPresentation() {
  return DEFAULT_PRESENTATION
}
