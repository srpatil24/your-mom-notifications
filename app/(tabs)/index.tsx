import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import * as Location from "expo-location";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { getWeatherData } from "@/api/weather.js";
import * as Creds from "@/api/creds";
import { getTodoItems, processTodoItems } from "@/api/canvas.js";
import { LinearGradient } from "expo-linear-gradient";

import { useRouter } from "expo-router";

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
	if (status !== "granted") {
		console.error("Permission to access location was denied");
		return false;
	}

	return true;
}

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

export default function TabOneScreen() {
	const colorScheme = useColorScheme();

	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [events, setEvents] = useState<Event[]>([]);
	useEffect(() => {
		getWeather().then(setWeatherData);
	}, []);

	useEffect(() => {
		async function fetchEvents() {
			try {
				const todoItems = await getTodoItems(
					await Creds.getValueFor("canvas.access-token"),
				);
				const processedItems = await processTodoItems(todoItems);
				setEvents(processedItems);
			} catch (error) {
				console.error("Error fetching events:", error);
			}
		}
		fetchEvents();
		const interval = setInterval(() => fetchEvents(), 60000);
		return () => clearInterval(interval);
	}, [events]);

	const router = useRouter();

	const handleEventPress = (event: Event) => {
		router.push({
			pathname: "/AssignmentDetailsScreen",
			params: { event: JSON.stringify(event) },
		});
	};

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
						Due: {new Date(event.assignment.due_at).toLocaleString()}
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
		justifyContent: "center", // Centers horizontally
		alignItems: "center", // Centers vertically
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
