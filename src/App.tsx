// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Assets from './pages/Assets';
import Market from './pages/Market';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import BottomTab from './components/BottomTab';
import './i18n'

const App = () => {
  return (
    <div style={{ paddingBottom: 60 }}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/market" element={<Market />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomTab />
    </div>
  );
};

export default App;

