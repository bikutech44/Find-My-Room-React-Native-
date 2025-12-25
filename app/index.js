import { View, Text, StyleSheet, Image, Button, ActivityIndicator, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Index() {
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    const minSplashTimePromise = new Promise(resolve => setTimeout(resolve, 3000));

    // Create a promise that resolves when Firebase has checked the auth state.
    const authCheckPromise = new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        // We resolve the promise with the user object and unsubscribe.
        unsubscribe();
        resolve(user);
      });
    });

    // Use Promise.all to wait for both promises to complete.
    Promise.all([minSplashTimePromise, authCheckPromise])
      .then(([_, user]) => {
        if (user) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('./login');
        }
        setAuthChecked(true);
      });

  }, []);

  useEffect(() => {
    if (authChecked) {
      SplashScreen.hideAsync();
    }
  }, [authChecked]);

  if (!authChecked) {
    return (
      <View style={styles.container}>
        <Image
          source={require('./../assets/splash.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
        <Text style={[styles.btnText, { paddingBottom: insets.bottom }]}>
          A project work by team BNB.
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  splashImage: {
    backgroundColor: '#d7ebf5',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  btnText: {
    marginBottom: Platform.OS === 'ios'? 2 : 8,
    color: '#00315e',
    fontWeight: 'bold',
    fontSize: Platform.OS === "ios" ? 16.8 : 12.6,
    letterSpacing: 0.02,
  },
});
