import { StyleSheet, View } from 'react-native';

import { pigments } from '../tokens';

/**
 * PLACEHOLDER ILLUSTRATION built from plain shapes: a jharokha (arched window) framing a
 * sunrise over rolling hills. The commissioned miniature-style art replaces this.
 */
export function ArchScene({ width = 132 }: { width?: number }) {
  const height = width * 1.25;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.frame,
        {
          width: width + 12,
          height: height + 12,
          borderTopLeftRadius: (width + 12) / 2,
          borderTopRightRadius: (width + 12) / 2,
        },
      ]}
    >
      <View
        style={[
          styles.arch,
          { width, height, borderTopLeftRadius: width / 2, borderTopRightRadius: width / 2 },
        ]}
      >
        <View
          style={[
            styles.sun,
            {
              width: width * 0.42,
              height: width * 0.42,
              borderRadius: width,
              left: width * 0.29,
              top: height * 0.3,
            },
          ]}
        />
        <View
          style={[
            styles.hill,
            {
              backgroundColor: pigments.peacock,
              width: width * 1.3,
              height: width * 1.3,
              left: -width * 0.55,
              top: height * 0.62,
            },
          ]}
        />
        <View
          style={[
            styles.hill,
            {
              backgroundColor: pigments.malachite,
              width: width * 1.2,
              height: width * 1.2,
              left: width * 0.2,
              top: height * 0.7,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: pigments.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  arch: {
    backgroundColor: pigments.rose,
    overflow: 'hidden',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  sun: { position: 'absolute', backgroundColor: pigments.marigold },
  hill: { position: 'absolute', borderRadius: 999 },
});
