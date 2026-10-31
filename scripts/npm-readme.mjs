/**
 * npm strips / blanks <video>, so the published README uses GIFs instead.
 * GitHub keeps the video README in the working tree.
 *
 * prepack  → swap videos for GIFs (tarball picks this up)
 * postpack → restore the GitHub README
 */
import { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readme = join(root, 'README.md');
const backup = join(root, '.README.github.md');

const RAW =
  'https://raw.githubusercontent.com/thedev204/react-native-silk-dropdown/main/assets';

/** GitHub attachment UUID → assets/*.gif */
const VIDEO_TO_GIF = {
  '6852f377-1bfc-4d06-97fc-03144a0edff4': {
    file: 'full.gif',
    alt: 'Overview demo',
  },
  '96dba73e-fac2-4bb4-9466-771805abde83': {
    file: 'single_input.gif',
    alt: 'Searchable popover demo',
  },
  '8ea93da0-9dc4-438b-9d9e-2517b51af83a': {
    file: 'multi_input.gif',
    alt: 'Multi-select demo',
  },
  '0b29c91e-fd76-452d-be2e-b2b369607f06': {
    file: 'sheet_input.gif',
    alt: 'Bottom sheet demo',
  },
  'c2640860-a09d-4512-9523-f3f17a0afb4f': {
    file: 'transitions.gif',
    alt: 'Motion presets demo',
  },
};

const action = process.argv[2];

if (action === 'prepare') {
  if (!existsSync(readme)) {
    throw new Error('README.md not found');
  }

  copyFileSync(readme, backup);

  const next = readFileSync(readme, 'utf8').replace(
    /<video\s+src="https:\/\/github\.com\/user-attachments\/assets\/([^"]+)"[^>]*><\/video>/g,
    (_, id) => {
      const mapped = VIDEO_TO_GIF[id];
      if (!mapped) {
        throw new Error(`No GIF mapping for video asset ${id}`);
      }
      return `<img src="${RAW}/${mapped.file}" width="220" alt="${mapped.alt}" />`;
    }
  );

  if (next.includes('<video')) {
    throw new Error(
      'npm-readme: leftover <video> tags after swap — update VIDEO_TO_GIF'
    );
  }

  writeFileSync(readme, next);
  console.log('npm-readme: swapped demo videos → GIFs for pack/publish');
  process.exit(0);
}

if (action === 'restore') {
  if (existsSync(backup)) {
    copyFileSync(backup, readme);
    unlinkSync(backup);
    console.log('npm-readme: restored GitHub README (videos)');
  }
  process.exit(0);
}

console.error('Usage: node scripts/npm-readme.mjs <prepare|restore>');
process.exit(1);
