import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

type Props = {
  navigation: ForgotPasswordScreenNavigationProp;
};

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Ação de recuperação de senha
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot password</Text>
      <TextInput style={styles.input} placeholder='Your email id' value={email} onChangeText={setEmail} />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLogin}>Back to login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
  },
  backToLogin: {
    textAlign: 'center',
    color: '#007bff',
  },
});

export default ForgotPasswordScreen;
