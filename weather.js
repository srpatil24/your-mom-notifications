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

const url = 'https://api.open-meteo.com/v1/forecast';

async function getWeatherData() {
  const queryString = new URLSearchParams(params).toString();
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
        time: hourly.time.map((t) => new Date(t)),
        temperature2m: hourly.temperature_2m,
        apparentTemperature: hourly.apparent_temperature,
        precipitationProbability: hourly.precipitation_probability,
        precipitation: hourly.precipitation,
      },
    };

    const tableData = [];

    for (let i = 0; i < weatherData.hourly.time.length; i++) {
      tableData.push({
        Time: weatherData.hourly.time[i].toLocaleString('en-US', {
          timeZone: 'America/Chicago',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        }),
        'Temperature (°C)': weatherData.hourly.temperature2m[i],
        'Feels Like (°C)': weatherData.hourly.apparentTemperature[i],
        'Precipitation Probability (%)': weatherData.hourly.precipitationProbability[i],
        'Precipitation (mm)': weatherData.hourly.precipitation[i],
      });
    }

    console.table(tableData);

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; // Re-throw the error so it can be caught in app.js
  }
}

export { getWeatherData };