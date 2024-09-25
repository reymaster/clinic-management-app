import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type DefaultAppBarProps = {
  user: { name: string; greeting: string };
  avatarUrl: string;
  navigation: StackNavigationProp<RootStackParamList, 'Dashboard'>;
};

const DefaultAppBar: React.FC<DefaultAppBarProps> = ({ user, avatarUrl, navigation }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View>
          <Text style={styles.greeting}>{user.greeting},</Text>
          <Text style={styles.username}>{user.name}</Text>
        </View>
      </View>

      {/* Ícones à direita */}
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Feedback')}>
          <FontAwesome name='comment-o' size={24} color='black' style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name='ellipsis-vertical' size={24} color='black' style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between', // Garantir que os ícones fiquem à direita
    alignItems: 'center',
    marginBottom: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 14,
    color: '#888',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row', // Organiza os ícones horizontalmente
    alignItems: 'center',
  },
  icon: {
    marginLeft: 15, // Espaçamento entre os ícones
  },
});

export default DefaultAppBar;
