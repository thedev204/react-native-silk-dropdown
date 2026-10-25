<p align="center">
  <div align="center">
    <a href="https://www.npmjs.com/package/react-native-silk-dropdown">
      <img src="https://img.shields.io/npm/v/react-native-silk-dropdown.svg" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/package/react-native-silk-dropdown">
      <img src="https://img.shields.io/npm/dm/react-native-silk-dropdown.svg?colorB=007ec6" alt="npm downloads" />
    </a>
  </div>
  <div align="center">
    <a href="https://github.com/expo/expo">
      <img src="https://img.shields.io/badge/Runs%20with%20Expo-000.svg?style=flat&logo=EXPO&labelColor=ffffff&logoColor=000" alt="runs with expo" />
    </a>
    <a href="https://github.com/thedev204/react-native-silk-dropdown/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license" />
    </a>
  </div>
</p>

<br/>

<h1 align="center">React Native Silk Dropdown</h1>

<p align="center">
  A smooth, keyboard-safe, animated dropdown for React Native.<br/>
  <strong>Popover or bottom sheet, one API.</strong>
</p>

## Demo

<table>
  <tr>
    <td align="center" width="33%">
      <strong>Overview</strong><br/>
      <video src="./assets/full.mp4" width="220" controls muted loop playsinline></video>
    </td>
    <td align="center" width="33%">
      <strong>Searchable popover</strong><br/>
      <video src="./assets/single_input.mp4" width="220" controls muted loop playsinline></video>
    </td>
    <td align="center" width="33%">
      <strong>Multi-select</strong><br/>
      <video src="./assets/multi_input.mp4" width="220" controls muted loop playsinline></video>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <strong>Bottom sheet</strong><br/>
      <video src="./assets/sheet_input.mp4" width="220" controls muted loop playsinline></video>
    </td>
    <td align="center" width="33%">
      <strong>Motion presets</strong><br/>
      <video src="./assets/transitions.mp4" width="220" controls muted loop playsinline></video>
    </td>
    <td align="center" width="33%"></td>
  </tr>
</table>

---

## Requirements

| Package | Version |
| :------ | :------ |
| `react-native` | New Architecture |
| `react-native-reanimated` | >= 4.0.0 |
| `react-native-worklets` | peer (required with Reanimated 4) |
| `react-native-safe-area-context` | optional (recommended) |

> Pure JS — works in Expo Go once peers are installed.

## Installation

```sh
npm install react-native-silk-dropdown react-native-reanimated react-native-worklets
```

```sh
yarn add react-native-silk-dropdown react-native-reanimated react-native-worklets
```

**Expo**

```sh
npx expo install react-native-silk-dropdown react-native-reanimated react-native-worklets
```

Follow [Reanimated’s installation docs](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) for Babel setup, then rebuild the native app (bare RN: `cd ios && pod install`).

## Quick Start

```tsx
import { Dropdown } from 'react-native-silk-dropdown';

<Dropdown
  data={countries}
  value={value}
  onChange={setValue}
  searchable
  presentation="popover" // or "sheet"
/>
```

## Documentation

Full API reference, guides, and examples are available on the **[official documentation website](https://react-native-silk-dropdown.vercel.app/)**.

- [Getting Started](https://react-native-silk-dropdown.vercel.app/docs/getting-started)
- [Installation](https://react-native-silk-dropdown.vercel.app/docs/installation)
- [Dropdown API](https://react-native-silk-dropdown.vercel.app/docs/api/dropdown)
- [DropdownProvider](https://react-native-silk-dropdown.vercel.app/docs/api/dropdown-provider)
- [Animation](https://react-native-silk-dropdown.vercel.app/docs/guides/animation)
- [Multi-select](https://react-native-silk-dropdown.vercel.app/docs/guides/multi-select)
- [Customization](https://react-native-silk-dropdown.vercel.app/docs/guides/customization)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a pull request.

- Report bugs in the [Issue Tracker](https://github.com/thedev204/react-native-silk-dropdown/issues).

## License

MIT
