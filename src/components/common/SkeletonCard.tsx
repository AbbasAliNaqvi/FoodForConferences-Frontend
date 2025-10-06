
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/theme';

const SKELETON_COLOR_1 = '#E1E9EE';
const SKELETON_COLOR_2 = '#F2F8FC';

interface Props {
  width: number;
  height: number;
}

const SkeletonCard = ({ width, height }: Props) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [SKELETON_COLOR_1, SKELETON_COLOR_2]
    );
    return { backgroundColor };
  });

  return <Animated.View style={[{ width, height }, styles.skeleton, animatedStyle]} />;
};

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 16,
    marginRight: 16,
  },
});

export default SkeletonCard;