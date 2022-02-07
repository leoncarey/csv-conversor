import React, { useState } from 'react';
import { Box, Text, ChakraProvider } from '@chakra-ui/react';

import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import FileDownloader from 'renderer/controllers/fileDownloader';

const Home: React.FC = () => {
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const [fileList, setFilelist] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    await FileDownloader.readFile(fileList[0]);
    setLoading(false);
  };

  const options = {
    onRemove: () => {
      setFilelist([]);
    },
    beforeUpload: (file: any) => {
      setFilelist([]);

      const isCSVorText =
        file.type === 'text/csv' || file.type === 'text/plain';
      if (!isCSVorText) {
        message.error(`${file.name} não é um arquivo CSV.`);
      }

      if (isCSVorText) setFilelist([file as never]);

      return false;
    },
    fileList,
  };

  return (
    <ChakraProvider>
      <Box w="100%" h="100%">
        <Text fontSize="lg">Conversor CSV</Text>
        <Text>Envie seu arquivo CSV para iniciar o tratamento.</Text>

        <Box mt={4}>
          <Upload {...options}>
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
          loading={loading}
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
