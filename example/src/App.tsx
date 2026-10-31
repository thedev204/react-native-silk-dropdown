import { useRef, useState, type ReactNode } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Dropdown,
  DropdownProvider,
  darkTokens,
  type DropdownOption,
} from 'react-native-silk-dropdown';
import { StatusBar } from 'expo-status-bar';

const countries: DropdownOption[] = [
  { label: '🇨🇦 Canada', value: 'ca' },
  { label: '🇫🇷 France', value: 'fr' },
  { label: '🇩🇪 Germany', value: 'de' },
  { label: '🇮🇳 India', value: 'in' },
  { label: '🇯🇵 Japan', value: 'jp' },
  { label: '🇲🇽 Mexico', value: 'mx' },
  { label: '🇬🇧 United Kingdom', value: 'uk' },
  { label: '🇺🇸 United States', value: 'us' },
];

const users: DropdownOption[] = [
  { label: 'Ada Lovelace', value: 'ada', group: 'Engineering' },
  { label: 'Grace Hopper', value: 'grace', group: 'Engineering' },
  { label: 'Alan Turing', value: 'alan', group: 'Research' },
  { label: 'Katherine Johnson', value: 'kathy', group: 'Research' },
];

const tags: DropdownOption[] = [
  { label: 'Design', value: 'design' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Performance', value: 'perf' },
  { label: 'Accessibility', value: 'a11y' },
  { label: 'Animation', value: 'animation' },
];

type Scene = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
};

const scenes: Scene[] = [
  {
    id: 'popover',
    eyebrow: 'Popover',
    title: 'Searchable picker',
    description:
      'Anchored menu with search, clear, and morph-from-trigger motion.',
  },
  {
    id: 'multi',
    eyebrow: 'Multi-select',
    title: 'Pick several tags',
    description: 'Animated chips, max selection, and a clean clear action.',
  },
  {
    id: 'sheet',
    eyebrow: 'Sheet',
    title: 'Bottom sheet',
    description: 'Full-width sheet that rises from the bottom edge.',
  },
  {
    id: 'motion',
    eyebrow: 'Motion',
    title: 'Transition styles',
    description: 'Fade, slide, or scale — same API, different feel.',
  },
  {
    id: 'custom',
    eyebrow: 'Custom',
    title: 'Your own items',
    description: 'Render any row layout while keeping selection logic.',
  },
];

export default function App() {
  const { width: screenWidth } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const [country, setCountry] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sheetCountry, setSheetCountry] = useState<string | null>(null);
  const [motionPopover, setMotionPopover] = useState<string | null>(null);
  const [motionSheet, setMotionSheet] = useState<string | null>(null);
  const [motionMode, setMotionMode] = useState<'fade' | 'slide' | 'scale'>(
    'scale'
  );

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(scenes.length - 1, next));
    pagerRef.current?.scrollTo({ x: clamped * screenWidth, animated: true });
    setIndex(clamped);
  };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    setIndex(next);
  };

  return (
    <SafeAreaProvider>
      <DropdownProvider tokens={darkTokens}>
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
          <StatusBar style="light" />

          <View style={styles.topBar}>
            <Text style={styles.brand}>Silk</Text>
            <Text style={styles.brandMuted}>Dropdown</Text>
          </View>

          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onMomentumEnd}
            decelerationRate="fast"
            style={styles.pager}
          >
            <SceneFrame scene={scenes[0]} width={screenWidth}>
              <Field label="Country">
                <Dropdown
                  data={countries}
                  value={country}
                  onChange={setCountry}
                  placeholder="Select country"
                  searchable
                  clearable
                  presentation="popover"
                  animation="scale"
                />
              </Field>
              <Spacer />
            </SceneFrame>

            <SceneFrame scene={scenes[1]} width={screenWidth}>
              <Field label={`Interests · ${selectedTags.length}/3`}>
                <Dropdown
                  data={tags}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  multiple
                  maxSelected={3}
                  placeholder="Pick up to 3 tags"
                  clearable
                  presentation="popover"
                />
              </Field>
              <Spacer />
            </SceneFrame>

            <SceneFrame scene={scenes[2]} width={screenWidth}>
              <View style={styles.formCard}>
                <Text style={styles.formEyebrow}>Create profile</Text>
                <Text style={styles.formTitle}>Where are you based?</Text>
                <Text style={styles.formHint}>
                  Choose a country. The sheet opens from the bottom.
                </Text>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Country</Text>
                  <Dropdown
                    data={countries}
                    value={sheetCountry}
                    onChange={setSheetCountry}
                    placeholder="Select country"
                    searchable
                    presentation="sheet"
                    closeOnSelect
                    animation="slide"
                  />
                </View>
              </View>
              <Spacer />
            </SceneFrame>

            <SceneFrame scene={scenes[3]} width={screenWidth}>
              <View style={styles.segment}>
                {(['fade', 'slide', 'scale'] as const).map((mode) => {
                  const active = motionMode === mode;
                  return (
                    <Pressable
                      key={mode}
                      onPress={() => setMotionMode(mode)}
                      style={[
                        styles.segmentItem,
                        active && styles.segmentActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          active && styles.segmentTextActive,
                        ]}
                      >
                        {mode}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Field label="Popover">
                <Dropdown
                  data={countries}
                  value={motionPopover}
                  onChange={setMotionPopover}
                  placeholder={`${motionMode} popover`}
                  presentation="popover"
                  animation={motionMode}
                />
              </Field>

              <Field label="Sheet">
                <Dropdown
                  data={countries}
                  value={motionSheet}
                  onChange={setMotionSheet}
                  placeholder={`${motionMode} sheet`}
                  presentation="sheet"
                  animation={motionMode}
                  closeOnSelect
                />
              </Field>
              <Spacer />
            </SceneFrame>

            <SceneFrame scene={scenes[4]} width={screenWidth}>
              <Field label="Reviewer">
                <Dropdown
                  data={users}
                  value={user}
                  onChange={setUser}
                  placeholder="Assign reviewer"
                  searchable
                  renderItem={({ item, selected, onPress }) => (
                    <Text
                      onPress={onPress}
                      style={[
                        styles.customItem,
                        selected && styles.customItemSelected,
                      ]}
                    >
                      {item.label}
                      {item.group ? ` · ${item.group}` : ''}
                    </Text>
                  )}
                />
              </Field>
              <Spacer />
            </SceneFrame>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.dots}>
              {scenes.map((scene, i) => (
                <Pressable
                  key={scene.id}
                  onPress={() => goTo(i)}
                  hitSlop={8}
                  style={[styles.dot, i === index && styles.dotActive]}
                />
              ))}
            </View>

            <View style={styles.navRow}>
              <Pressable
                onPress={() => goTo(index - 1)}
                disabled={index === 0}
                style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
              >
                <Text style={styles.navBtnText}>Back</Text>
              </Pressable>
              <Text style={styles.sceneCounter}>
                {index + 1} / {scenes.length}
              </Text>
              <Pressable
                onPress={() => goTo(index + 1)}
                disabled={index === scenes.length - 1}
                style={[
                  styles.navBtn,
                  index === scenes.length - 1 && styles.navBtnDisabled,
                ]}
              >
                <Text style={styles.navBtnText}>Next</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </DropdownProvider>
    </SafeAreaProvider>
  );
}

function SceneFrame({
  scene,
  width,
  children,
}: {
  scene: Scene;
  width: number;
  children: ReactNode;
}) {
  return (
    <View style={[styles.scene, { width }]}>
      <View style={styles.sceneCopy}>
        <Text style={styles.eyebrow}>{scene.eyebrow}</Text>
        <Text style={styles.title}>{scene.title}</Text>
        <Text style={styles.description}>{scene.description}</Text>
      </View>
      <View style={styles.stage}>{children}</View>
    </View>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Spacer() {
  return <View style={styles.spacer} />;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FAFAFA',
    letterSpacing: -0.4,
  },
  brandMuted: {
    fontSize: 20,
    fontWeight: '500',
    color: '#52525B',
    letterSpacing: -0.4,
  },
  pager: {
    flex: 1,
  },
  scene: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  sceneCopy: {
    marginBottom: 36,
    maxWidth: 340,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: '#60A5FA',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FAFAFA',
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: '#A1A1AA',
    marginTop: 12,
    lineHeight: 24,
  },
  stage: {
    flex: 1,
    gap: 20,
  },
  field: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717A',
    letterSpacing: 0.2,
  },
  spacer: {
    flex: 1,
    minHeight: 120,
  },
  formCard: {
    backgroundColor: '#121215',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#27272A',
    padding: 20,
    gap: 8,
  },
  formEyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FAFAFA',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  formHint: {
    fontSize: 14,
    color: '#71717A',
    lineHeight: 20,
    marginBottom: 12,
  },
  formField: {
    gap: 10,
    marginTop: 4,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#18181B',
    borderRadius: 12,
    padding: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#27272A',
    marginBottom: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#27272A',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
    textTransform: 'capitalize',
  },
  segmentTextActive: {
    color: '#FAFAFA',
  },
  customItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FAFAFA',
  },
  customItemSelected: {
    backgroundColor: 'rgba(96, 165, 250, 0.18)',
    fontWeight: '600',
    color: '#60A5FA',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#18181B',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#3F3F46',
  },
  dotActive: {
    backgroundColor: '#FAFAFA',
    width: 22,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#18181B',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#27272A',
    minWidth: 84,
    alignItems: 'center',
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  navBtnText: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '600',
  },
  sceneCounter: {
    color: '#52525B',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
