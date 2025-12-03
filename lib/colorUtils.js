const DEFAULT_COLOR = '255,255,255'
const HEX_REGEX = /^#?([a-f\d]{3}|[a-f\d]{6})$/i
const RGB_REGEX = /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/

function normalizeHex(hex) {
  if (hex.length === 3) {
    return hex.split('').map((char) => char + char).join('')
  }
  return hex
}

function hexToRgbValues(hex) {
  const bigint = parseInt(hex, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

export function toRgba(color, alpha) {
  if (typeof color !== 'string' || !color) {
    return `rgba(${DEFAULT_COLOR},${alpha})`
  }

  const trimmed = color.trim()

  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1)

    if (!HEX_REGEX.test(hex)) {
      return `rgba(${DEFAULT_COLOR},${alpha})`
    }

    const normalized = normalizeHex(hex)
    const { r, g, b } = hexToRgbValues(normalized)
    return `rgba(${r},${g},${b},${alpha})`
  }

  if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(RGB_REGEX)

    if (!match) {
      return `rgba(${DEFAULT_COLOR},${alpha})`
    }

    return `rgba(${match[1]},${match[2]},${match[3]},${alpha})`
  }

  return `rgba(${DEFAULT_COLOR},${alpha})`
}

export function hexToRgba(hex, alpha) {
  return toRgba(hex, alpha)
}

export function lightenColor(hex, percent) {
  if (typeof hex !== 'string' || !hex.startsWith('#')) {
    return hex
  }

  const normalized = normalizeHex(hex.slice(1))
  const { r, g, b } = hexToRgbValues(normalized)

  const lighten = (value) => Math.min(255, Math.round(value + (255 - value) * (percent / 100)))

  const newR = lighten(r).toString(16).padStart(2, '0')
  const newG = lighten(g).toString(16).padStart(2, '0')
  const newB = lighten(b).toString(16).padStart(2, '0')

  return `#${newR}${newG}${newB}`
}

export function darkenColor(hex, percent) {
  if (typeof hex !== 'string' || !hex.startsWith('#')) {
    return hex
  }

  const normalized = normalizeHex(hex.slice(1))
  const { r, g, b } = hexToRgbValues(normalized)

  const darken = (value) => Math.max(0, Math.round(value * (1 - percent / 100)))

  const newR = darken(r).toString(16).padStart(2, '0')
  const newG = darken(g).toString(16).padStart(2, '0')
  const newB = darken(b).toString(16).padStart(2, '0')

  return `#${newR}${newG}${newB}`
}
