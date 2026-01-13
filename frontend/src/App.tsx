// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AboutPage from './components/AboutPage';
import ChainExplorer from './components/ChainExplorer';
import Portal from './components/Portal';

export default function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/explorer" element={<ChainExplorer />} />
          <Route path="/portal" element={<Portal />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}