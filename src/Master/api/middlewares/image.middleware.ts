import path from 'path';

import multer from 'multer';
import crypto from 'crypto';

import { imagePath } from './../../config/images.config';

const upload = multer({
  storage: multer.diskStorage({
    destination: imagePath,
    filename: (req, file, cb) => {
      crypto.pseudoRandomBytes(16, (err, raw) => {
        if (err) {
          return cb(err, '');
        }
        const filename = `${raw.toString('hex')}${path.extname(file.originalname)}`;
        cb(null, filename);
      });
    },
  }),
});

export default upload.single('image');
