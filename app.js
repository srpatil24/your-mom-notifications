// app.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getWeatherData } from './weather.js';
import { getRoutes } from './map.js';
import { getEvents } from './events.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Backend Server is Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const testGetWeatherData = async () => {
  try {
    const weatherData = await getWeatherData();
    console.log(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

const testgetRoutes = async () => {
  try {
    const routeData = await getRoutes();
    console.log(routeData);
  } catch (error) {
    console.error('Error fetching route data:', error);
  }
};

const testgetEvents = async () => {
  try {
    const eventData = await getEvents();
    console.log(eventData);
  } catch (error) {
    console.error('Error fetching event data:', error);
  }
};

testGetWeatherData();
testgetRoutes();
testgetEvents();