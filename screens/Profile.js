import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';

const Checkbox = ({ label, value, onValueChange }) => (
  <Pressable style={styles.checkboxContainer} onPress={() => onValueChange(!value)}>
    <View style={[styles.checkbox, value && styles.checkboxSelected]}>
      {value && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </Pressable>
);

const Profile = ({ logout }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatar, setAvatar] = useState(null);
  
  const [orderStatuses, setOrderStatuses] = useState(false);
  const [passwordChanges, setPasswordChanges] = useState(false);
  const [specialOffers, setSpecialOffers] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedFirstName = await AsyncStorage.getItem('firstName');
      const storedLastName = await AsyncStorage.getItem('lastName');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPhone = await AsyncStorage.getItem('phoneNumber');
      const storedAvatar = await AsyncStorage.getItem('avatar');
      
      const storedOrderStatuses = await AsyncStorage.getItem('orderStatuses');
      const storedPasswordChanges = await AsyncStorage.getItem('passwordChanges');
      const storedSpecialOffers = await AsyncStorage.getItem('specialOffers');
      const storedNewsletter = await AsyncStorage.getItem('newsletter');

      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhone) setPhoneNumber(storedPhone);
      if (storedAvatar) setAvatar(storedAvatar);
      
      setOrderStatuses(storedOrderStatuses === 'true');
      setPasswordChanges(storedPasswordChanges === 'true');
      setSpecialOffers(storedSpecialOffers === 'true');
      setNewsletter(storedNewsletter === 'true');
    } catch (e) {
      console.error(e);
    }
  };

  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
      if (avatar) {
        await AsyncStorage.setItem('avatar', avatar);
      } else {
        await AsyncStorage.removeItem('avatar');
      }
      
      await AsyncStorage.setItem('orderStatuses', orderStatuses ? 'true' : 'false');
      await AsyncStorage.setItem('passwordChanges', passwordChanges ? 'true' : 'false');
      await AsyncStorage.setItem('specialOffers', specialOffers ? 'true' : 'false');
      await AsyncStorage.setItem('newsletter', newsletter ? 'true' : 'false');
      
      Alert.alert("Success", "Profile saved successfully!");
    } catch (e) {
      console.error(e);
    }
  };

  const discardChanges = () => {
    loadProfileData();
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const getInitials = () => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.backButtonPlaceholder}>
          <Text style={styles.backIcon}>←</Text>
        </View>
        <Image 
          style={styles.headerLogo}
          source={{ uri: 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/LittleLemonLogo.png' }}
        />
        <View style={styles.headerAvatarPlaceholder}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.smallAvatar} />
          ) : (
            <View style={styles.smallAvatarFallback}>
              <Text style={styles.smallAvatarText}>{getInitials()}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Personal information</Text>
        
        <Text style={styles.label}>Avatar</Text>
        <View style={styles.avatarSection}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
          )}
          <Pressable style={styles.changeButton} onPress={pickImage}>
            <Text style={styles.changeButtonText}>Change</Text>
          </Pressable>
          <Pressable style={styles.removeButton} onPress={() => setAvatar(null)}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>First name</Text>
        <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

        <Text style={styles.label}>Last name</Text>
        <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Phone number</Text>
        <MaskedTextInput
          mask="(999) 999-9999"
          value={phoneNumber}
          onChangeText={(text, rawText) => setPhoneNumber(text)}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionTitle}>Email notifications</Text>
        
        <Checkbox label="Order statuses" value={orderStatuses} onValueChange={setOrderStatuses} />
        <Checkbox label="Password changes" value={passwordChanges} onValueChange={setPasswordChanges} />
        <Checkbox label="Special offers" value={specialOffers} onValueChange={setSpecialOffers} />
        <Checkbox label="Newsletter" value={newsletter} onValueChange={setNewsletter} />

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </Pressable>

        <View style={styles.bottomButtons}>
          <Pressable style={styles.discardButton} onPress={discardChanges}>
            <Text style={styles.discardButtonText}>Discard changes</Text>
          </Pressable>
          <Pressable style={styles.saveButton} onPress={saveProfileData}>
            <Text style={styles.saveButtonText}>Save changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#495e57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerLogo: {
    width: 150,
    height: 40,
    resizeMode: 'contain',
  },
  headerAvatarPlaceholder: {
    width: 40,
    height: 40,
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  smallAvatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#62d6c4', // turquoise matching figma
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#62d6c4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  changeButton: {
    backgroundColor: '#495e57',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 15,
  },
  changeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#495e57',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#495e57',
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#495e57',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#495e57',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333333',
  },
  logoutButton: {
    backgroundColor: '#f4ce14',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  discardButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#495e57',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  discardButtonText: {
    color: '#495e57',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#495e57',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
