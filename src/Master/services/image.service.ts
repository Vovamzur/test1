import fs from 'fs';
import path from 'path';

import { imagePath } from './../config/images.config';

const imageDir = './src/Master/images';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

export const saveFile = (buffer: Buffer, ext: string): string => {
  const fileName = `file${Math.random()
    .toString()
    .replace('.', '')}${ext}`;
  const filePath: string = path.join(imagePath, fileName);

  fs.writeFileSync(filePath, buffer, 'binary');

  return fileName;
};
