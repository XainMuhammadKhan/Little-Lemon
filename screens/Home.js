import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories } from '../database';
import Filters from '../components/Filters';

const sections = ['starters', 'mains', 'desserts', 'drinks'];

const Home = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [initials, setInitials] = useState('');
  
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');
  const [filterSelections, setFilterSelections] = useState(sections.map(() => false));
  const isMounted = useRef(false);

  useEffect(() => {
    loadAvatar();
    loadMenu();
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      (async () => {
        try {
          const db = await getDBConnection();
          const activeCategories = sections.filter((s, i) => filterSelections[i]);
          const filteredMenu = await filterByQueryAndCategories(db, query, activeCategories);
          setData(filteredMenu);
        } catch (e) {
          Alert.alert("Error", e.message);
        }
      })();
    } else {
      isMounted.current = true;
    }
  }, [query, filterSelections]);

  const loadAvatar = async () => {
    try {
      const storedAvatar = await AsyncStorage.getItem('avatar');
      const firstName = await AsyncStorage.getItem('firstName') || '';
      const lastName = await AsyncStorage.getItem('lastName') || '';
      
      setAvatar(storedAvatar);
      setInitials((firstName.charAt(0) + lastName.charAt(0)).toUpperCase());
    } catch (e) {
      console.error(e);
    }
  };

  const loadMenu = async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      let menuItems = await getMenuItems(db);

      if (!menuItems.length) {
        const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
        const json = await response.json();
        menuItems = json.menu;
        await saveMenuItems(db, menuItems);
      }
      
      setData(menuItems);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message);
    }
  };

  const handleSearchChange = (text) => {
    setSearchBarText(text);
  };

  // Debounce logic for the search bar
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQuery(searchBarText);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchBarText]);

  const handleFiltersChange = (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  const renderItem = ({ item }) => {
    const imageUrl = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
        <Image source={{ uri: imageUrl }} style={styles.itemImage} />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Image 
          style={styles.headerLogo}
          source={{ uri: 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/LittleLemonLogo.png' }}
        />
        <Pressable onPress={() => navigation.navigate('Profile')}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <Text style={styles.heroSubtitle}>Chicago</Text>
        <View style={styles.heroContent}>
          <Text style={styles.heroDescription}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
          <Image 
            source={{ uri: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/grilledFish.jpg?raw=true' }} 
            style={styles.heroImage} 
          />
        </View>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            style={styles.searchInput}
            value={searchBarText}
            onChangeText={handleSearchChange}
            placeholder="Search..."
            placeholderTextColor="#777"
          />
        </View>
      </View>

      <Text style={styles.title}>ORDER FOR DELIVERY!</Text>
      
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections.map(s => s.charAt(0).toUpperCase() + s.slice(1))}
      />

      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  },
  headerLogo: {
    width: 150,
    height: 40,
    resizeMode: 'contain',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#62d6c4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroBanner: {
    backgroundColor: '#495e57',
    padding: 20,
  },
  heroTitle: {
    color: '#f4ce14',
    fontSize: 36,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroDescription: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginRight: 20,
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  itemTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495e57',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default Home;
