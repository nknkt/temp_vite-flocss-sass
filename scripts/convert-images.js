import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const ASSETS_DIR = './src/assets/images';
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];
const WEBP_QUALITY = Number(process.env.WEBP_QUALITY || 90);

async function convertToWebP(filePath) {
  try {
    const parsedPath = path.parse(filePath);
    const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

    // Choose conversion settings to avoid quality loss:
    // - PNG: use lossless WebP to preserve exact image quality/alpha
    // - JPEG: use high-quality lossy WebP (adjustable via WEBP_QUALITY)
    const ext = parsedPath.ext.toLowerCase();
    let pipeline = sharp(filePath);
    if (ext === '.png') {
      pipeline = pipeline.webp({ lossless: true });
    } else {
      // jpg/jpeg
      pipeline = pipeline.webp({ quality: WEBP_QUALITY });
    }

    await pipeline.toFile(outputPath);

    // eslint-disable-next-line no-console
    console.log(`✅ Converted: ${filePath} → ${outputPath}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ Failed to convert ${filePath}:`, error.message);
  }
}

async function processDirectory(dirPath) {
  try {
    const entries = await readdir(dirPath);

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        await processDirectory(fullPath);
      } else if (stats.isFile()) {
        const ext = path.extname(fullPath).toLowerCase();
        if (SUPPORTED_FORMATS.includes(ext)) {
          await convertToWebP(fullPath);
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }
}

async function main() {
  // eslint-disable-next-line no-console
  console.log('🚀 Starting WebP conversion...');
  // eslint-disable-next-line no-console
  console.log(`📁 Processing directory: ${ASSETS_DIR}`);

  await processDirectory(ASSETS_DIR);

  // eslint-disable-next-line no-console
  console.log('✨ WebP conversion completed!');
}

// eslint-disable-next-line no-console
main().catch(console.error);
