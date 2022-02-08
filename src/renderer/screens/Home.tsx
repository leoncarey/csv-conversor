import React, { useState } from 'react';
import { Box, Text, useToast } from '@chakra-ui/react';

import { Upload, Button, message, Select, Divider, Tooltip } from 'antd';

import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import FileDownloader from 'renderer/controllers/fileDownloader';

const { Option } = Select;

const Home: React.FC = () => {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [delimiter, setDelimiter] = useState(';');
  const [fileList, setFilelist] = useState([]);
  const [columnFilters, setColumnFilters] = useState([
    'CPF_DEV',
    'NOME_DEV',
    'EMAIL',
  ]);

  const [columnFiltersOutput, setColumnFiltersOutput] = useState([
    'CPF',
    'NOME',
    'EMAIL',
  ]);

  const childrenSelectColumns = _processColumns(columnFilters);
  const childrenSelectColumnsOutput = _processColumns(columnFiltersOutput);

  const handleSubmit = async () => {
    setLoading(true);
    const { success, message }: any = await FileDownloader.processFile(
      delimiter,
      fileList[0],
      columnFilters,
      columnFiltersOutput
    );

    if (success) {
      toast({
        title: 'Arquivo criado!',
        description: 'Verifique o local da exportação.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Ops!',
        description: message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  const changeDelimiter = (value: any) => {
    setDelimiter(value);
  };

  const handleAddColumn = (value: any) => setColumnFilters(value);
  const handleAddColumnOutput = (value: any) => setColumnFiltersOutput(value);

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
    <Box w="100%" h="100%">
      <Text fontSize="40px">Conversor de CSV</Text>
      <Text>
        Configure os filtros para o processamento e envie
        <br />
        seu arquivo CSV/TXT para iniciar a conversão.
      </Text>

      <Divider orientation="left" orientationMargin="0">
        Configurações de input
        <Tooltip
          placement="topLeft"
          title="São as configurações referentes ao arquivo de entrada. Aquele que você irá importar."
        >
          <InfoCircleOutlined
            style={{ marginLeft: 10, cursor: 'pointer', color: '#008dff' }}
          />
        </Tooltip>
      </Divider>

      {/* Delimiter */}
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

      {/* Input Columns */}
      <Box mt={5}>
        <Text mb={1}>
          Digite o nome das colunas do cabeçalho do arquivo que
          <br />
          deseja filtrar
        </Text>

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

      {/* File input */}
      <Box mt={4}>
        <Upload {...optionsUploader}>
          <Button icon={<UploadOutlined />}>Selecione o arquivo...</Button>
        </Upload>
      </Box>

      <Divider orientation="left" orientationMargin="0">
        Configurações de output
        <Tooltip
          placement="topLeft"
          title="São as configurações referentes ao arquivo de saída. Aquele que você irá realizar o download no final do processo."
        >
          <InfoCircleOutlined
            style={{ marginLeft: 10, cursor: 'pointer', color: '#008dff' }}
          />
        </Tooltip>
      </Divider>

      {/* Output Columns */}
      <Box mt={5}>
        <Text mb={1}>
          Digite o nome das colunas do cabeçalho que deseja modificar, de forma
          <br />
          respectiva em relação às colunas de entrada
        </Text>

        <Select
          mode="tags"
          style={{ width: '100%' }}
          defaultValue={columnFiltersOutput}
          placeholder="Digite o nome da coluna e tecle Enter"
          onChange={handleAddColumnOutput}
        >
          {childrenSelectColumnsOutput}
        </Select>
      </Box>

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
  );
};

const _processColumns = (columns: any) => {
  const childrenSelectColumns = [];

  for (const column of columns) {
    childrenSelectColumns.push(<Option key={column}>{column}</Option>);
  }

  return childrenSelectColumns;
};

export default Home;
