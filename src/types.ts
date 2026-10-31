import type { ReactNode, Ref } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type DropdownItemValue = string | number;

export type DropdownOption<T extends DropdownItemValue = DropdownItemValue> = {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: ReactNode;
  group?: string;
  [key: string]: unknown;
};

export type DropdownPhase = 'closed' | 'opening' | 'open' | 'closing';

export type DropdownPresentation = 'popover' | 'sheet';

export type DropdownAnimationName =
  'fade' | 'scale' | 'slide' | 'spring' | 'none';

export type DropdownAnimationConfig = {
  name?: DropdownAnimationName;
  durationIn?: number;
  durationOut?: number;
  springDamping?: number;
  springStiffness?: number;
};

export type DropdownAnimation = DropdownAnimationName | DropdownAnimationConfig;

export type PopoverPlacement = 'top' | 'bottom';

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Insets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type PopoverLayoutInput = {
  triggerRect: Rect;
  window: { width: number; height: number };
  keyboardHeight: number;
  insets: Insets;
  contentHeight: number;
  preferredPlacement?: PopoverPlacement;
  offset?: number;
  matchTriggerWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
};

export type PopoverLayout = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: PopoverPlacement;
};

export type DropdownStyles = {
  trigger?: StyleProp<ViewStyle>;
  triggerText?: StyleProp<TextStyle>;
  content?: StyleProp<ViewStyle>;
  item?: StyleProp<ViewStyle>;
  itemSelected?: StyleProp<ViewStyle>;
  itemText?: StyleProp<TextStyle>;
  itemTextSelected?: StyleProp<TextStyle>;
  backdrop?: StyleProp<ViewStyle>;
  handle?: StyleProp<ViewStyle>;
  searchInput?: StyleProp<TextStyle>;
  chip?: StyleProp<ViewStyle>;
  chipText?: StyleProp<TextStyle>;
  empty?: StyleProp<ViewStyle>;
  emptyText?: StyleProp<TextStyle>;
  header?: StyleProp<ViewStyle>;
  footer?: StyleProp<ViewStyle>;
};

export type DropdownRef = {
  open: () => void;
  close: () => void;
  clear: () => void;
};

export type FilterFn<T extends DropdownItemValue> = (
  option: DropdownOption<T>,
  query: string
) => boolean;

type RenderTriggerArgs<T extends DropdownItemValue> = {
  open: boolean;
  disabled: boolean;
  selected: DropdownOption<T> | DropdownOption<T>[] | null;
  label: string;
  placeholder: string;
  onPress: () => void;
};

type RenderItemArgs<T extends DropdownItemValue> = {
  item: DropdownOption<T>;
  selected: boolean;
  index: number;
  onPress: () => void;
};

type RenderChipArgs<T extends DropdownItemValue> = {
  item: DropdownOption<T>;
  onRemove: () => void;
};

export type DropdownBaseProps<T extends DropdownItemValue> = {
  data: DropdownOption<T>[];
  labelField?: string;
  valueField?: string;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  filter?: FilterFn<T>;
  onSearch?: (query: string) => void | Promise<void>;
  loading?: boolean;
  presentation?: DropdownPresentation;
  animation?: DropdownAnimation;
  maxSelected?: number;
  clearable?: boolean;
  disabled?: boolean;
  styles?: DropdownStyles;
  renderTrigger?: (args: RenderTriggerArgs<T>) => ReactNode;
  renderItem?: (args: RenderItemArgs<T>) => ReactNode;
  renderChip?: (args: RenderChipArgs<T>) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderHeader?: () => ReactNode;
  renderFooter?: () => ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  preferredPlacement?: PopoverPlacement;
  sheetMaxHeightRatio?: number;
  closeOnSelect?: boolean;
  /**
   * Passed to the options FlatList. Defaults to `'handled'` so option taps
   * select while the search keyboard is open (avoids a dismiss-then-select tap).
   * Use `'always'` if taps still dismiss the keyboard first on your platform.
   */
  keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
  testID?: string;
  ref?: Ref<DropdownRef>;
};

export type DropdownSingleProps<T extends DropdownItemValue> =
  DropdownBaseProps<T> & {
    multiple?: false;
    value: T | null;
    onChange: (value: T | null) => void;
  };

export type DropdownMultipleProps<T extends DropdownItemValue> =
  DropdownBaseProps<T> & {
    multiple: true;
    value: T[];
    onChange: (value: T[]) => void;
  };

export type DropdownProps<T extends DropdownItemValue = DropdownItemValue> =
  DropdownSingleProps<T> | DropdownMultipleProps<T>;
