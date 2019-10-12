import path from 'path';
import fs from 'fs';
import { Server, createServer } from 'http';
import dotenv from 'dotenv';

import express, { Application, Response, Request } from 'express';
import socketIoClient, { Socket } from 'socket.io-client';
import { AgentEvent } from './events';

dotenv.config();

const informations = [
  {
    type: 'test',
    query: 'KPI',
  },
  'Test here!',
  { image: true, buffer: fs.readFileSync(path.resolve(__dirname, 'public', 'image.png')) },
];

export default class Agent {
  public static readonly MASTER_PORT: number = 8080;
  private static readonly POLLING_TIME = 2000;
  private static readonly RESEND_TIME = 1000;
  private port: number | string;
  private masterPort: number | string;
  private app: Application;
  private server: Server;
  private io: typeof Socket;

  constructor() {
    this.port = 0;
    this.masterPort = process.env.MASTER_PORT || Agent.MASTER_PORT;

    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIoClient(`http://localhost:${this.masterPort}`, {
      reconnection: true,
    });

    this.setMiddlewares();
    this.setRoutes();
    this.listen();
    this.setGracefulShutdown();

    this.startPolling();
  }

  private setMiddlewares(): void {
    this.app.use(express.static(path.resolve('public')));
  }

  private setRoutes(): void {
    this.app.use('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    this.app.get('/who', (req, res) => {
      res.send('Agent!');
    });
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      this.port = this.server.address().port;
      // tslint:disable-next-line: no-console
      console.log(`Agent is runnig on port ${this.port}`);
    });
  }

  private getRandomInformation(): any {
    const randomIndex = Math.floor(Math.random() * informations.length);
    const info = informations[randomIndex];

    return info;
  }

  private startPolling(): void {
    setInterval(() => {
      const info = this.getRandomInformation();

      this.io.emit(AgentEvent.MESSAGE, info);
      // check for 200 code )))
      if (!this.io.connected) {
        setTimeout(() => {
          this.io.emit(AgentEvent.MESSAGE, info);
        }, Agent.RESEND_TIME);
      }
    }, Agent.POLLING_TIME);
  }

  private setGracefulShutdown(): void {
    process.on('SIGINT', () => {
      this.server.close((error) => {
        if (error) {
          console.error(error);
          process.exit(1);
        }
      });
      this.io.close();

      process.exit(0);
    });
  }
}
