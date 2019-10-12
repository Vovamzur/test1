import { Socket } from 'socket.io';

import { connectionsLogFilePath, requestsLogFilePath } from '../config/log.config';
import Logger from './Logger';
import { getCountOfSearchedByQuery } from './../services/google.service';
import { saveFile } from './image.service';

export const connectionLogger = new Logger(connectionsLogFilePath);
export const requestsLogger = new Logger(requestsLogFilePath);

export const formConnectionLogLine = (socket: Socket): string => {
  const time = new Date().toLocaleString();
  const userAgent = socket.request.headers['user-agent'];
  const res: string = `[${time}] ${userAgent} - New Connection \r\n`;

  return res;
};

export const formLogLine = (port: number, socket: Socket, data: any): string => {
  const type = typeof data;
  const time = new Date().toLocaleString();
  const userAgent = socket.request.headers['user-agent'];

  let res = `[${time}] ${userAgent} - `;

  if (type === 'string') {
    res += data;
    return `${res}\r\n`;
  }
  if (type === 'object') {
    if (data.image) {
      const fileName = saveFile(data.buffer);
      res += `New Image: localhost://${port}/${fileName} (public link)`;
      return `${res}\r\n`;
    }
    res += `New JSON: ${JSON.stringify(data)}, About ${getCountOfSearchedByQuery(data.query)} results`;
    return `${res}\r\n`;
  }

  return '';
};
