// app.js
import axios from 'axios';

// Configure base API settings
const apiClient = axios.create({
  baseURL: 'YOUR_API_BASE_URL', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
    'Platform': 'android',
  },
});

// Import your API functions
import {
  getWeatherData,
  getRoutes,
  getEvents,
  getTodoItems,
  processTodoItems,
  getCourses,
  processCourses,
  getCourseInfo
} from './src/api/index.js';

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Test functions
const testWeather = async () => {
  try {
    const data = await getWeatherData();
    console.log('Weather test:', data);
    return data;
  } catch (error) {
    console.error('Weather test failed:', error);
    throw error;
  }
};

const testRoutes = async () => {
  try {
    const data = await getRoutes();
    console.log('Routes test:', data);
    return data;
  } catch (error) {
    console.error('Routes test failed:', error);
    throw error;
  }
};

const testEvents = async () => {
  try {
    const data = await getEvents();
    console.log('Events test:', data);
    return data;
  } catch (error) {
    console.error('Events test failed:', error);
    throw error;
  }
};

const testTodos = async () => {
  try {
    const items = await getTodoItems();
    const processed = await processTodoItems(items);
    console.log('Todos test:', processed);
    return processed;
  } catch (error) {
    console.error('Todos test failed:', error);
    throw error;
  }
};

const testCourses = async () => {
  try {
    const courses = await getCourses();
    const processed = await processCourses(courses);
    console.log('Courses test:', processed);
    return processed;
  } catch (error) {
    console.error('Courses test failed:', error);
    throw error;
  }
};

const testCourseInfo = async () => {
  try {
    const info = await getCourseInfo('COMP SCI 544');
    console.log('Course info test:', info);
    return info;
  } catch (error) {
    console.error('Course info test failed:', error);
    throw error;
  }
};

const testAllCourses = async () => {
  try {
    // First get and process courses from Canvas
    const courses = await getCourses();

    // Step 2: Process Courses
    const processedCourses = await processCourses(courses);

    const courseInfos = [];

    for (const course of processedCourses) {
      try {
        const info = await getCourseInfo(course);
        courseInfos.push(info);
      } catch (infoError) {
        console.error(`Error fetching info for ${course}:`, infoError);
      }
    }

    console.log('Course Latitude:', courseInfos[0].weeklyMeetings[0].latitude);
    console.log('Course Longitude:', courseInfos[0].weeklyMeetings[0].longitude);
    return courseInfos;
  } catch (error) {
    console.error('Courses test failed:', error);
    throw error;
  }
};

testAllCourses();