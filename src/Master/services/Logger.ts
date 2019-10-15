import fs, { WriteStream } from 'fs';

export default class Logger {
  private loggerFile: WriteStream;
  constructor(filename: string) {
    this.checkAndCreateDir();
    this.loggerFile = fs.createWriteStream(filename, { flags: 'a' });
  }

  public write(text: string): boolean {
    console.log(text);
    return this.loggerFile.write(text);
  }

  public close(): void {
    this.loggerFile.close();
  }

  private checkAndCreateDir(): void {
    const logDir = './src/Master/logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
  }
}
