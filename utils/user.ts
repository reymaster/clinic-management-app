import AsyncStorage from '@react-native-async-storage/async-storage';
import * as jwt from 'jwt-decode';

export const userInfo = async () => {
  const token = await AsyncStorage.getItem('userToken');

  let decodedToken: any = null;

  if (token) {
    decodedToken = jwt.jwtDecode(token);
  }

  return decodedToken;
};

export const getUserName = async () => {
  const user = await userInfo();
  console.log(user);
  return user.name;
};

export const selectGreetings = (hour: number) => {
  if (hour >= 0 && hour < 12) {
    return 'Bom dia';
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
};
