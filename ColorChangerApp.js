// ColorChangerApp.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ColorChangerApp() {
  const [bgColor, setBgColor] = useState('#ffffff'); // Default white

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>Color Changer App</Text>
      <View style={styles.buttonGroup}>
        <Button title="White" onPress={() => setBgColor('#ffffff')} />
        <Button title="Light Blue" onPress={() => setBgColor('#add8e6')} />
        <Button title="Light Green" onPress={() => setBgColor('#90ee90')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonGroup: {
    gap: 10,
  },
});
