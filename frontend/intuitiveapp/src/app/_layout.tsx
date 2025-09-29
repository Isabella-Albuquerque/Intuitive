import { Stack } from "expo-router"

export default function MainLayout(){
    return(
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />      
      <Stack.Screen name="tabs" /> 
    </Stack>
              
    )
}