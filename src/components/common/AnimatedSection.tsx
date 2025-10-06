import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection = ({ children, delay = 0 }: AnimatedSectionProps) => {
  // Create shared values for opacity and position
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  // Define the animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Trigger the animation when the component mounts
  useEffect(() => {
    // Use withDelay to stagger the animation
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, []);

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default AnimatedSection;