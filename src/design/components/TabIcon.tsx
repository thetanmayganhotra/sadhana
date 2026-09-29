import { StyleSheet, View, type ColorValue } from 'react-native';

export type TabIconName = 'today' | 'practice' | 'learn' | 'journey';

const LINE = 1.25;

/** Thin line-work tab icons (placeholder until an icon set is drawn). */
export function TabIcon({ name, color }: { name: TabIconName; color: ColorValue }) {
  switch (name) {
    case 'today': // sun disc with bindu
      return (
        <View style={[styles.circle, { borderColor: color }]}>
          <View style={[styles.bindu, { backgroundColor: color }]} />
        </View>
      );
    case 'practice': // lotus: three petals
      return (
        <View style={styles.lotus}>
          {[-35, 0, 35].map((deg) => (
            <View
              key={deg}
              style={[styles.petal, { borderColor: color, transform: [{ rotate: `${deg}deg` }] }]}
            />
          ))}
        </View>
      );
    case 'learn': // palm-leaf manuscript
      return (
        <View style={[styles.leaf, { borderColor: color }]}>
          <View style={[styles.leafHole, { borderColor: color }]} />
        </View>
      );
    case 'journey': // path of three steps
      return (
        <View style={styles.path}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.step, { borderColor: color, opacity: 0.45 + i * 0.27 }]} />
          ))}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: LINE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bindu: { width: 4, height: 4, borderRadius: 2 },
  lotus: { width: 24, height: 20, alignItems: 'center', justifyContent: 'flex-end' },
  petal: {
    position: 'absolute',
    bottom: 1,
    width: 8,
    height: 17,
    borderRadius: 8,
    borderWidth: LINE,
    transformOrigin: 'bottom',
  },
  leaf: {
    width: 24,
    height: 12,
    borderRadius: 6,
    borderWidth: LINE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafHole: { width: 3, height: 3, borderRadius: 1.5, borderWidth: 1 },
  path: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 20 },
  step: { width: 5, height: 5, borderRadius: 2.5, borderWidth: LINE },
});
