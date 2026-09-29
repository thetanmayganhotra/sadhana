import { StyleSheet, View, type ColorValue } from 'react-native';

export type TabIconName = 'today' | 'practice' | 'learn' | 'journey';

/** Placeholder geometric tab icons (no icon library yet). */
export function TabIcon({
  name,
  color,
  focused,
}: {
  name: TabIconName;
  color: ColorValue;
  focused: boolean;
}) {
  const fill = focused ? color : 'transparent';
  switch (name) {
    case 'today': // sun
      return (
        <View
          style={[styles.box, { borderColor: color, backgroundColor: fill, borderRadius: 12 }]}
        />
      );
    case 'practice': // arch
      return (
        <View
          style={[
            styles.box,
            {
              borderColor: color,
              backgroundColor: fill,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderRadius: 3,
            },
          ]}
        />
      );
    case 'learn': // manuscript page
      return (
        <View style={[styles.box, styles.page, { borderColor: color, backgroundColor: fill }]}>
          <View style={[styles.line, { backgroundColor: focused ? 'transparent' : color }]} />
        </View>
      );
    case 'journey': // rising steps
      return (
        <View style={styles.steps}>
          {[8, 14, 20].map((h) => (
            <View
              key={h}
              style={[styles.step, { height: h, borderColor: color, backgroundColor: fill }]}
            />
          ))}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  box: { width: 22, height: 22, borderWidth: 2 },
  page: { width: 18, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  line: { width: 8, height: 2, borderRadius: 1 },
  steps: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 22 },
  step: { width: 6, borderWidth: 2, borderRadius: 2 },
});
