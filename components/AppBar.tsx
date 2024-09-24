import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

type AppBarProps = {
  title: string;
};

const AppBar: React.FC<AppBarProps> = ({ title }) => {
  return (
    <View style={styles.appBar}>
      <StatusBar barStyle='light-content' backgroundColor='#000' />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    height: 60,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight, // Ajuste para evitar sobreposição em alguns dispositivos
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AppBar;
