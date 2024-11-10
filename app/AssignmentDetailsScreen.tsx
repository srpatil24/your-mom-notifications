import React, { useMemo } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Button,
	Linking,
	useWindowDimensions,
	TouchableOpacity,
} from "react-native";
import RenderHTML, {
	RenderHTMLProps,
	HTMLSource,
} from "react-native-render-html";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useLocalSearchParams, router } from "expo-router";

export default function AssignmentDetailsScreen() {
	interface Event {
		assignment: {
			name?: string;
			due_at?: string;
			[key: string]: any;
		};
		context_name: string;
		html_url?: string;
	}

	const params = useLocalSearchParams();
	const event: Event =
		typeof params.event === "string" ? JSON.parse(params.event) : {};
	const colorScheme = useColorScheme();
	const { width } = useWindowDimensions();

	console.log(params);

	const assignment = event.assignment || {};

	// Theme colors
	const backgroundColor = event.assignment.is_quiz_assignment
		? "#FFDAB9"
		: "#ADD8E6";
	const textColor = event.assignment.is_quiz_assignment ? "#8B4513" : "#000080";

	const tagsStyles = useMemo(
		() => ({
			body: { fontSize: 16, color: textColor },
			a: { color: "#1E90FF", textDecorationLine: "underline" },
			p: { marginBottom: 10, color: textColor },
			h1: {
				fontSize: 24,
				fontWeight: "bold",
				marginBottom: 12,
				color: textColor,
			},
			h2: {
				fontSize: 20,
				fontWeight: "bold",
				marginBottom: 10,
				color: textColor,
			},
		}),
		[textColor],
	);

	const renderersProps = useMemo<RenderHTMLProps["renderersProps"]>(
		() => ({
			img: {
				enableExperimentalPercentWidth: true,
			},
		}),
		[],
	);

	console.log(
		"logging assignment description: " + event.assignment.description,
	);
	const htmlSource = { html: event.assignment.description } as HTMLSource;

	return (
		<LinearGradient
			colors={[backgroundColor, "#FFFFFF"]}
			style={styles.container}
		>
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<Text style={[styles.title, { color: textColor }]}>
					{event.assignment.name}
				</Text>
				<Text style={styles.dueDate}>Due: {event.assignment.due_at}</Text>
				<RenderHTML
					contentWidth={300}
					source={{ html: event.assignment.description }}
					baseStyle={styles.description}
				/>
				{event.assignment.is_quiz_assignment && (
					<Text style={styles.quizTag}>This is a Quiz</Text>
				)}
				<Text
					style={styles.link}
					onPress={() => Linking.openURL(event.assignment.html_url)}
				>
					Open in Browser
				</Text>
			</ScrollView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	contentContainer: {
		paddingBottom: 40,
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 10,
	},
	dueDate: {
		fontSize: 16,
		color: "#555",
		marginBottom: 20,
	},
	description: {
		fontSize: 16,
		color: "#333",
		lineHeight: 24,
		marginVertical: 15,
	},
	quizTag: {
		fontSize: 14,
		color: "#B22222",
		marginTop: 10,
		fontStyle: "italic",
	},
	link: {
		fontSize: 16,
		color: "#1E90FF",
		marginTop: 15,
		textDecorationLine: "underline",
	},
});
