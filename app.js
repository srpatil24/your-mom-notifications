// app.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getWeatherData } from './weather.js';

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

// Function to test getWeatherData
const testGetWeatherData = async () => {
  try {
    const weatherData = await getWeatherData();
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

// Invoke the test function
testGetWeatherData();