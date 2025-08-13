// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { ThemeProvider } from './components/ThemeContext';
import { useTheme } from './components/ThemeContext';
import Home from './pages/Home';
import Assets from './pages/Assets';
import Market from './pages/Market';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import BottomTab from './components/BottomTab';
import './i18n';
import { Layout } from 'antd';

const { Content } = Layout;

const AppWrapper = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

const App = () => {
  const { darkMode } = useTheme();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorBgContainer: darkMode ? '#1f1f1f' : '#ffffff',
        },
      }}
    >
      <Layout style={{ 
        minHeight: '100vh',
        background: darkMode ? '#141414' : '#f5f5f5'
      }}>
        <Content style={{ padding: '0 24px', marginTop: 64 }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/market" element={<Market />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Content>
        <BottomTab />
      </Layout>
    </ConfigProvider>
  );
};

export default AppWrapper;

