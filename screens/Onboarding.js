import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({ onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  // Validate that the first name is not empty and only contains letters (and spaces)
  const isFirstNameValid = firstName.trim().length > 0 && /^[a-zA-Z\s]+$/.test(firstName);
  
  // Basic email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Button disabled if either is invalid
  const isButtonDisabled = !isFirstNameValid || !isEmailValid;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        {/* Placeholder image for logo. Instructions said right, Figma shows left. Assuming left based on Figma. */}
        <Image 
          style={styles.logo}
          accessible={true}
          accessibilityLabel="Little Lemon Logo"
          // If you have a local image, you can use: source={require('../assets/logo.png')}
          source={{ uri: 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/LittleLemonLogo.png' }}
        />
        <Text style={styles.headerText}>LITTLE LEMON</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Let us get to know you</Text>
        
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
          keyboardType="default"
        />
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          disabled={isButtonDisabled}
          onPress={async () => {
            try {
              await AsyncStorage.setItem('isOnboardingCompleted', 'true');
              await AsyncStorage.setItem('firstName', firstName);
              await AsyncStorage.setItem('email', email);
              if (onComplete) {
                onComplete();
              }
            } catch (e) {
              console.error('Error saving onboarding data:', e);
            }
          }}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cbd2d9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dee3e9',
    paddingTop: 60,
    paddingBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#495e57', // brand color
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    color: '#495e57',
    textAlign: 'center',
    marginBottom: 60,
  },
  label: {
    fontSize: 18,
    color: '#495e57',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: '#495e57',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 30,
    fontSize: 18,
    backgroundColor: '#dee3e9',
  },
  footer: {
    backgroundColor: '#f4f4f4',
    padding: 30,
    paddingBottom: 50,
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#cbd2d9',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonDisabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    color: '#495e57',
    fontWeight: 'bold',
  },
});

export default Onboarding;
