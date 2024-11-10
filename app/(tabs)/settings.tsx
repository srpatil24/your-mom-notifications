import { Button, StyleSheet, TextInput } from "react-native";
import { Text, View } from "@/components/Themed";
import * as Creds from "@/api/creds";
import { useEffect, useState } from "react";

export default function SettingsScreen() {
	const [canvasToken, setCanvasToken] = useState("");
	useEffect(() => {
		Creds.getValueFor("canvas.access-token").then((token) => {
			if (token) setCanvasToken(token);
		});
	}, []);

	useEffect(() => {
		Creds.save("canvas.access-token", canvasToken);
	}, [canvasToken]);

	return (
		<View style={styles.container}>
			<Text>Login to show your course schedule</Text>
			<TextInput
				style={styles.input}
				value={canvasToken}
				onChangeText={setCanvasToken}
				keyboardType="visible-password"
				placeholder="Canvas access token"
				placeholderTextColor="white"
			/>
			<Button title="Validate" color="red" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "80%",
		marginTop: 20,
		marginHorizontal: "auto"
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		color: "white",
		backgroundColor: "#1b1b1b"
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
});
