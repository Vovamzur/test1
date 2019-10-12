import fs, { WriteStream } from 'fs';

export default class Logger {
  private loggerFile: WriteStream;
  constructor(filename: string) {
    this.loggerFile = fs.createWriteStream(filename, { flags: 'a' });
  }

  public write(text: string): boolean {
    return this.loggerFile.write(text);
  }

  public close(): void {
    this.loggerFile.close();
  }
}
