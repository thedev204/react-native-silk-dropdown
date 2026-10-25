import type { DropdownItemValue, DropdownOption, FilterFn } from '../types';

export function defaultFilter<T extends DropdownItemValue>(
  option: DropdownOption<T>,
  query: string
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return String(option.label).toLowerCase().includes(normalized);
}

export function filterOptions<T extends DropdownItemValue>(
  data: DropdownOption<T>[],
  query: string,
  filter: FilterFn<T> = defaultFilter
): DropdownOption<T>[] {
  const normalized = query.trim();
  if (!normalized) {
    return data;
  }

  return data.filter((option) => filter(option, normalized));
}

export function getOptionLabel(
  option: Record<string, unknown>,
  labelField = 'label'
): string {
  const value = option[labelField];
  return value == null ? '' : String(value);
}

export function getOptionValue<T extends DropdownItemValue>(
  option: Record<string, unknown>,
  valueField = 'value'
): T {
  return option[valueField] as T;
}

export function normalizeOptions<T extends DropdownItemValue>(
  data: Array<Record<string, unknown>>,
  labelField = 'label',
  valueField = 'value'
): DropdownOption<T>[] {
  return data.map((item) => ({
    ...item,
    label: getOptionLabel(item, labelField),
    value: getOptionValue<T>(item, valueField),
    disabled: Boolean(item.disabled),
    icon: item.icon as DropdownOption<T>['icon'],
    group: typeof item.group === 'string' ? item.group : undefined,
  }));
}

export function findOption<T extends DropdownItemValue>(
  data: DropdownOption<T>[],
  value: T | null | undefined
): DropdownOption<T> | null {
  if (value == null) {
    return null;
  }

  return data.find((item) => item.value === value) ?? null;
}

export function findOptions<T extends DropdownItemValue>(
  data: DropdownOption<T>[],
  values: T[]
): DropdownOption<T>[] {
  const set = new Set(values);
  return data.filter((item) => set.has(item.value));
}
