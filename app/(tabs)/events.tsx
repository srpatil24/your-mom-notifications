import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import React, { useState, useEffect } from "react";
import { getEvents } from "@/api/events.js";

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
						{event.start} - {event.end}
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
