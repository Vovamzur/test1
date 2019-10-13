import { Socket } from 'socket.io';

import { connectionsLogFilePath, requestsLogFilePath } from '../config/log.config';
import Logger from './Logger';
import { getCountOfSearchedByQuery } from './../services/google.service';

export const connectionLogger = new Logger(connectionsLogFilePath);
export const requestsLogger = new Logger(requestsLogFilePath);

export const formConnectionLogLine = (socket: Socket): string => {
  const time = new Date().toLocaleString();
  const userAgent = socket.request.headers['user-agent'];
  const res: string = `[${time}] ${userAgent} - New Connection \r\n`;

  return res;
};

interface Props {
  raw?: string;
  json?: {
    type: string,
    query: string,
  };
  imageName?: string;
};

export const formLogLine = ({ raw, json, imageName }: Props, userAgent: string): string => {
  const time = new Date().toLocaleString();

  let res = `[${time}] ${userAgent} - `;

  if (raw) {
    res += raw;
    return `${res}\r\n`;
  }
  if (json) {
    res += `New JSON: ${JSON.stringify(json)}, About ${getCountOfSearchedByQuery(json.query)} results`;
    return `${res}\r\n`;
  }

  if (imageName) {
    res += `New Image: ${imageName} (public link)`;
    return `${res}\r\n`;
  }
  return '';
};
