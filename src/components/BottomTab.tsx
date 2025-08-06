// components/BottomTab.tsx
import { HomeOutlined, WalletOutlined, AppstoreOutlined, CompassOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';

const BottomTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 100, borderTop: '1px solid #eee',display: 'flex',justifyContent:'center', backgroundColor: 'rgba(161, 155, 155, 0.5)' }}
    >
      <Menu.Item key="/home" icon={<HomeOutlined />}>首页</Menu.Item>
      <Menu.Item key="/assets" icon={<WalletOutlined />}>资产</Menu.Item>
      <Menu.Item key="/market" icon={<AppstoreOutlined />}>市场</Menu.Item>
      <Menu.Item key="/discover" icon={<CompassOutlined />}>发现</Menu.Item>
      <Menu.Item key="/profile" icon={<UserOutlined />}>我的</Menu.Item>
    </Menu>
  );
};

export default BottomTab;
    