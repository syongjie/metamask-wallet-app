import {
  Card,
  Typography,
  Space,
  Descriptions,
  Button,
  Divider,
  message,
  Avatar,
  Switch,
  Select,
  Row,
  Col,
} from 'antd';
import {
  CopyOutlined,
  QrcodeOutlined,
  LogoutOutlined,
  SettingOutlined,
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useWalletStore } from '../store/walletStore';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Profile = () => {
  const { address, setAddress } = useWalletStore();
  const [balance, setBalance] = useState<string>('0.0000');
  const [network, setNetwork] = useState<string>('未知');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('zh');

  const fetchWalletData = async () => {
    if (window.ethereum && address) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const net = await provider.getNetwork();
      const bal = await provider.getBalance(address);
      setBalance(ethers.formatEther(bal));
      setNetwork(net.name);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [address]);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      message.success('地址已复制');
    }
  };
  const navigate = useNavigate();
  const handleDisconnect = async () => {
    message.success('已断开钱包连接');
    try {
      // 清除前端状态
      setAddress('');
      localStorage.removeItem('wallet-storage');// 清除 zustand 持久化状态

      // 请求 MetaMask 移除账户连接权限（可选）
      if (window.ethereum && window.ethereum.request) {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
      }

      message.success('已断开钱包连接');
      navigate('/'); // 跳转回首页或其它页面，避免继续留在资产页
    } catch (error) {
      console.error('断开钱包连接失败:', error);
      message.error('断开连接失败，请检查钱包状态');
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Card bordered style={{ background: 'rgba(174, 97, 97, 0.5)', border: 'none' }}>
        <Space align="center" style={{ width: '100%' }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <Title level={4} style={{ marginBottom: 0 }}>
              我的钱包
            </Title>
            {address ? (
              <Space>
                <Text copyable={{ text: address }}>{address}</Text>
                <Button icon={<CopyOutlined />} size="small" onClick={handleCopy}>
                  复制地址
                </Button>
              </Space>
            ) : (
              <Text type="warning">未连接钱包</Text>
            )}
          </div>
        </Space>

        <Divider />

        {address && (
          <>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="余额">{balance} ETH</Descriptions.Item>
              <Descriptions.Item label="网络">{network}</Descriptions.Item>
              <Descriptions.Item label="钱包类型">MetaMask</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Button icon={<QrcodeOutlined />} style={{ background: 'rgba(148, 14, 14, 0.5)' }} block>
                  收款二维码
                </Button>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Button icon={<LogoutOutlined />} danger block onClick={handleDisconnect} style={{ background: 'rgba(148, 14, 14, 0.5)' }}>
                  断开连接
                </Button>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Button icon={<SettingOutlined />} style={{ background: 'rgba(148, 14, 14, 0.5)' }} block>
                  钱包设置
                </Button>
              </Col>
            </Row>

            <Divider />

            <Title level={5}>偏好设置</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <GlobalOutlined />
                <span>语言：</span>
                <Select
                  value={language}
                  onChange={(value) => setLanguage(value)}
                  options={[
                    { label: '简体中文', value: 'zh' },
                    { label: 'English', value: 'en' },
                  ]}
                  style={{ width: 120 }}
                />
              </Space>
              <Space>
                <span>夜间模式：</span>
                <Switch checked={darkMode} onChange={setDarkMode} />
              </Space>
            </Space>
          </>
        )}
      </Card>
    </div>
  );
};

export default Profile;