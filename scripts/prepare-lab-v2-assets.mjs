import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

// Source files are the already-published portfolio captures. Rebuild from the repository root.
const assets = 'public/assets';
const destination = `${assets}/lab-v2`;
await mkdir(destination, { recursive: true });

const pathLife = `${assets}/pathlife/dashboard.webp`;
await sharp(pathLife)
  .extract({ left: 324, top: 549, width: 105, height: 108 })
  .webp({ quality: 91 })
  .toFile(`${destination}/grace.webp`);
await sharp(pathLife)
  .extract({ left: 0, top: 0, width: 1179, height: 365 })
  .resize(960)
  .webp({ quality: 78 })
  .toFile(`${destination}/pathlife-sky.webp`);

await sharp(`${assets}/pawlife/home.webp`)
  .extract({ left: 43, top: 484, width: 895, height: 532 })
  .resize(880)
  .webp({ quality: 84 })
  .toFile(`${destination}/bella-room.webp`);

// The native care screenshot puts Bella over a flat mint playfield. Remove that matte
// without redrawing the character or including the native interface around her.
const { data, info } = await sharp(`${assets}/pawlife/care.webp`)
  .extract({ left: 711, top: 1190, width: 300, height: 295 })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const matte = [...data.subarray(0, 3)];
const cutout = Buffer.alloc(info.width * info.height * 4);
for (let index = 0; index < info.width * info.height; index++) {
  const source = index * 3;
  const target = index * 4;
  const distance = Math.hypot(...matte.map((channel, offset) => data[source + offset] - channel));
  const alpha = Math.min(1, Math.max(0, (distance - 10) / 42));
  for (let channel = 0; channel < 3 && alpha > 0; channel++) {
    const foreground = (data[source + channel] - (1 - alpha) * matte[channel]) / alpha;
    cutout[target + channel] = Math.min(255, Math.max(0, Math.round(foreground)));
  }
  cutout[target + 3] = Math.round(alpha * 255);
}
await sharp(cutout, { raw: { width: info.width, height: info.height, channels: 4 } })
  .webp({ quality: 88, alphaQuality: 95 })
  .toFile(`${destination}/bella.webp`);
