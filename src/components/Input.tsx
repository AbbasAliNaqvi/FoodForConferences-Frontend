import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (val: string) => void;
  secureTextEntry?: boolean;
  label?: string;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChangeText, secureTextEntry, label }) => {
  return (
    <View style={{ marginVertical: 5 }}>
      {label && <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});

export default Input;
