import { Stack } from 'expo-router';
import { useNavigationState } from '@react-navigation/native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade', cardStyle: { backgroundColor: '#d7ebf5' }, }} />
      <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_left',  cardStyle: { backgroundColor: '#d7ebf5' }, }} />
      <Stack.Screen name="register" options={{ headerShown: false, animation: 'slide_from_right', cardStyle: { backgroundColor: '#d7ebf5' },  }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_right', }} />
      <Stack.Screen name="room/details" options={{ headerShown: false, animation: 'slide_from_right', }} />
      <Stack.Screen name="profileComponents/TermsCondition" options={{ headerShown: false, animation: 'slide_from_right', }} />
      <Stack.Screen name="profileComponents/PrivacyPolicies" options={{ headerShown: false, animation: 'slide_from_right', }} />
      <Stack.Screen name="profileComponents/AboutUs" options={{ headerShown: false, animation: 'slide_from_right', }} />
      <Stack.Screen name="profileComponents/Setting" options={{ headerShown: false, animation: 'slide_from_right', }} />
    </Stack>
  );
}