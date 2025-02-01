import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import * as Location from 'expo-location';

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { getWeatherData } from "@/api/weather.js";
import { getTodoItems, processTodoItems } from "@/api/canvas.js";
import { getRoutes } from "@/api/map.js";
import { LinearGradient } from "expo-linear-gradient";

import { useRouter } from "expo-router";
import { getCourses, processCourses } from "@/api/courses.js";
import { getCourseInfo } from "@/api/courseInfo.js";

let sampleEventsJson = [
  {
    assignment: {
      name: "Math Homework 1",
      due_at: "2024-11-15T23:59:00Z",
    },
    context_name: "Math 101",
  },
  {
    assignment: {
      name: "Physics Lab Report",
      due_at: "2024-11-18T17:00:00Z",
    },
    context_name: "Physics 201",
  },
  {
    assignment: {
      name: "History Essay",
      due_at: "2024-11-20T23:59:00Z",
    },
    context_name: "History 101",
  },
  {
    assignment: {
      name: "Chemistry Quiz",
      due_at: "2024-11-22T10:30:00Z",
    },
    context_name: "Chemistry 105",
  },
  {
    assignment: {
      name: "Computer Science Project",
      due_at: "2024-11-25T12:00:00Z",
    },
    context_name: "CS 101",
  },
];

async function getLocation(): Promise<{
  lat: number | null;
  long: number | null;
}> {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("Permission to access location was denied");
    return { lat: null, long: null };
  }

  let location = await Location.getCurrentPositionAsync({});
  let { latitude, longitude } = location.coords;

  return { lat: latitude, long: longitude };
}

async function requestBackgroundPermissions() {
  let { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access location was denied');
    return false;
  }

  return true;
};

interface WeatherData {
  current: {
    temperature2m: number;
    apparentTemperature: number;
    precipitation: number;
  };
  daily: {
    precipitationProbability: number;
  };
}

const router = useRouter();

const handleEventPress = (event: Event) => {
  router.push({
    pathname: "/AssignmentDetailsScreen",
    params: { event: JSON.stringify(event) },
  });
};

let weatherData: WeatherData | null = null;

async function getWeather() {
  // const latitude = 43.074302; // Replace with desired latitude
  // const longitude = -89.400024; // Replace with desired longitude

  const location = await getLocation().catch((error) => {
    console.error("Error fetching location:", error);
    return { lat: 43.074302, long: -89.400024 };
  });

  return getWeatherData(location.lat, location.long).catch((error) => {
    console.error("Error fetching weather:", error);
    return null;
  });
}

interface Event {
  assignment: {
    name?: string;
    due_at?: string;
    [key: string]: any;
  };
  context_name: string;
  html_url?: string;
}

interface CourseInfo {
  courseCode: string;
  courseTitle: string;
  weeklyMeetings: {
    type: string;
    days: string;
    startTime: string;
    endTime: string;
    buildingName: string;
    latitude: number | 'N/A';
    longitude: number | 'N/A';
    room: string;
  }[];
  exams: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

async function getRouteToClass(userLat: number, userLong: number, courseLat: number | 'N/A', courseLong: number | 'N/A') {
  if (courseLat === 'N/A' || courseLong === 'N/A') {
    console.error('Course location not available');
    return null;
  }

  try {
    const routes = await getRoutes(
      userLat,
      userLong,
      courseLat as number,
      courseLong as number,
      'walking'
    );
    return routes;
  } catch (error) {
    console.error('Error getting route:', error);
    return null;
  }
}

export default function TabOneScreen() {
  const colorScheme = useColorScheme();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [courseLocation, setCourseLocation] = useState<{
    lat: number | 'N/A',
    long: number | 'N/A',
    routes?: any[]
  } | null>(null);

  useEffect(() => {
    getWeather().then(setWeatherData);
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const todoItems = await getTodoItems();
        const processedItems = await processTodoItems(todoItems);
        setEvents(processedItems);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    const interval = setInterval(() => fetchEvents(), 60000);
    return () => clearInterval(interval);
  }, [events]);

  useEffect(() => {
    async function fetchCourseLocationAndRoute() {
      try {
        // Get user's current location
        const userLocation = await getLocation();
        if (!userLocation.lat || !userLocation.long) {
          console.error('Unable to get user location');
          return;
        }

        // Get course information
        const courses = await getCourses();
        const processedCourses = await processCourses(courses);
        const courseInfos: CourseInfo[] = [];

        for (const course of processedCourses) {
          try {
            const info = await getCourseInfo(course);
            if (info?.weeklyMeetings?.[0]) {
              const routes = await getRouteToClass(
                userLocation.lat,
                userLocation.long,
                info.weeklyMeetings[0].latitude,
                info.weeklyMeetings[0].longitude
              );
              
              // Add routes to course info
              info.routes = routes;
              courseInfos.push(info as CourseInfo);
            }
          } catch (infoError) {
            console.error(`Error fetching info for ${course}:`, infoError);
          }
        }

        // Update state with course info including routes
        setCourseLocation({
          lat: courseInfos[0]?.weeklyMeetings[0]?.latitude,
          long: courseInfos[0]?.weeklyMeetings[0]?.longitude,
          routes: courseInfos[0]?.routes
        });
      } catch (error) {
        console.error('Error fetching course location and routes:', error);
      }
    }
    fetchCourseLocationAndRoute();
  }, []);

  return (
    <View>
      <ScrollView>
        <LinearGradient
          colors={["#e0e5ec", "#ffffff"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.weatherContainer}
        >
          <View
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              backgroundColor: "transparent",
            }}
          >
            <Text style={styles.iconWithOutline}>
              <FontAwesome
                name="cloud"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              justifyContent: "flex-end",
            }}
          >
            <Text style={styles.currTemperature}>
              {weatherData
                ? weatherData.current.apparentTemperature
                : "Loading temperature..."}
              <Text style={styles.degreeSymbol}>°F</Text>
            </Text>
            <Text style={styles.maxPrecProb}>
              {weatherData
                ? weatherData.daily.precipitationProbability
                : "Loading chance of rain..."}
              % chance of rain
            </Text>
          </View>
        </LinearGradient>
        {events.map((event: Event) => (
          <TouchableOpacity
            key={event.assignment.name}
            onPress={() => handleEventPress(event)}
          >
            <EventContainer event={event} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// defines container for each event for display
function EventContainer({ event }: { event: any }) {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.eventContainer}>
      <FontAwesome
        name={event.assignment.is_quiz_assignment ? "flag-o" : "book"}
        size={25}
        color={Colors[colorScheme ?? "light"].text}
        style={{
          marginRight: 5,
          textAlignVertical: "center",
          alignItems: "center",
          textAlign: "center",
          marginLeft: 15,
        }}
      />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.eventTitle}>{event.assignment.name}</Text>
          <Text style={styles.courseName}>{event.context_name}</Text>
          <Text style={styles.eventDueDate}>
            Due: {event.assignment.due_at}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  eventContainer: {
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",
    height: 100,
    // height: "100%",
    marginBottom: 10,
    // padding: 10,
    backgroundColor: "red",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    // height: 'auto' removed
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    // height: 100,
    marginLeft: 10,
    alignSelf: "stretch",
  },
  textContainer: {
    // flex: 1,
    height: "100%",
    marginLeft: 10,
    marginTop: 10,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  courseName: {
    fontSize: 15,
  },
  eventDueDate: {
    color: "gray",
    marginTop: 5,
  },
  weatherContainer: {
    width: "95%",
    alignSelf: "center",
    height: 180,
    marginBottom: 20,
    marginTop: 20,
    padding: 20,
    backgroundColor: "linear-gradient(145deg, #e0e5ec, #ffffff)", // Smooth gradient
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
    justifyContent: "flex-end", // Aligns content to the bottom
  },
  currTemperature: {
    fontSize: 48,
    fontFamily: "serif",
    fontWeight: "bold",
    color: "#333",
    lineHeight: 48,
    backgroundColor: "transparent",
  },
  degreeSymbol: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#666",
    backgroundColor: "transparent",
  },
  iconWithOutline: {
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  maxPrecProb: {
    fontSize: 18,
    fontFamily: "serif",
    color: "#777",
    marginTop: 4,
    backgroundColor: "transparent",
  },
});
