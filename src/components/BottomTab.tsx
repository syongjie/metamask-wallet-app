// components/BottomTab.tsx
import { HomeOutlined, WalletOutlined, AppstoreOutlined, CompassOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeContext';

const BottomTab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const iconStyle = { fontSize: '20px' };

  const gohome = () => {
    navigate('/', { replace: true })
  }

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      style={{ position: 'fixed', top: 0, width: '100%', height: 70, zIndex: 100, borderTop: `1px solid ${darkMode ? '#303030' : '#eee'}`, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', fontSize: 20,  backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(161, 155, 155, 0.5)' }}
    >
      <img src="/vite.svg" style={{'width':60,'height':60}} alt="" onClick={gohome} />
      <Menu.Item key="/home" icon={<HomeOutlined style={iconStyle} />}> {t('bottomTab.home')}</Menu.Item>
      <Menu.Item key="/assets" icon={<WalletOutlined style={iconStyle} />}> {t('bottomTab.assets')}</Menu.Item>
      <Menu.Item key="/market" icon={<AppstoreOutlined style={iconStyle} />}>{t('bottomTab.market')}</Menu.Item>
      <Menu.Item key="/discover" icon={<CompassOutlined style={iconStyle} />}>{t('bottomTab.discover')}</Menu.Item>
      <Menu.Item key="/profile" icon={<UserOutlined style={iconStyle} />}>{t('bottomTab.profile')}</Menu.Item>
    </Menu>
  );
};

export default BottomTab;
