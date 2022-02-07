import fs from 'fs';

class FileDownloader {
  static async readFile(file: any) {
    const fileBlob = new Blob(file);
    console.info(fileBlob);
  }

  static createDownloader() {
    const fileStream = fs.createWriteStream('');
  }
}

export default FileDownloader;
