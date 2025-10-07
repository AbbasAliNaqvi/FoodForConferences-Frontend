import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { MenuItem } from '../../types';

type Vendor = any;

interface Props {
  item: MenuItem;
  title: string;
  name: Vendor;
  onPress: () => void;
}

const FeaturedItemCard = ({ item, title ,name, onPress }: Props) => {
  const slideAnim = useRef(new Animated.Value(0)).current; 

  const startCardMovement = () => {
    slideAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 15, 
          duration: 2000, 
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -5,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1, // Loop indefinitely
      }
    ).start();
  };

  useEffect(() => {

    startCardMovement();
  
    return () => slideAnim.stopAnimation();
  }, [slideAnim]);

  const placeholderUrl = `https://placehold.co/600x400/${COLORS.primary.substring(1)}/${COLORS.secondary.substring(1)}?text=${item.name.split(' ').join('+')}`;

  const itemPrice = item.price ? `₹${item.price.toFixed(2)}` : 'N/A'
  
  const animatedStyle = {
    transform: [{ translateX: slideAnim }],
  };

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity style={styles.touchableArea} onPress={onPress}>
        <Image source={{ uri: item.imageUrl || placeholderUrl }} style={styles.image} />
        <View style={styles.infoBox}>
          <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.vendor} numberOfLines={1}>{ item.description || 'Vendor'}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
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

  touchableArea: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
  },
  infoBox: {
    padding: SIZES.base * 1.5,
  },
  title: {
    // ...FONTS.h3,
    color: COLORS.dark,
    fontWeight: '600',
    fontSize: 15,
  },
  vendor: {
    // ...FONTS.body4,
    color: COLORS.gray,
    marginVertical: 2,
  },
  price: {
    // ...FONTS.body3,
    color: COLORS.secondary,
    fontWeight: '700',
    marginTop: SIZES.base,
  },
});

export default FeaturedItemCard;