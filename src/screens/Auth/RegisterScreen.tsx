import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { register } from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker'; 


type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};
type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('attendee'); // Default role
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    try {
      await register(name.trim(), email.trim(), password.trim(), role);
      Alert.alert(
        'Success', 
        'Your account has been created. Please log in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start your journey with us</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={COLORS.gray}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={COLORS.gray}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <Text style={styles.pickerLabel}>I am a...</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Conference Attendee" value="attendee" />
              <Picker.Item label="Food Vendor" value="vendor" />
              <Picker.Item label="Event Organizer" value="organizer" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={COLORS.light} />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.footerText, styles.linkText]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Re-using most styles from LoginScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  inputContainer: {
    marginBottom: SIZES.padding,
  },
  input: {
    backgroundColor: COLORS.light,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.75,
    borderRadius: SIZES.radius,
    ...FONTS.body3,
    color: COLORS.dark,
    marginBottom: SIZES.padding * 0.75,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerLabel: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginLeft: SIZES.base,
    marginBottom: SIZES.base,
  },
  pickerContainer: {
      backgroundColor: COLORS.light,
      borderRadius: SIZES.radius,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      justifyContent: 'center',
  },
  picker: {
    color: COLORS.dark,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding * 0.85,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.base,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.light,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.padding,
    paddingBottom: SIZES.padding
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;