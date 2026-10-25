import { useCallback, useMemo, useState } from 'react';

import type {
  DropdownItemValue,
  DropdownOption,
  DropdownPhase,
  FilterFn,
} from '../types';
import {
  defaultFilter,
  filterOptions,
  findOption,
  findOptions,
} from './filterOptions';

type SingleArgs<T extends DropdownItemValue> = {
  multiple?: false;
  value: T | null;
  onChange: (value: T | null) => void;
};

type MultipleArgs<T extends DropdownItemValue> = {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
};

type BaseArgs<T extends DropdownItemValue> = {
  data: DropdownOption<T>[];
  filter?: FilterFn<T>;
  maxSelected?: number;
  closeOnSelect?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onSearch?: (query: string) => void | Promise<void>;
};

export type UseDropdownArgs<T extends DropdownItemValue> = BaseArgs<T> &
  (SingleArgs<T> | MultipleArgs<T>);

export function useDropdown<T extends DropdownItemValue>(
  args: UseDropdownArgs<T>
) {
  const {
    data,
    filter = defaultFilter,
    maxSelected,
    closeOnSelect,
    onOpen,
    onClose,
    onSearch,
  } = args;

  const multiple = Boolean(args.multiple);

  const [phase, setPhase] = useState<DropdownPhase>('closed');
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const open = phase === 'opening' || phase === 'open';

  const selected = useMemo(() => {
    if (multiple) {
      return findOptions(data, args.value as T[]);
    }
    return findOption(data, args.value as T | null);
  }, [args.value, data, multiple]);

  const filteredData = useMemo(
    () => filterOptions(data, query, filter),
    [data, filter, query]
  );

  const requestOpen = useCallback(() => {
    setMounted(true);
    setPhase('opening');
    onOpen?.();
  }, [onOpen]);

  const requestClose = useCallback(() => {
    setPhase((current) => {
      if (current === 'closed' || current === 'closing') {
        return current;
      }
      return 'closing';
    });
  }, []);

  const handleOpened = useCallback(() => {
    setPhase('open');
  }, []);

  const handleClosed = useCallback(() => {
    setPhase('closed');
    setMounted(false);
    setQuery('');
    setSearchLoading(false);
    onClose?.();
  }, [onClose]);

  const handleSearchChange = useCallback(
    async (next: string) => {
      setQuery(next);
      if (!onSearch) {
        return;
      }
      setSearchLoading(true);
      try {
        await onSearch(next);
      } finally {
        setSearchLoading(false);
      }
    },
    [onSearch]
  );

  const isSelected = useCallback(
    (value: T) => {
      if (multiple) {
        return (args.value as T[]).includes(value);
      }
      return args.value === value;
    },
    [args.value, multiple]
  );

  const select = useCallback(
    (option: DropdownOption<T>) => {
      if (option.disabled) {
        return;
      }

      if (multiple) {
        const current = args.value as T[];
        const exists = current.includes(option.value);
        let next: T[];

        if (exists) {
          next = current.filter((item) => item !== option.value);
        } else {
          if (maxSelected != null && current.length >= maxSelected) {
            return;
          }
          next = [...current, option.value];
        }

        (args.onChange as (value: T[]) => void)(next);

        const shouldClose = closeOnSelect === true;
        if (shouldClose) {
          requestClose();
        }
        return;
      }

      (args.onChange as (value: T | null) => void)(option.value);
      if (closeOnSelect !== false) {
        requestClose();
      }
    },
    [args, closeOnSelect, maxSelected, multiple, requestClose]
  );

  const clear = useCallback(() => {
    if (multiple) {
      (args.onChange as (value: T[]) => void)([]);
    } else {
      (args.onChange as (value: T | null) => void)(null);
    }
  }, [args, multiple]);

  const removeValue = useCallback(
    (value: T) => {
      if (!multiple) {
        (args.onChange as (value: T | null) => void)(null);
        return;
      }
      const next = (args.value as T[]).filter((item) => item !== value);
      (args.onChange as (value: T[]) => void)(next);
    },
    [args, multiple]
  );

  const selectedLabel = useMemo(() => {
    if (multiple) {
      const items = selected as DropdownOption<T>[];
      if (items.length === 0) {
        return '';
      }
      if (items.length === 1) {
        return items[0]?.label ?? '';
      }
      return `${items.length} selected`;
    }
    return (selected as DropdownOption<T> | null)?.label ?? '';
  }, [multiple, selected]);

  return {
    phase,
    mounted,
    open,
    query,
    searchLoading,
    filteredData,
    selected,
    selectedLabel,
    requestOpen,
    requestClose,
    handleOpened,
    handleClosed,
    handleSearchChange,
    select,
    clear,
    removeValue,
    isSelected,
  };
}
