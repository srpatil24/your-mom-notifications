import { Button, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import * as WebBrowser from "expo-web-browser";

export default function SettingsScreen() {
  const handleAuth = async () => {
    const res = await WebBrowser.openAuthSessionAsync("https://my.wisc.edu", "https://my.wisc.edu/web/compact");
    console.log(res);
  }

	return (
		<View style={styles.container}>
      <Text>Login to show your course schedule</Text>
			<Button title="Authorize with wisc.edu" color="red" onPress={handleAuth} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
    gap: 20
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
