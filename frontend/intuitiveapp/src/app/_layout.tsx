import { Stack } from "expo-router"

export default function MainLayout(){
    return(
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgotPassword" />      
      <Stack.Screen name="tabs" /> 
    </Stack>
              
    )
}