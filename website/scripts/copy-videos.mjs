import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const websiteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const dest = join(websiteRoot, 'public/videos');

const assetCandidates = [
  join(websiteRoot, '../assets'),
  join(process.cwd(), '../assets'),
  join(process.cwd(), 'assets'),
  resolve(websiteRoot, '../../assets'),
];

const src = assetCandidates.find(
  (dir) => existsSync(dir) && statSync(dir).isDirectory()
);

if (!src) {
  console.error(
    'copy-videos: could not find assets/. Looked in:\n' +
      assetCandidates.map((p) => `  - ${p}`).join('\n')
  );
  process.exit(1);
}

mkdirSync(dest, { recursive: true });

const files = readdirSync(src).filter((name) => name.endsWith('.mp4'));
if (files.length === 0) {
  console.error(`copy-videos: no .mp4 files in ${src}`);
  process.exit(1);
}

for (const name of files) {
  copyFileSync(join(src, name), join(dest, name));
}

console.log(
  `copy-videos: copied ${files.length} file(s) from ${src} → ${dest}`
);
