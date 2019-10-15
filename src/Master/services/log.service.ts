import { connectionsLogFilePath, requestsLogFilePath } from '../config/log.config';
import Logger from './Logger';
import { getGoogleResultCount } from './../services/google.service';

export const connectionLogger = new Logger(connectionsLogFilePath);
export const requestsLogger = new Logger(requestsLogFilePath);

export const formConnectionLogLine = (userAgent: string): string => {
  const time = new Date().toLocaleString();
  const res: string = `[${time}] ${userAgent} - New Connection \r\n`;

  return res;
};

interface Props {
  raw?: string;
  json?: {
    type: string;
    query: string;
  };
  imageName?: string;
}

export const formLogLine = async (
  { raw, json, imageName }: Props,
  userAgent: string,
): Promise<string> => {
  const time = new Date().toLocaleString();

  let res = `[${time}] ${userAgent} - `;

  if (raw) {
    res += raw;
    return `${res}\r\n`;
  }
  if (json) {
    try {
      const count = await getGoogleResultCount(json.query);
      res += `New JSON: ${JSON.stringify(json)}, About ${count} results`;

      return `${res}\r\n`;
    } catch (err) {
      throw err;
    }
  }

  if (imageName) {
    res += `New Image: ${imageName} (public link)`;
    return `${res}\r\n`;
  }
  return '';
};
