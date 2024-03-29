import { Server, createServer } from 'http';
import path from 'path';
import fs from 'fs';

import express, { Application } from 'express';
import socketIo from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import { MasterEvent } from './events';
import {
  connectionLogger,
  requestsLogger,
  formConnectionLogLine,
  formLogLine,
} from './services/log.service';
import { imagePath } from './config/images.config';
import routes from './api/routes';

dotenv.config();

export default class Master {
  public static readonly PORT: number = 8080;
  private app: Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: number | string;
  private connectionLogger: typeof connectionLogger;
  private requestLogger: typeof requestsLogger;

  constructor() {
    this.port = process.env.MASTER_PORT || Master.PORT;
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);
    this.connectionLogger = connectionLogger;
    this.requestLogger = requestsLogger;

    this.setMiddlewares();
    this.listen();
    this.setGracefulShutdown();
  }

  private initSocketHandlers(): void {
    this.io.on(MasterEvent.CONNECTION, (socket) => {
      const userAgent = socket.request.headers['user-agent'];
      const logLine = formConnectionLogLine(userAgent);
      this.connectionLogger.write(logLine);

      socket.on(MasterEvent.MESSAGE, (data) => {
        console.log('socket data', data);
        // logLine = formLogLine(this.port as number, socket, data);
        // this.requestLogger.write(logLine);
      });
    });
  }

  private setGracefulShutdown(): void {
    process.on('SIGINT', () => {
      this.server.close((error) => {
        if (error) {
          console.error(error);
          process.exit(1);
        }
      });
      this.connectionLogger.close();
      this.requestLogger.close();
      this.io.close();

      process.exit(0);
    });
  }

  private setMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.static(path.resolve(imagePath)));
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    this.app.use('/', routes);
    this.app.use((req, res, next) => {
      res.status(404).send('Sorry cant find that!');
    });
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Master is runnig on port ${this.port}`);
    });

    this.initSocketHandlers();
  }
}
