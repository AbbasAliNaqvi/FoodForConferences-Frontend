import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

interface Props {
  item: { icon: string; title: string; description: string };
  index: number;
  scrollX: Animated.SharedValue<number>;
}

const FeatureSlide = ({ item, index, scrollX }: Props) => {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width * 0.75;

  // Har item ke liye, uski position ke hisaab se animation style calculate hogi
  const animatedStyle = useAnimatedStyle(() => {
    // Input range define karta hai ki card kab left, center, ya right mein hoga
    const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH];

    // Card jab center mein ho (scale: 1), to bada dikhega, side mein (scale: 0.8) chhota
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], 'clamp');
    
    // Center mein full opacity, sides mein faded
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], 'clamp');
    
    // Sides pe card thoda rotate hoga for a 3D effect
    const rotateY = interpolate(scrollX.value, inputRange, [30, 0, -30], 'clamp');

    return {
      opacity,
      transform: [{ scale }, { rotateY: `${rotateY}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.card, { width: CARD_WIDTH }, animatedStyle]}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={48} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 250,
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    marginHorizontal: SIZES.base,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.secondary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  description: {
    ...FONTS.body4,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FeatureSlide;