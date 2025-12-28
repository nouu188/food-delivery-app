import Constants from "expo-constants";
import { Platform } from "react-native";

const DEFAULT_API_URL = "http://localhost:3000/api";

function getDevMachineHost(): string | null {
    // Expo provides the dev server host (LAN IP) in different places depending on SDK/runtime.
    const hostUri =
        (Constants as any).expoConfig?.hostUri ||
        (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
        (Constants as any).manifest?.hostUri ||
        (Constants as any).manifest?.debuggerHost ||
        null;

    if (!hostUri || typeof hostUri !== "string") return null;

    // Examples: "192.168.1.10:19000" or "192.168.1.10"
    return hostUri.split(":")[0] || null;
}

function resolveApiUrl(): string {
    const raw = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;
    const devHost = getDevMachineHost();

    try {
        const url = new URL(raw);
        const hostname = url.hostname;
        const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

        // Android emulator: localhost points to emulator itself; 10.0.2.2 maps to the host machine.
        if (Platform.OS === "android" && isLocalhost) {
            url.hostname = "10.0.2.2";
            return url.toString().replace(/\/$/, "");
        }

        // iOS simulator/device + physical devices: 10.0.2.2 is not reachable; localhost points to the device.
        if ((hostname === "10.0.2.2" || isLocalhost) && devHost) {
            url.hostname = devHost;
        }

        return url.toString().replace(/\/$/, "");
    } catch {
        // If URL parsing fails (e.g. malformed env var), fall back to raw.
        return raw;
    }
}

const ENV_NAME = process.env.EXPO_PUBLIC_ENV || "development";

export const ENV = {
    API_URL: resolveApiUrl(),
    API_TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 30000,
    ENV: ENV_NAME,
    IS_DEV: ENV_NAME === "development",
    ENABLE_LOGGING: process.env.EXPO_PUBLIC_ENABLE_LOGGING === "true",
} as const;

// Validate required env vars
if (!ENV.API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is required");
}
