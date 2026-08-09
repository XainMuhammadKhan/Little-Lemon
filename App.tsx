/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from './screens/Onboarding';
import ProfileScreen from './screens/Profile';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/Home';

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  
  const [state, setState] = useState({
    isLoading: true,
    isOnboardingCompleted: false,
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('isOnboardingCompleted');
        if (value !== null && value === 'true') {
          setState({ isLoading: false, isOnboardingCompleted: true });
        } else {
          setState({ isLoading: false, isOnboardingCompleted: false });
        }
      } catch (e) {
        console.error(e);
        setState({ isLoading: false, isOnboardingCompleted: false });
      }
    };
    checkOnboardingStatus();
  }, []);

  const completeOnboarding = () => {
    setState({ isLoading: false, isOnboardingCompleted: true });
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setState({ isLoading: false, isOnboardingCompleted: false });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent state={state} completeOnboarding={completeOnboarding} logout={logout} />
    </SafeAreaProvider>
  );
}

function AppContent({ state, completeOnboarding, logout }) {
  const safeAreaInsets = useSafeAreaInsets();

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.isOnboardingCompleted ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile">
                {(props) => <ProfileScreen {...props} logout={logout} />}
              </Stack.Screen>
            </>
          ) : (
            <Stack.Screen name="Onboarding">
              {(props) => <OnboardingScreen {...props} onComplete={completeOnboarding} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
