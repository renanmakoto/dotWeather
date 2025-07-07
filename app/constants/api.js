export async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current_weather=true` +
    `&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Weather fetch failed');
    }
    const data = await response.json();
    return data.current_weather;
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}
