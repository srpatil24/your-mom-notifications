// weather.js

// Function to get formatted date in YYYY-MM-DD
function getFormattedDate(date) {
  const year = date.getFullYear();
  // Months are zero-indexed in JavaScript Date
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getWeatherData(latitude, longitude) {
  // Get today's date
  const today = new Date();
  const formattedDate = getFormattedDate(today);

  // Construct params with passed latitude and longitude
  const params = {
    latitude: latitude,
    longitude: longitude,
    current: ["temperature_2m", "apparent_temperature", "is_day"],
    daily: "precipitation_probability_max",
    temperature_unit: "fahrenheit",
    precipitation_unit: "inch",
    start_date: formattedDate,
    end_date: formattedDate,
  };

  const queryString = new URLSearchParams(params).toString();
  const url = 'https://api.open-meteo.com/v1/forecast';
  const fullUrl = `${url}?${queryString}`;

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const current = data.current;
    const daily = data.daily;

    const weatherData = {
      current: {
        temperature2m: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        precipitation: current.precipitation,
      },
      daily: {
        precipitationProbability: daily.precipitation_probability_max,
      },
    };
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; // Re-throw the error so it can be caught in app.js
  }
}

export { getWeatherData };