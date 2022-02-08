import React, { useState } from 'react';
import { Box, Text, ChakraProvider } from '@chakra-ui/react';

import { Upload, Button, message, Select } from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import FileDownloader from 'renderer/controllers/fileDownloader';

const { Option } = Select;

const Home: React.FC = () => {
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const [delimiter, setDelimiter] = useState(';');
  const [fileList, setFilelist] = useState([]);
  const [columnFilters, setColumnFilters] = useState([
    'CPF_DEV',
    'NOME_DEV',
    'EMAIL',
  ]);

  const childrenSelectColumns = [];
  for (const column of columnFilters) {
    childrenSelectColumns.push(<Option key={column}>{column}</Option>);
  }

  const handleSubmit = async () => {
    setLoading(true);
    await FileDownloader.processFile(delimiter, fileList[0], columnFilters);
    setLoading(false);
  };

  const changeDelimiter = (value: any) => {
    setDelimiter(value);
  };

  const handleAddColumn = (value: any) => setColumnFilters(value);

  const optionsUploader = {
    onRemove: () => {
      setFilelist([]);
    },
    beforeUpload: (file: any) => {
      setFilelist([]);

      const isCSVorText =
        file.type === 'text/csv' || file.type === 'text/plain';
      if (!isCSVorText) {
        message.error(`${file.name} não é um arquivo do tipo CSV ou TXT.`);
      }

      if (isCSVorText) setFilelist([file as never]);

      return false;
    },
    fileList,
  };

  return (
    <ChakraProvider>
      <Box w="100%" h="100%">
        <Text fontSize="40px">Filtrador de CSV</Text>
        <Text>
          Configure os filtros para o processamento do arquivo e envie
          <br />
          seu arquivo CSV/TXT para iniciar a conversão.
        </Text>

        <Box mt={5}>
          <Text mb={1}>Escolha o delimitador</Text>

          <Select
            style={{ width: '100%' }}
            defaultValue=";"
            placeholder="Escolha o delimitador"
            optionFilterProp="children"
            onChange={changeDelimiter}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value=";">Ponto e vírgula(;)</Option>
            <Option value=",">Vírgula (,)</Option>
          </Select>
        </Box>

        <Box mt={5}>
          <Text mb={1}>Digite o nome das colunas que deseja filtrar</Text>

          <Select
            mode="tags"
            style={{ width: '100%' }}
            defaultValue={columnFilters}
            placeholder="Digite o nome da coluna e tecle Enter"
            onChange={handleAddColumn}
          >
            {childrenSelectColumns}
          </Select>
        </Box>

        <Box mt={4}>
          <Upload {...optionsUploader}>
            <Button icon={<UploadOutlined />}>Selecione o arquivo...</Button>
          </Upload>
        </Box>

        {error !== '' && (
          <Box w="100%" mt={1}>
            <Text fontSize="xs" color="red.300">
              {error}
            </Text>
          </Box>
        )}

        <Button
          type="primary"
          size="large"
          disabled={fileList.length === 0}
          loading={loading && columnFilters.length !== 0}
          style={{ marginTop: 30 }}
          onClick={handleSubmit}
        >
          Processar arquivo
        </Button>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
