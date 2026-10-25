import { useMemo, type ReactNode } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';

import { useDropdownTheme } from '../theme/DropdownProvider';
import type {
  DropdownItemValue,
  DropdownOption,
  DropdownStyles,
} from '../types';
import { Item } from './Item';

type Props<T extends DropdownItemValue> = {
  data: DropdownOption<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  query: string;
  loading?: boolean;
  onSearchChange: (query: string) => void;
  isSelected: (value: T) => boolean;
  onSelect: (item: DropdownOption<T>) => void;
  styles?: DropdownStyles;
  renderItem?: (args: {
    item: DropdownOption<T>;
    selected: boolean;
    index: number;
    onPress: () => void;
  }) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderHeader?: () => ReactNode;
  renderFooter?: () => ReactNode;
  maxHeight?: number;
  showDone?: boolean;
  onDone?: () => void;
  onContentSizeChange?: (height: number) => void;
};

export function Content<T extends DropdownItemValue>({
  data,
  searchable,
  searchPlaceholder = 'Search...',
  query,
  loading,
  onSearchChange,
  isSelected,
  onSelect,
  styles: slotStyles,
  renderItem,
  renderEmpty,
  renderHeader,
  renderFooter,
  maxHeight,
  showDone,
  onDone,
  onContentSizeChange,
}: Props<T>) {
  const { tokens } = useDropdownTheme();

  const keyExtractor = useMemo(
    () => (item: DropdownOption<T>) => String(item.value),
    []
  );

  const renderListItem: ListRenderItem<DropdownOption<T>> = ({
    item,
    index,
  }) => {
    const selected = isSelected(item.value);
    const onPress = () => onSelect(item);

    if (renderItem) {
      return <>{renderItem({ item, selected, index, onPress })}</>;
    }

    return (
      <Item
        item={item}
        selected={selected}
        onPress={onPress}
        styles={slotStyles}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tokens.colors.surface,
          maxHeight,
        },
        slotStyles?.content,
      ]}
      onLayout={(event) => {
        onContentSizeChange?.(event.nativeEvent.layout.height);
      }}
    >
      {renderHeader ? (
        <View style={[styles.header, slotStyles?.header]}>
          {renderHeader()}
        </View>
      ) : null}

      {searchable ? (
        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={tokens.colors.textMuted}
            autoCorrect={false}
            autoCapitalize="none"
            style={[
              styles.search,
              {
                borderColor: tokens.colors.border,
                color: tokens.colors.text,
                backgroundColor: tokens.colors.surfaceMuted,
                borderRadius: tokens.radii.sm,
              },
              slotStyles?.searchInput,
            ]}
            accessibilityLabel="Search options"
          />
          {loading ? (
            <ActivityIndicator
              style={styles.spinner}
              color={tokens.colors.primary}
            />
          ) : null}
        </View>
      ) : null}

      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderListItem}
        keyboardShouldPersistTaps="handled"
        style={styles.list}
        ListEmptyComponent={
          renderEmpty ? (
            <>{renderEmpty()}</>
          ) : (
            <View style={[styles.empty, slotStyles?.empty]}>
              <Text
                style={[
                  styles.emptyText,
                  { color: tokens.colors.textMuted },
                  slotStyles?.emptyText,
                ]}
              >
                No results
              </Text>
            </View>
          )
        }
      />

      {renderFooter ? (
        <View
          style={[
            styles.footer,
            { borderTopColor: tokens.colors.border },
            slotStyles?.footer,
          ]}
        >
          {renderFooter()}
        </View>
      ) : null}

      {showDone ? (
        <View
          style={[
            styles.footer,
            { borderTopColor: tokens.colors.border },
            slotStyles?.footer,
          ]}
        >
          <Text
            onPress={onDone}
            style={[styles.done, { color: tokens.colors.primary }]}
            accessibilityRole="button"
          >
            Done
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  searchWrap: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    justifyContent: 'center',
  },
  search: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  spinner: {
    position: 'absolute',
    right: 24,
  },
  list: {
    flexGrow: 0,
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'flex-end',
  },
  done: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
