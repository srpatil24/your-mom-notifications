import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import React, { useState, useEffect } from "react";
import { getEvents } from "@/api/events.js";

interface Event {
	title: string;
	start: string;
	end: string;
	location: string | null;
	description: string | null;
}

export default function EventsScreen() {
	const [events, setEvents] = useState<Event[]>([]);

	useEffect(() => {
		async function fetchEvents() {
			try {
				const todoItems = await getEvents();
				setEvents(todoItems);
			} catch (error) {
				console.error("Error fetching events:", error);
			}
		}
		fetchEvents();
	}, []);

	return (
		<ScrollView>
			{events.map((event, index) => (
				<TouchableOpacity key={index}>
					<EventContainer event={event} />
				</TouchableOpacity>
			))}
		</ScrollView>
	);
}

function EventContainer({ event }: { event: any }) {
	const colorScheme = useColorScheme();
	return (
		<View style={styles.eventContainer}>
			<FontAwesome
				name="calendar-check-o"
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
					<Text style={styles.eventTitle}>{event.title}</Text>
					<Text style={styles.courseName}>{event.location}</Text>
					<Text style={styles.eventDueDate}>
						{new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
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
		width: "100%",
		alignSelf: "center",
		height: 100,
		// height: "100%",
		marginBottom: 10,
		// padding: 10,
		backgroundColor: "red",
		borderTopLeftRadius: 20,
		borderBottomLeftRadius: 20,
		// height: 'auto' removed
		justifyContent: "center",  // Centers horizontally
		alignItems: "center",      // Centers vertically
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
});
