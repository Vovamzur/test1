import fs, { writeFile } from 'fs';
import path from 'path';

import { imagePath } from './../config/images.config';

export const saveFile = (buffer: Buffer): string => {
  const fileName = `file${Math.random()}.png`;
  const filePath: string = path.join(imagePath, fileName);

  fs.writeFileSync(filePath, buffer, 'binary');

  return fileName;
};
