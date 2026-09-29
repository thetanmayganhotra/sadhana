import { useEffect, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '../tokens';

const enterEasing = Easing.bezier(...motion.easing.enter);

/**
 * Calm entrance: fades in while drifting up a few points. `index` staggers siblings.
 * With Reduce Motion on, it only fades.
 */
export function FadeIn({
  index = 0,
  children,
  style,
}: {
  index?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * motion.stagger,
      withTiming(1, { duration: motion.duration.enter, easing: enterEasing }),
    );
  }, [index, progress]);

  const animated = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: reduceMotion ? [] : [{ translateY: (1 - progress.value) * 10 }],
  }));

  return <Animated.View style={[animated, style]}>{children}</Animated.View>;
}
