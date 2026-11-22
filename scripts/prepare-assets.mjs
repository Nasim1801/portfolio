import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// PNG and JPEG originals live in media-src/ so they are not deployed.
// The build writes display WebP variants into public/assets/.
const sourceRoot = path.resolve('media-src');
const assetsRoot = path.resolve('public/assets');
const sourcePattern = /\.(png|jpe?g)$/i;

async function isFresh(output, source) {
  try {
    const [outputStat, sourceStat] = await Promise.all([stat(output), stat(source)]);
    return outputStat.mtimeMs >= sourceStat.mtimeMs;
  } catch {
    return false;
  }
}

async function write(sourcePath, outputPath, width, quality) {
  if (await isFresh(outputPath, sourcePath)) return false;
  await sharp(sourcePath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(outputPath);
  return true;
}

async function optimise(sourcePath) {
  const relativePath = path.relative(sourceRoot, sourcePath).split(path.sep).join('/');
  const directory = relativePath.split('/')[0];
  const icon = /(^|\/)icon\.png$/i.test(relativePath);
  const output = path.join(assetsRoot, relativePath.replace(sourcePattern, ''));
  await mkdir(path.dirname(output), { recursive: true });

  const variants = icon
    ? [
        [`${output}.webp`, 512, 82],
        [`${output}-192.webp`, 192, 84],
      ]
    : [
        [
          `${output}.webp`,
          directory === 'hospital' || directory === 'co2-tracker'
            ? 2000
            : directory === 'portfolio'
              ? 1600
              : 1179,
          82,
        ],
        // Responsive display size and gallery thumbnail for landscape media.
        [`${output}-960.webp`, 960, 80],
        [`${output}-160.webp`, 160, 72],
      ];

  const written = await Promise.all(
    variants.map(([target, width, quality]) => write(sourcePath, target, width, quality)),
  );
  if (written.some(Boolean)) console.log(`Optimised ${relativePath}`);
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
  await walk(sourceRoot);
}
