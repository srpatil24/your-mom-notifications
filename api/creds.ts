import * as SecureStore from "expo-secure-store";

type Key = "canvas.access-token";

export async function save(key: Key, value: string) {
	await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key: Key) {
	return await SecureStore.getItemAsync(key);
}
