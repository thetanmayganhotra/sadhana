import { useEffect, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '../tokens';

const enterEasing = Easing.bezier(...motion.easing.enter);

/** Calm entrance: a plain fade, no movement. `index` staggers siblings slightly. */
export function FadeIn({
  index = 0,
  children,
  style,
}: {
  index?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * motion.stagger,
      withTiming(1, { duration: motion.duration.enter, easing: enterEasing }),
    );
  }, [index, progress]);

  const animated = useAnimatedStyle(() => ({ opacity: progress.value }));

  return <Animated.View style={[animated, style]}>{children}</Animated.View>;
}
