// app.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getWeatherData } from './weather.js';
import { getRoutes } from './map.js';
import { getEvents } from './events.js';
import { getTodoItems, processTodoItems } from './canvas.js';

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
  try {
    const weatherData = await getWeatherData();
    console.log(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

const testGetRoutes = async () => {
  try {
    const routeData = await getRoutes();
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
// testGetRoutes();
// testGetEvents();
// testGetTodoItems();
testProcessTodoItems();