import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './screens/Home';

export default function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
