import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.info}>Name: {user?.name}</Text>
        <Text style={styles.info}>Email: {user?.email}</Text>
        <Text style={styles.info}>Role: {user?.role}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  info: {
    ...FONTS.body3,
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  logoutButton: {
    marginTop: SIZES.padding * 2,
    backgroundColor: COLORS.error,
    paddingVertical: SIZES.padding * 0.75,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
  },
  logoutButtonText: {
    ...FONTS.h3,
    color: COLORS.light,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;