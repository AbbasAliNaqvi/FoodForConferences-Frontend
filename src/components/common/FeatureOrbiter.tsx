import React,{   useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { HOW_IT_WORKS_DATA } from '../../components/mockData';

const Step = ({ item, index, progress }: { item: any, index: number, progress: Animated.SharedValue<number> }) => {
  // Har step ke liye alag animation style
  const animatedStyle = useAnimatedStyle(() => {
    // Animation 3 parts mein hoga: 0->0.33, 0.33->0.66, 0.66->1
    const inputRange = [index * 0.33 - 0.33, index * 0.33, index * 0.33 + 0.33];
    
    // Jab step ka number aayega, tabhi scale up and fade in hoga
    const scale = interpolate(progress.value, inputRange, [0.7, 1, 1], 'clamp');
    const opacity = interpolate(progress.value, inputRange, [0.3, 1, 1], 'clamp');

    return { opacity, transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.stepContainer, animatedStyle]}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={32} color={COLORS.primary} />
      </View>
      <Text style={styles.stepTitle}>{item.title}</Text>
      <Text style={styles.stepDescription}>{item.description}</Text>
    </Animated.View>
  );
};

const Line = ({ progress, start, end }: { progress: Animated.SharedValue<number>, start: number, end: number }) => {
  // Steps ke beech mein line animate hogi
  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [start, end], [0, 100], 'clamp');
    return { width: `${width}%` };
  });
  return (
    <View style={styles.line}>
      <Animated.View style={[styles.lineFill, animatedStyle]} />
    </View>
  );
};

const FeatureStepper = () => {
  const animationProgress = useSharedValue(0);

  const startAnimation = () => {
    animationProgress.value = 0; // Reset karunga
    // Phir animation ko start karunga with a delay
    animationProgress.value = withDelay(400, withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }));
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.stepperContainer}>
            <Step item={HOW_IT_WORKS_DATA[0]} index={0} progress={animationProgress} />
            <Line progress={animationProgress} start={0.2} end={0.5} />
            <Step item={HOW_IT_WORKS_DATA[1]} index={1} progress={animationProgress} />
            <Line progress={animationProgress} start={0.5} end={0.8} />
            <Step item={HOW_IT_WORKS_DATA[2]} index={2} progress={animationProgress} />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 2,
    alignItems: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    width: SIZES.width / 4,
    marginHorizontal: SIZES.base / 2,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding1,
    borderWidth: 0,
    borderColor: `${COLORS.primary}30`,
  },
  stepTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.base,
    fontSize: 15,
  },
  stepDescription: {
    ...FONTS.body4,
    color: COLORS.gray,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.primary,
    marginTop: 34, // icon height / 2 - line height / 2
  },
  lineFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  replayButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SIZES.padding * 2,
      backgroundColor: `${COLORS.primary}20`,
      paddingHorizontal: SIZES.padding,
      paddingVertical: SIZES.base,
      borderRadius: SIZES.radius,
  },
  replayText: {
      ...FONTS.body4,
      color: COLORS.secondary,
      fontWeight: '600',
      marginLeft: SIZES.base,
  }
});

export default FeatureStepper;