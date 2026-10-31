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
    <a href="https://snack.expo.dev/@thedev204/silk-dropdown">
      <img src="https://img.shields.io/badge/Open%20in%20Snack-4630EB?logo=expo&logoColor=white" alt="Open in Expo Snack" />
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
      <video src="https://github.com/user-attachments/assets/6852f377-1bfc-4d06-97fc-03144a0edff4" width="220" controls muted loop playsinline></video>
    </td>
    <td align="center" width="33%">
      <strong>Searchable popover</strong><br/>
      <video src="https://github.com/user-attachments/assets/96dba73e-fac2-4bb4-9466-771805abde83" width="220" controls muted loop playsinline></video>
    </td>
    <td align="center" width="33%">
      <strong>Multi-select</strong><br/>
      <video src="https://github.com/user-attachments/assets/8ea93da0-9dc4-438b-9d9e-2517b51af83a" width="220" controls muted loop playsinline></video>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <strong>Bottom sheet</strong><br/>
      <video src="https://github.com/user-attachments/assets/0b29c91e-fd76-452d-be2e-b2b369607f06" width="220" controls muted loop playsinline></video>
    </td>
    <td align="center" width="33%">
      <strong>Motion presets</strong><br/>
      <video src="https://github.com/user-attachments/assets/c2640860-a09d-4512-9523-f3f17a0afb4f" width="220" controls muted loop playsinline></video>
    </td>
    <td align="center" width="33%"></td>
  </tr>
</table>

<p align="center">
  <a href="https://snack.expo.dev/@thedev204/silk-dropdown">Try it in Expo Snack →</a>
  ·
  <a href="https://react-native-silk-dropdown.vercel.app/">Watch full demos on the docs site →</a>
</p>

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

Try the interactive demo in **[Expo Snack](https://snack.expo.dev/@thedev204/silk-dropdown)**.

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
