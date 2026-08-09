import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';

const Filters = ({ selections, onChange, sections }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <Pressable
          key={index}
          onPress={() => onChange(index)}
          style={[
            styles.button,
            selections[index] && styles.buttonSelected,
          ]}>
          <Text
            style={[
              styles.text,
              selections[index] && styles.textSelected,
            ]}>
            {section}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#edefee',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 15,
  },
  buttonSelected: {
    backgroundColor: '#495e57',
  },
  text: {
    color: '#495e57',
    fontWeight: 'bold',
  },
  textSelected: {
    color: '#edefee',
  },
});

export default Filters;
