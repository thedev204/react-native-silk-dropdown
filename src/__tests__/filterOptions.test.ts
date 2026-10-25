import {
  defaultFilter,
  filterOptions,
  findOption,
  findOptions,
  normalizeOptions,
} from '../core/filterOptions';

const data = [
  { label: 'Canada', value: 'ca' },
  { label: 'Mexico', value: 'mx' },
  { label: 'United States', value: 'us' },
];

describe('filterOptions', () => {
  it('returns all options for an empty query', () => {
    expect(filterOptions(data, '')).toHaveLength(3);
    expect(filterOptions(data, '   ')).toHaveLength(3);
  });

  it('filters by label case-insensitively', () => {
    expect(filterOptions(data, 'can')).toEqual([
      { label: 'Canada', value: 'ca' },
    ]);
    expect(filterOptions(data, 'UNITED')).toEqual([
      { label: 'United States', value: 'us' },
    ]);
  });

  it('supports a custom filter', () => {
    const result = filterOptions(data, 'x', (option, query) =>
      String(option.value).includes(query)
    );
    expect(result).toEqual([{ label: 'Mexico', value: 'mx' }]);
  });
});

describe('defaultFilter', () => {
  it('matches substrings in the label', () => {
    expect(defaultFilter(data[0]!, 'ada')).toBe(true);
    expect(defaultFilter(data[0]!, 'zzz')).toBe(false);
  });
});

describe('normalizeOptions / find helpers', () => {
  it('normalizes custom field names', () => {
    const normalized = normalizeOptions(
      [
        { name: 'Alpha', id: 1, disabled: true },
        { name: 'Beta', id: 2 },
      ],
      'name',
      'id'
    );

    expect(normalized[0]).toMatchObject({
      label: 'Alpha',
      value: 1,
      disabled: true,
    });
  });

  it('finds single and multiple selections', () => {
    expect(findOption(data, 'mx')?.label).toBe('Mexico');
    expect(findOption(data, null)).toBeNull();
    expect(findOptions(data, ['ca', 'us']).map((item) => item.value)).toEqual([
      'ca',
      'us',
    ]);
  });
});
