import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { isMobile } from '../utils/isMobile';
import BottomTab from '../components/BottomTab';

const { Header, Content } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = isMobile();

  const menuItems = [
    { key: '/', label: '首页' },
    { key: '/assets', label: '资产' },
    { key: '/market', label: '市场' },
    { key: '/discover', label: '发现' },
    { key: '/profile', label: '我的' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!mobile && (
        <Header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff' }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            items={menuItems}
            style={{ justifyContent: 'center' }}
          />
        </Header>
      )}

      <Content style={{ padding: mobile ? '12px 8px 60px' : '24px 48px' }}>
        {children}
      </Content>

      {mobile && <BottomTab />}
    </Layout>
  );
};

export default MainLayout;