import path from 'path';
import fs from 'fs';
import { Server, createServer } from 'http';
import dotenv from 'dotenv';
import axios from 'axios';

import express, { Application, Response, Request } from 'express';
import socketIoClient, { Socket } from 'socket.io-client';
import { AgentEvent } from './events';

dotenv.config();

const imagePath = path.resolve(__dirname, 'public', 'image.png');

const informations = [
  {
    json: {
      type: 'test',
      query: 'KPI',
    },
  },
  { raw: 'Test here!' },
  { image: fs.readFileSync(imagePath) },
];

export default class Agent {
  private static readonly POLLING_TIME = 2000;
  private static readonly RESEND_TIME = 1000;
  private port: number | string;
  private app: Application;
  private server: Server;
  private io: typeof Socket;
  private interval: any;

  constructor() {
    this.port = 0;

    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIoClient(`http://localhost:${process.env.MASTER_PORT}`, {
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

    this.io.on(AgentEvent.CONNECT, () => {
      console.log('connected')
      if (!this.interval) {
        this.startPolling();
      }
    });

    this.io.on(AgentEvent.DISCONNECT, () => {
      console.log('disconnected');
      clearInterval(this.interval);
      this.interval = null;
    })
  }

  private getRandomInformation(): any {
    const randomIndex = Math.floor(Math.random() * informations.length);
    const info = informations[randomIndex];

    return info;
  }

  private startPolling(): void {
    this.interval = setInterval(() => {
      const info = this.getRandomInformation();

      if (this.io.connected) {
        // this.sendSocketRequest(info);
        this.sendHttpRequest(info);
      }
    }, Agent.POLLING_TIME);
  }

  private sendSocketRequest(info: any): void {
    this.io.emit(AgentEvent.MESSAGE, info);
    // check for 200 code )))
    if (!this.io.connected) {
      setTimeout(() => {
        this.io.emit(AgentEvent.MESSAGE, info);
      }, Agent.RESEND_TIME);
    }
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

  private async sendHttpRequest(info: any): Promise<void> {
    const apiUrl = `http://localhost:${process.env.MASTER_PORT}/data`;
    const response = await axios.post(apiUrl, info);
    if (response.status !== 200) {
      setTimeout(async () => {
        await axios.post(apiUrl, info);
      }, Agent.RESEND_TIME)
    }
  }
}
