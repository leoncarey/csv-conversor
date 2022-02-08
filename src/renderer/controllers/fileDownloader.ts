import dayjs from 'dayjs';

class FileDownloader {
  static async processFile(delimiter: string, file: any, columnsFilter: any) {
    try {
      const fileReader = new FileReader();
      fileReader.onload = (e) =>
        _loadFileFilterProcesso(e, delimiter, columnsFilter);
      fileReader.readAsText(file);

      return {
        success: true,
        message: '',
      };
    } catch (error: any) {
      console.error('ERROR ON PROCESS ===> ', error);

      return {
        success: false,
        message:
          'Ocorreu algum erro no processamento do arquivo. Por favor, verifique o mesmo e tente novamente.',
      };
    }
  }
}

const _loadFileFilterProcesso = (
  e: any,
  delimiter: string,
  columnsFilter: any
) => {
  const text = e.target?.result;
  const arrayData = _parseStringToArray(text, delimiter);
  const finalData = _filterColumns(arrayData, columnsFilter);
  const finalContent = _parseArrayToString(finalData);

  _generateNewFile(finalContent);
};

const _parseStringToArray = (str: any, delimiter = ';') => {
  const headers = str.slice(0, str.indexOf('\n')).split(delimiter);
  const rows = str.slice(str.indexOf('\n') + 1).split('\n');

  const arrayData = rows
    .map((row: any) => {
      const values = row.split(delimiter);
      const element = headers.reduce((object: any, header: any, index: any) => {
        object[header.replace('\r', '')] = values[index];
        return object;
      }, {});

      return element;
    })
    .filter(
      (element: any) =>
        element[headers[0]] !== undefined && element[headers[0]] !== ''
    );

  return arrayData;
};

const _parseArrayToString = (arrayData: any) => {
  const headers = Object.keys(arrayData[0]);
  let finalContent = `${headers.join(';')};\n`;

  arrayData.forEach((element: any) => {
    headers.forEach((column: any) => {
      finalContent += `${element[column]};`;
    });

    finalContent += '\n';
  });

  return finalContent;
};

const _filterColumns = (arrayData: any, columnsFilter: any) => {
  const finalData = [];

  for (const objectData of arrayData) {
    const finalObject: any = {};

    for (const column of columnsFilter) {
      finalObject[column] = objectData[column];
    }

    finalData.push(finalObject);
  }

  return finalData;
};

const _generateNewFile = (finalContent: string) => {
  const element = document.createElement('a');
  const file = new Blob([finalContent], { type: 'text/csv' });
  element.href = URL.createObjectURL(file);
  element.download = `planilha-filtrada-${dayjs().format('DD-MM-YYYY')}.csv`;
  element.click();
  element.remove();
};

export default FileDownloader;
