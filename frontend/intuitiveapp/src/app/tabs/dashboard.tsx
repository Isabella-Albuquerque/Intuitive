import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from '../../hooks/useAuth';
import { Button } from "../../components/button";

export default function Dashboard() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Em construção</Text>
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
        fontFamily: "Poppins-Bold"
    }
})