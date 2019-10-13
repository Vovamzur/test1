import { Router, Response, Request, NextFunction } from 'express';

// import imageMiddleware from './../middlewares/image.middleware';
import { requestsLogger, formLogLine } from './../../services/log.service';
import { saveFile } from './../../services/image.service';

const router = Router();

router
  .post('/data', (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.raw) {
      return next();
    }

    const { raw } = req.body;
    const userAgent = req.headers['user-agent'];
    const logLine = formLogLine({ raw }, userAgent!);
    const result = requestsLogger.write(logLine);

    if (result) {
      res.status(200);
    }
  })
  .post('/data', (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.json) {
      return next();
    }

    const { json } = req.body;
    const userAgent = req.headers['user-agent'];
    const logLine = formLogLine({ json }, userAgent!);
    const result = requestsLogger.write(logLine);

    if (result) {
      res.status(200);
    }
  })
  .post('/data', /* imageMiddleware, */ (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.image) {
      return next();
    }

    let imageName = saveFile(req.body.image);
    imageName = `${req.get('host')}/images/${imageName}`;

    const userAgent = req.headers['user-agent'];
    const logLine = formLogLine({ imageName }, userAgent!);
    const result = requestsLogger.write(logLine);

    if (result) {
      res.status(200);
    }
  })
  .get('/who', (req, res) => {
    res.send('Master');
  });

export default router;
