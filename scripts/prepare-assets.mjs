import { readdir, rename } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const assetsRoot = path.resolve('public/assets');
const sourcePattern = /\.(png|jpe?g)$/i;

async function walk(directory) {
  let entries = [];
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(sourcePath);
        return;
      }

      if (!sourcePattern.test(entry.name)) return;

      const outputPath = sourcePath.replace(sourcePattern, '.webp');
      if (outputPath === sourcePath) return;

      const isGameCapture = /assets\/(pathlife|pawlife)\/\d{2}-[^/]+\.png$/i.test(
        sourcePath.replaceAll('\\', '/'),
      );
      const isTeamProjectCapture = /assets\/(co2-tracker|hospital)\/\d{2}-[^/]+\.png$/i.test(
        sourcePath.replaceAll('\\', '/'),
      );
      const isGameIcon = /assets\/(pathlife|pawlife)\/icon\.png$/i.test(
        sourcePath.replaceAll('\\', '/'),
      );

      if (isGameCapture) {
        const temporaryPath = `${sourcePath}.optimised.png`;
        await sharp(sourcePath)
          .rotate()
          .resize({ width: 1179, height: 2556, fit: 'cover', position: 'centre' })
          .png({ compressionLevel: 9, adaptiveFiltering: true })
          .toFile(temporaryPath);
        await rename(temporaryPath, sourcePath);
      }

      await sharp(sourcePath)
        .rotate()
        .resize({
          width: isGameIcon ? 512 : isTeamProjectCapture ? 2000 : 1179,
          withoutEnlargement: true,
        })
        .webp({ quality: 82, effort: 5 })
        .toFile(outputPath);

      if (isGameCapture) {
        await sharp(sourcePath)
          .rotate()
          .resize({ width: 640, withoutEnlargement: true })
          .webp({ quality: 80, effort: 5 })
          .toFile(outputPath.replace(/\.webp$/i, '-640.webp'));
      }

      if (isGameIcon) {
        await sharp(sourcePath)
          .rotate()
          .resize({ width: 192, height: 192, fit: 'cover' })
          .webp({ quality: 80, effort: 5 })
          .toFile(outputPath.replace(/\.webp$/i, '-192.webp'));
      }
      console.log(`Optimised ${path.relative(process.cwd(), outputPath)}`);
    }),
  );
}

await walk(assetsRoot);
