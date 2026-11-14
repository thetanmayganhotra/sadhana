import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../theme';
import { motion } from '../tokens';

const PETALS = 16;
const HAIR = StyleSheet.hairlineWidth * 2;
const breathEasing = Easing.bezier(...motion.easing.breath);

/**
 * PLACEHOLDER LINE-ART: a simple yantra — an outer ring, a sixteen-petal lotus, an eight-pointed
 * star (two squares), an inner ring and the bindu, each in its own pigment over a soft glow.
 * Built from plain Views so it needs no SVG library; commissioned art replaces it.
 *
 * Motion is deliberately almost imperceptible: the figure breathes by ±1% and the glow warms
 * slightly, one breath ≈ 12 s. Nothing rotates. Reduce Motion: fully static.
 */
export function Yantra({ size = 220 }: { size?: number }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const breath = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    breath.value = withRepeat(
      withTiming(1, { duration: motion.duration.breath, easing: breathEasing }),
      -1,
      true,
    );
  }, [reduceMotion, breath]);

  const breathing = useAnimatedStyle(() => ({
    transform: [{ scale: 0.99 + breath.value * 0.02 }],
  }));
  const wash = useAnimatedStyle(() => ({
    opacity: 0.8 + breath.value * 0.2,
  }));

  const y = colors.yantra;
  const c = size / 2;
  const ring = (d: number, color: string) => (
    <View
      style={[
        styles.abs,
        {
          width: d,
          height: d,
          left: c - d / 2,
          top: c - d / 2,
          borderRadius: d / 2,
          borderWidth: HAIR,
          borderColor: color,
        },
      ]}
    />
  );

  const petal = size * 0.12; // diagonal ≈ 0.17: spans r 0.30–0.47
  const sq = size * 0.38; // corners reach r≈0.27, inside the r=0.30 ring
  const glow = size * 1.02;

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: size, height: size }, breathing]}
    >
      <Animated.View
        style={[
          styles.abs,
          {
            width: glow,
            height: glow,
            left: c - glow / 2,
            top: c - glow / 2,
            borderRadius: glow / 2,
            backgroundColor: y.glowA,
          },
          wash,
        ]}
      />

      {ring(size * 0.94, y.outer)}

      {Array.from({ length: PETALS }, (_, i) => (
        // A petal: a square with two opposite corners fully rounded, turned so the sharp tips
        // point along the radius.
        <View
          key={i}
          style={[
            styles.abs,
            {
              width: petal,
              height: petal,
              left: c - petal / 2,
              top: c - petal / 2,
              borderTopLeftRadius: petal,
              borderBottomRightRadius: petal,
              borderWidth: HAIR * 1.25,
              borderColor: i % 2 === 0 ? y.petalA : y.petalB,
              transform: [
                { rotate: `${(360 / PETALS) * i}deg` },
                { translateY: -size * 0.385 },
                { rotate: '-45deg' },
              ],
            },
          ]}
        />
      ))}

      {ring(size * 0.6, y.middle)}

      {[0, 45].map((deg) => (
        <View
          key={deg}
          style={[
            styles.abs,
            {
              width: sq,
              height: sq,
              left: c - sq / 2,
              top: c - sq / 2,
              borderWidth: HAIR,
              borderColor: y.star,
              transform: [{ rotate: `${deg}deg` }],
            },
          ]}
        />
      ))}

      {ring(size * 0.22, y.inner)}
      <View
        style={[
          styles.abs,
          {
            width: 6,
            height: 6,
            left: c - 3,
            top: c - 3,
            borderRadius: 3,
            backgroundColor: y.bindu,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  abs: { position: 'absolute' },
});
