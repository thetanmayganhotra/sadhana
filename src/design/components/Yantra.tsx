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
 * PLACEHOLDER LINE-ART: a simple yantra, each layer in its own pigment over a soft dawn glow — outer rings, a sixteen-petal lotus, an eight-pointed
 * star (two squares), an inner ring and the bindu. Built from plain Views so it needs no SVG
 * library; commissioned art replaces it.
 *
 * Motion: the whole figure breathes (slow scale in/out, one breath ≈ 10 s), the lotus drifts
 * round very slowly, and the bindu glows with the breath. Reduce Motion: static.
 */
export function Yantra({ size = 220 }: { size?: number }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const breath = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    breath.value = withRepeat(
      withTiming(1, { duration: motion.duration.breath, easing: breathEasing }),
      -1,
      true,
    );
    drift.value = withRepeat(
      withTiming(1, { duration: motion.duration.drift, easing: Easing.linear }),
      -1,
      false,
    );
  }, [reduceMotion, breath, drift]);

  const breathing = useAnimatedStyle(() => ({
    transform: [{ scale: 0.965 + breath.value * 0.05 }],
  }));
  const drifting = useAnimatedStyle(() => ({
    transform: [{ rotate: `${drift.value * 360}deg` }],
  }));
  const counterDrift = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-drift.value * 180}deg` }],
  }));
  const wash = useAnimatedStyle(() => ({
    opacity: 0.75 + breath.value * 0.25,
  }));
  const glow = useAnimatedStyle(() => ({
    opacity: 0.55 + breath.value * 0.45,
    transform: [{ scale: 0.85 + breath.value * 0.3 }],
  }));

  const y = colors.yantra;
  const c = size / 2;
  const ring = (d: number, color: string, opacity = 1) => (
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
          opacity,
        },
      ]}
    />
  );

  // Petals sit in the band between the inner ring (r=0.30) and the outer ring (r=0.47).
  const petal = size * 0.12; // diagonal ≈ 0.17: spans r 0.30–0.47
  const sq = size * 0.38; // corners reach r≈0.27, inside the r=0.30 ring

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: size, height: size }, breathing]}
    >
      {/* Dawn glow: two soft overlapping washes behind the figure, brightening with the breath. */}
      <Animated.View style={[StyleSheet.absoluteFill, wash]}>
        <View
          style={[
            styles.abs,
            {
              width: size * 1.05,
              height: size * 1.05,
              left: c - size * 0.6,
              top: c - size * 0.6,
              borderRadius: size,
              backgroundColor: y.glowA,
            },
          ]}
        />
        <View
          style={[
            styles.abs,
            {
              width: size * 0.95,
              height: size * 0.95,
              left: c - size * 0.4,
              top: c - size * 0.38,
              borderRadius: size,
              backgroundColor: y.glowB,
              opacity: 0.85,
            },
          ]}
        />
      </Animated.View>

      {ring(size, y.outer, 0.35)}
      {ring(size * 0.94, y.outer)}

      <Animated.View style={[StyleSheet.absoluteFill, drifting]}>
        {Array.from({ length: PETALS }, (_, i) => (
          // A leaf/petal: a square with two opposite corners fully rounded, turned -45° so the
          // sharp tips point along the radius.
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
      </Animated.View>

      {ring(size * 0.6, y.middle)}

      <Animated.View style={[StyleSheet.absoluteFill, counterDrift]}>
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
      </Animated.View>

      {ring(size * 0.22, y.inner)}
      <Animated.View
        style={[
          styles.abs,
          {
            width: 8,
            height: 8,
            left: c - 4,
            top: c - 4,
            borderRadius: 4,
            backgroundColor: y.bindu,
          },
          glow,
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  abs: { position: 'absolute' },
});
