import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { MenuItem } from '../../types';

interface Props {
  item: MenuItem;
  vendorName?: string;
  onPress: () => void;
}

const FeaturedItemCard = ({ item, vendorName, onPress }: Props) => {
  const placeholderUrl = `https://placehold.co/600x400/${COLORS.primary.substring(1)}/${COLORS.secondary.substring(1)}?text=${item.name.split(' ').join('+')}`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.imageUrl || placeholderUrl }} style={styles.image} />
      <View style={styles.infoBox}>
        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.vendor} numberOfLines={1}>{vendorName || 'Featured Vendor'}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SIZES.width * 0.55,
    marginRight: SIZES.base * 2,
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.48,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  image: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
  },
  infoBox: {
    padding: SIZES.base * 1.5,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.dark,
    fontWeight: '600',
    fontSize: 15,
  },
  vendor: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginVertical: 2,
  },
  price: {
    ...FONTS.body3,
    color: COLORS.secondary,
    fontWeight: '700',
    marginTop: SIZES.base,
  },
});

export default FeaturedItemCard;