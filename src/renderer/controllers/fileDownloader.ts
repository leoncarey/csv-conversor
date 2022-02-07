class FileDownloader {
  static async readFile(file: any) {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const text = e.target?.result;
      console.info('TEXT ===================================> ', text);
    };

    fileReader.readAsText(file);

    // const content = "File content to save";
    // const element = document.createElement("a");
    // const file = new Blob([content], {type: "text/plain"});
    // element.href = URL.createObjectURL(file);
    // element.download = "file.txt";
    // element.click();
  }

  static createDownloader() {
    // const fileStream = fs.createWriteStream('');
  }
}

export default FileDownloader;
