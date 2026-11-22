import { readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const assetsRoot = path.resolve('public/assets');
const sourcePattern = /\.(png|jpe?g)$/i;

async function optimise(sourcePath) {
  const relativePath = path.relative(assetsRoot, sourcePath).split(path.sep).join('/');
  const directory = relativePath.split('/')[0];
  const icon = /\/icon\.png$/i.test(relativePath);
  const outputPath = sourcePath.replace(sourcePattern, '.webp');
  const maxWidth = icon
    ? 512
    : directory === 'hospital' || directory === 'co2-tracker'
      ? 2000
      : directory === 'portfolio'
        ? 1600
        : 1179;

  await sharp(sourcePath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(outputPath);

  if (icon) {
    await sharp(sourcePath)
      .rotate()
      .resize({ width: 192, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(outputPath.replace('.webp', '-192.webp'));
  }
  console.log(`Optimised ${relativePath}`);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(
    entries.map((entry) => {
      const sourcePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return walk(sourcePath);
      if (sourcePattern.test(entry.name)) return optimise(sourcePath);
    }),
  );
}

async function importGameScreenshot(game, stem, original) {
  if (
    !['sumlume', 'pathlife', 'pawlife'].includes(game) ||
    !/^[a-z][a-z0-9-]*$/.test(stem ?? '') ||
    !original
  ) {
    throw new Error(
      'Usage: npm run prepare:assets -- --game <game> <filename-stem> <original-image>',
    );
  }

  const image = sharp(original).autoOrient().toColourspace('srgb');
  const metadata = await image.metadata();
  const dimensions = metadata.autoOrient ?? metadata;
  if (
    !dimensions.width ||
    !dimensions.height ||
    dimensions.width > dimensions.height ||
    dimensions.width < 540
  ) {
    throw new Error('Use an authentic portrait capture at least 540 pixels wide.');
  }

  const output = path.join(assetsRoot, game, stem);
  await Promise.all([
    image.clone().webp({ quality: 90, effort: 6 }).toFile(`${output}.webp`),
    image
      .clone()
      .resize({ width: 540 })
      .webp({ quality: 83, effort: 6 })
      .toFile(`${output}-540.webp`),
    image.clone().resize({ width: 112 }).webp({ quality: 74 }).toFile(`${output}-112.webp`),
  ]);
  console.log(
    `${game}/${stem}: ${dimensions.width} × ${dimensions.height}. Update the matching entry in src/data/screens.ts.`,
  );
}

if (process.argv[2] === '--game') {
  await importGameScreenshot(...process.argv.slice(3));
} else {
  await walk(assetsRoot);
}
