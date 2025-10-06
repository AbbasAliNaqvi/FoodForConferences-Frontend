import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { COLORS } from '../../constants/theme';

interface Props {
  data: any[];
  scrollX: Animated.SharedValue<number>;
}

const Paginator = ({ data, scrollX }: Props) => {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width * 0.75;

  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        // Dot ki width aur color scroll position ke basis pe change hogi
        const animatedStyle = useAnimatedStyle(() => {
          const inputRange = [(i - 1) * CARD_WIDTH, i * CARD_WIDTH, (i + 1) * CARD_WIDTH];
          
          const dotWidth = interpolate(scrollX.value, inputRange, [8, 24, 8], 'clamp');
          const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], 'clamp');

          return { width: dotWidth, opacity };
        });

        return <Animated.View key={i.toString()} style={[styles.dot, animatedStyle]} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 4,
  },
});

export default Paginator;