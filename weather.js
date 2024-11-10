// weather.js
const params = {
  latitude: 43.074302,
  longitude: -89.400024,
  hourly: [
    'temperature_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
  ],
  timezone: 'America/Chicago',
};

// Function to get formatted date in YYYY-MM-DD
function getFormattedDate(date) {
  const year = date.getFullYear();
  // Months are zero-indexed in JavaScript Date
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getWeatherData() {
  // Get today's date
  const today = new Date();
  const formattedDate = getFormattedDate(today);

  // Add start_date and end_date to params for a single day
  const singleDayParams = {
    ...params,
    start_date: formattedDate,
    end_date: formattedDate,
  };

  const queryString = new URLSearchParams(singleDayParams).toString();
  const url = 'https://api.open-meteo.com/v1/forecast';
  const fullUrl = `${url}?${queryString}`;

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const hourly = data.hourly;

    const weatherData = {
      hourly: {
        time: hourly.time.map((t) => new Date(t).toISOString()),
        temperature2m: hourly.temperature_2m,
        apparentTemperature: hourly.apparent_temperature,
        precipitationProbability: hourly.precipitation_probability,
      },
    };
    console.log(weatherData)
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; // Re-throw the error so it can be caught in app.js
  }
}

export { getWeatherData };
