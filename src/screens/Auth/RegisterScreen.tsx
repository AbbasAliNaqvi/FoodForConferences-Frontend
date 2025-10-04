import React, { useState } from 'react';
import { View, Text, Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { register } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // Correct Picker import

type Role = 'attendee' | 'organizer' | 'vendor' | 'staff' | 'admin';

interface Props {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any>;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('attendee');
  const [password, setPassword] = useState('');
  const [key, setKey] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = async () => {
    if (['organizer', 'vendor', 'staff', 'admin'].includes(role) && key !== '1234') {
      return Alert.alert('Invalid Key', 'You must enter the correct key to register for this role.');
    }

    try {
      const res = await register(name, email, password, role);
      await AsyncStorage.setItem('token', res.data.token);
      Alert.alert('Registered', `Welcome ${res.data.user.name}`);
      navigation.replace('Events');
    } catch (err: any) {
      Alert.alert(
        'Registration Failed',
        err.response?.data?.message || 'Something went wrong',
      );
    }
  };

  const handleRoleSelect = (selectedRole: Role) => {
    if (['organizer', 'vendor', 'staff', 'admin'].includes(selectedRole)) {
      setRole(selectedRole);
      setModalVisible(true);
    } else {
      setRole(selectedRole);
    }
  };

  const handleKeyValidation = () => {
    if (key === '1234') {
      setModalVisible(false);
    } else {
      Alert.alert('Invalid Key', 'Please enter the correct key to select this role.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Input placeholder="Name" value={name} onChangeText={setName} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      
      <Text style={styles.label}>Select Role</Text>
      <Picker
        selectedValue={role}
        style={styles.input}
        onValueChange={handleRoleSelect}
      >
        <Picker.Item label="Attendee" value="attendee" />
        <Picker.Item label="Organizer" value="organizer" />
        <Picker.Item label="Vendor" value="vendor" />
        <Picker.Item label="Staff" value="staff" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Register" onPress={handleRegister} />

      <Text
        style={{ marginTop: 10, color: '#2D9CDB', textAlign: 'center' }}
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? Login
      </Text>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Key to Confirm Role</Text>
            <Input
              placeholder="Enter Key"
              value={key}
              onChangeText={setKey}
              secureTextEntry
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleKeyValidation}>
              <Text style={styles.modalButtonText}>Validate Key</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#ccc' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#2D9CDB',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default RegisterScreen;
