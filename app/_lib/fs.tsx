// function- write uploaded video or image file to disk
import { join } from 'path';
import { recoverFileName } from '../_lib/file-naming';
// improt promisify utility
import { promisify } from 'util';

// promisify writeFile
import fs from 'fs';

async function writeFileAsync(file: File, folder: string = 'uploads') {
  const filePath = join(folder, recoverFileName(file));
  const fileBuffer = await file.arrayBuffer();
  await fs.promises.writeFile(filePath, new Uint8Array(fileBuffer));
  return filePath;
}
function ensureDirAsync(folder: string) {
  return fs.promises.mkdir(folder, { recursive: true });
}

export { writeFileAsync, ensureDirAsync };
