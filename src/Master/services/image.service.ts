import fs, { writeFile } from 'fs';
import path from 'path';

import { imagePath } from './../config/images.config';

export const saveFile = (buffer: Buffer): string => {
  const fileName: string = path.resolve(imagePath, `file${Math.random()}.png`);

  fs.writeFileSync(fileName, buffer, 'binary');

  console.log('saved');
  return fileName;
};
