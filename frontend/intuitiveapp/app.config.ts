import 'dotenv/config'
import { ExpoConfig } from '@expo/config-types'

const config: ExpoConfig = {
    name: "Intuitive",
    slug: "intuitiveapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "intuitiveapp",
    userInterfaceStyle: "automatic",
    splash: {
        image: "./assets/images/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    android: {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "package": "com.marskat.intuitiveapp",
      "softwareKeyboardLayoutMode": "resize"
    },
    plugins: [
        "expo-router",
        "expo-font",
        "expo-web-browser"
    ],
    extra: {
        API_BASE_URL: process.env.API_BASE_URL,
        "eas": {
            "projectId": "03211606-8ffa-4d5b-80b1-11eef070d91a"
        }
    }
}

export default config
