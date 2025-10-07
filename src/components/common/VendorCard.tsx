import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

interface VendorCardProps {
  vendor: {
    name: string;
    rating: number;
    cuisine: string;
    logoUrl?: string;
  };
}

const VendorCard = ({ vendor }: VendorCardProps) => (
  <TouchableOpacity style={styles.card}>
    <Image
      source={{
        uri:
          vendor.logoUrl ||
          `https://ui-avatars.com/api/?name=${vendor.name}&background=D8C9AE&color=575757`,
      }}
      style={styles.logo}
    />
    <Text style={styles.name} numberOfLines={1}>
      {vendor.name}
    </Text>
    <View style={styles.ratingContainer}>
      <Icon name="star" color="#465860ff" size={16} />
      <Text style={styles.ratingText}>{vendor.rating.toFixed(1)}</Text>
    </View>
    <Text style={styles.cuisine}>{vendor.cuisine}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 185,
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius * 1.2,
    marginRight: SIZES.padding1,
    padding: SIZES.padding / 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.07,
    // shadowRadius: 10,
    elevation: 2,
    marginBottom:5,
  },
  logo: { width: 90, height: 80, borderRadius: 13, marginBottom: SIZES.base },
  name: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  ratingText: {
    ...FONTS.body4,
    color: COLORS.dark,
    marginLeft: 4,
    fontWeight: '600',
    
  },
  cuisine: { ...FONTS.body4, color: COLORS.gray },
});

export default VendorCard;
