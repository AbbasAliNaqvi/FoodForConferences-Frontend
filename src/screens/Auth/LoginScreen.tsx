import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { login } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

interface Props {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any>;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const handleLogin = async () => {
  console.log("Logging in with:", { email, password }); // Log to check if email and password are correct

  try {
    const res = await login(email, password);
    await AsyncStorage.setItem('token', res.data.token);
    Alert.alert('Login Success', `Welcome ${res.data.user.name}`);
    navigation.replace('Main');
  } catch (err: any) {
    console.error("Login error: ", err.response); // Log full error response for better debugging
    Alert.alert('Login Failed', err.response?.data?.message || 'Something went wrong');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Text style={{ marginTop: 10 }} onPress={() => navigation.navigate('Register')}>
        Don't have account? Register
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});

export default LoginScreen;
