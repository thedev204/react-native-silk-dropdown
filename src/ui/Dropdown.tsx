import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type ForwardedRef,
  type ReactElement,
  type Ref,
} from 'react';
import { View } from 'react-native';

import { resolveAnimation } from '../animation/presets';
import { useDropdownProgress } from '../animation/useDropdownProgress';
import { useDropdown } from '../core/useDropdown';
import { normalizeOptions } from '../core/filterOptions';
import type {
  DropdownItemValue,
  DropdownProps,
  DropdownRef,
  Rect,
} from '../types';
import { Content } from './Content';
import { PopoverPresenter } from './PopoverPresenter';
import { SheetPresenter } from './SheetPresenter';
import { Trigger } from './Trigger';

function DropdownInner<T extends DropdownItemValue>(
  props: DropdownProps<T>,
  ref: ForwardedRef<DropdownRef>
) {
  const {
    data: rawData,
    labelField = 'label',
    valueField = 'value',
    placeholder = 'Select...',
    searchable = false,
    searchPlaceholder,
    filter,
    onSearch,
    loading,
    presentation = 'popover',
    animation,
    maxSelected,
    clearable = false,
    disabled = false,
    styles,
    renderTrigger,
    renderItem,
    renderChip,
    renderEmpty,
    renderHeader,
    renderFooter,
    onOpen,
    onClose,
    preferredPlacement,
    sheetMaxHeightRatio,
    closeOnSelect,
    keyboardShouldPersistTaps,
    testID,
  } = props;

  const data = useMemo(
    () =>
      normalizeOptions<T>(
        rawData as Array<Record<string, unknown>>,
        labelField,
        valueField
      ),
    [labelField, rawData, valueField]
  );

  const triggerRef = useRef<ComponentRef<typeof View>>(null);
  const [triggerRect, setTriggerRect] = useState<Rect | null>(null);
  // Sheet enter waits for first layout so progress doesn't race the Modal mount.
  const [sheetLayoutReady, setSheetLayoutReady] = useState(false);

  const dropdown = useDropdown<T>({
    ...(props.multiple
      ? {
          multiple: true as const,
          value: props.value as T[],
          onChange: props.onChange as (value: T[]) => void,
        }
      : {
          multiple: false as const,
          value: props.value as T | null,
          onChange: props.onChange as (value: T | null) => void,
        }),
    data,
    filter,
    maxSelected,
    closeOnSelect:
      closeOnSelect ??
      (presentation === 'sheet' || props.multiple ? false : true),
    onOpen,
    onClose,
    onSearch,
  });

  const animationConfig = useMemo(
    () => resolveAnimation(animation, presentation),
    [animation, presentation]
  );

  const { handleClosed: completeClose } = dropdown;
  const handleClosed = useCallback(() => {
    setSheetLayoutReady(false);
    completeClose();
  }, [completeClose]);

  const handleSheetReady = useCallback(() => {
    setSheetLayoutReady(true);
  }, []);

  const progress = useDropdownProgress({
    phase: dropdown.phase,
    ready: presentation === 'sheet' ? sheetLayoutReady : true,
    config: animationConfig,
    onOpened: dropdown.handleOpened,
    onClosed: handleClosed,
  });

  const measureTrigger = useCallback(() => {
    const node = triggerRef.current;
    if (!node) {
      return;
    }

    node.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        setTriggerRect((prev) => {
          if (
            prev &&
            Math.abs(prev.x - x) < 0.5 &&
            Math.abs(prev.y - y) < 0.5 &&
            Math.abs(prev.width - width) < 0.5 &&
            Math.abs(prev.height - height) < 0.5
          ) {
            return prev;
          }
          return { x, y, width, height };
        });
      }
    );
  }, []);

  const measureAndOpen = useCallback(() => {
    if (disabled) {
      return;
    }

    const node = triggerRef.current;
    if (!node) {
      dropdown.requestOpen();
      return;
    }

    node.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        setTriggerRect({ x, y, width, height });
        dropdown.requestOpen();
      }
    );
  }, [disabled, dropdown]);

  const onTriggerLayout = useCallback(() => {
    // Multi-select chips can wrap and grow the trigger while open; keep the
    // popover anchored to the updated bottom edge.
    if (!dropdown.open || presentation !== 'popover') {
      return;
    }
    measureTrigger();
  }, [dropdown.open, measureTrigger, presentation]);

  const toggle = useCallback(() => {
    if (dropdown.open) {
      dropdown.requestClose();
      return;
    }
    measureAndOpen();
  }, [dropdown, measureAndOpen]);

  useImperativeHandle(
    ref,
    () => ({
      open: measureAndOpen,
      close: dropdown.requestClose,
      clear: dropdown.clear,
    }),
    [dropdown.clear, dropdown.requestClose, measureAndOpen]
  );

  const selectedForTrigger = dropdown.selected;

  const content = (
    <Content
      data={dropdown.filteredData}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      query={dropdown.query}
      loading={loading ?? dropdown.searchLoading}
      onSearchChange={dropdown.handleSearchChange}
      isSelected={dropdown.isSelected}
      onSelect={dropdown.select}
      styles={styles}
      renderItem={renderItem}
      renderEmpty={renderEmpty}
      renderHeader={renderHeader}
      renderFooter={renderFooter}
      maxHeight={
        presentation === 'popover' ? (triggerRect ? undefined : 320) : undefined
      }
      showDone={presentation === 'sheet' && Boolean(props.multiple)}
      onDone={dropdown.requestClose}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
    />
  );

  return (
    <View>
      <View ref={triggerRef} collapsable={false} onLayout={onTriggerLayout}>
        {renderTrigger ? (
          renderTrigger({
            open: dropdown.open,
            disabled,
            selected: selectedForTrigger,
            label: dropdown.selectedLabel,
            placeholder,
            onPress: toggle,
          })
        ) : (
          <Trigger
            open={dropdown.open}
            disabled={disabled}
            placeholder={placeholder}
            label={dropdown.selectedLabel}
            multiple={Boolean(props.multiple)}
            selected={selectedForTrigger}
            clearable={clearable}
            progress={progress}
            styles={styles}
            onPress={toggle}
            onClear={dropdown.clear}
            onRemoveChip={dropdown.removeValue}
            renderChip={renderChip}
            testID={testID}
          />
        )}
      </View>

      {dropdown.mounted && presentation === 'popover' ? (
        <PopoverPresenter
          visible={dropdown.mounted}
          progress={progress}
          triggerRect={triggerRect}
          animation={animation}
          preferredPlacement={preferredPlacement}
          freezeLayout={dropdown.phase === 'closing'}
          onRequestClose={dropdown.requestClose}
          backdropStyle={styles?.backdrop as object | undefined}
        >
          {content}
        </PopoverPresenter>
      ) : null}

      {dropdown.mounted && presentation === 'sheet' ? (
        <SheetPresenter
          visible={dropdown.mounted}
          progress={progress}
          animation={animation}
          maxHeightRatio={sheetMaxHeightRatio}
          onRequestClose={dropdown.requestClose}
          onReady={handleSheetReady}
          styles={styles}
        >
          {content}
        </SheetPresenter>
      ) : null}
    </View>
  );
}

type DropdownComponent = <T extends DropdownItemValue>(
  props: DropdownProps<T> & { ref?: Ref<DropdownRef> }
) => ReactElement | null;

export const Dropdown = forwardRef(
  DropdownInner
) as unknown as DropdownComponent;
