import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from '../../hooks/useAuth';
import { Button } from "../../components/button";

export default function Home() {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo</Text>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
        gap: 16
    },
    title: {
        fontSize: 18,
        fontWeight: "bold"
    }
})