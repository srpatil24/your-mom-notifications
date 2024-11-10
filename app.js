// app.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getWeatherData, getRoutes, getEvents, getTodoItems, processTodoItems } from './src/api/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//   res.send('Backend Server is Running');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const testGetWeatherData = async () => {
  const latitude = 43.074302; // Replace with desired latitude
  const longitude = -89.400024; // Replace with desired longitude

  try {
    const weatherData = await getWeatherData(latitude, longitude);
    console.log(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

const testGetRoutes = async () => {
  const originLatitude = 43.074302;      // Replace with your origin latitude
  const originLongitude = -89.400024;    // Replace with your origin longitude
  const destinationLatitude = 43.075111; // Replace with your destination latitude
  const destinationLongitude = -89.4018738; // Replace with your destination longitude
  const transportationMode = 'walking';  // Can be 'walking', 'driving', 'bicycling', etc.
  try {
    const routeData = await getRoutes(originLatitude, originLongitude, destinationLatitude, destinationLongitude, transportationMode);
    console.log(routeData);
  } catch (error) {
    console.error('Error fetching route data:', error);
  }
};

const testGetEvents = async () => {
  try {
    const eventData = await getEvents();
    console.log(eventData);
  } catch (error) {
    console.error('Error fetching event data:', error);
  }
};

const testGetTodoItems = async () => {
  try {
    const todoItems = await getTodoItems();
    console.log(todoItems[0]);
  } catch (error) {
    console.error('Error fetching todo items:', error);
  }
};

const testProcessTodoItems = async () => {
  try {
    const items = await getTodoItems();
    const todoItems = await processTodoItems(items);
    console.log(todoItems);
  } catch (error) {
    console.error('Error processing todo items:', error);
  }
};

// testGetWeatherData();
testGetRoutes();
// testGetEvents();
// testGetTodoItems();
// testProcessTodoItems();