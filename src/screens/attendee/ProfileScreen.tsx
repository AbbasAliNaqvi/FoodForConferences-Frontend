import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const avatarUrl = 'https://avatar.iran.liara.run/public';

  // Random mobile number generator
  const generateRandomNumber = () => {
    const prefix = ['987', '991', '980', '876', '912'][Math.floor(Math.random() * 5)];
    const suffix = Math.floor(1000000 + Math.random() * 9000000);
    return `${prefix}${suffix}`;
  };

  const randomMobile = generateRandomNumber();

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </LinearGradient>

      {/* Animated Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>

        {/* Profile Info Card */}
        <View style={styles.card}>
          <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.role}>{user?.role || 'Student Member'}</Text>

          <View style={styles.infoBlock}>
            <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
            <Text style={styles.infoText}>{user?.email || 'example@email.com'}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Ionicons name="call-outline" size={20} color={COLORS.gray} />
            <Text style={styles.infoText}>+91 {randomMobile}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.logoutGradient}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.light} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 170,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  headerTitle: {
    ...FONTS.h1,
    color: COLORS.light,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: -SIZES.padding,
  },
  avatarContainer: {
    marginTop: -70,
    borderRadius: 100,
    padding: 5,
    backgroundColor: COLORS.light,
    elevation: 5,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  card: {
    width: width * 0.9,
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
    alignItems: 'center',
    shadowColor: COLORS.dark,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.dark,
    marginBottom: 4,
  },
  role: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginBottom: SIZES.base * 2,
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: SIZES.radius,
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  infoText: {
    ...FONTS.body3,
    color: COLORS.dark,
    marginLeft: 8,
  },
  logoutButton: {
    marginTop: SIZES.padding * 2,
    width: width * 0.6,
    borderRadius: SIZES.radius * 2,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding1,
    borderRadius: SIZES.radius * 2,
    gap: 8,
  },
  logoutButtonText: {
    ...FONTS.h3,
    color: COLORS.light,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
