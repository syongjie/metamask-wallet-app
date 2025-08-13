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
  Modal, // 导入 Modal 组件
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
import { useTranslation } from 'react-i18next'; // 引入 useTranslation

const { Title, Text } = Typography;

const Profile = () => {
  const { t, i18n } = useTranslation(); // 使用 useTranslation Hook
  const { address, setAddress } = useWalletStore();
  const [balance, setBalance] = useState('0.0000');
  const [network, setNetwork] = useState('未知');
  const [darkMode, setDarkMode] = useState(false);
  // const [language, setLanguage] = useState('zh');


  useEffect(() => {
    fetchWalletData();
  }, [address]);

  // 语言切换处理函数
  const handleLanguageChange = (value:any) => {
    i18n.changeLanguage(value);
  };
  // ... (其他函数保持不变)


  // 新增状态：控制收款二维码模态框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      // document.execCommand('copy') 是兼容性更好的方法
      // navigator.clipboard.writeText(address);
      const tempElement = document.createElement('textarea');
      tempElement.value = address;
      document.body.appendChild(tempElement);
      tempElement.select();
      document.execCommand('copy');
      document.body.removeChild(tempElement);
      message.success('地址已复制');
    }
  };

  const navigate = useNavigate();
  const handleDisconnect = async () => {
    try {
      // 清除前端状态
      setAddress('');
      localStorage.removeItem('wallet-storage'); // 清除 zustand 持久化状态

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

  // 新增函数：显示收款二维码模态框
  const showQRCodeModal = () => {
    setIsModalVisible(true);
  };

  // 新增函数：隐藏收款二维码模态框
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto', marginTop:100 }}>
       <Card bordered style={{ background: 'rgba(174, 97, 97, 0.5)', border: 'none' }}>
        <Space align="center" style={{ width: '100%' }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <Title level={4} style={{ marginBottom: 0 }}>
              {t('wallet_title')} {/* 使用 t() 函数获取翻译文本 */}
            </Title>
            {address ? (
              <Space>
                <Text copyable={{ text: address }}>{address}</Text>
                <Button icon={<CopyOutlined />} size="small" onClick={handleCopy}>
                  {t('copy_address')}
                </Button>
              </Space>
            ) : (
              <Text type="warning">{t('wallet_disconnected')}</Text>
            )}
          </div>
        </Space>

        <Divider />

        {address && (
          <>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('balance')}>{balance} ETH</Descriptions.Item>
              <Descriptions.Item label={t('network')}>{network}</Descriptions.Item>
              <Descriptions.Item label={t('wallet_type')}>MetaMask</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Button icon={<QrcodeOutlined />} style={{ background: 'rgba(148, 14, 14, 0.5)' }} block onClick={showQRCodeModal}>
                  {t('receive_qr_code')}
                </Button>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Button icon={<LogoutOutlined />} danger block onClick={handleDisconnect} style={{ background: 'rgba(148, 14, 14, 0.5)' }}>
                  {t('disconnect')}
                </Button>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Button icon={<SettingOutlined />} style={{ background: 'rgba(148, 14, 14, 0.5)' }} block>
                  {t('wallet_settings')}
                </Button>
              </Col>
            </Row>

            <Divider />

            <Title level={5}>{t('preferences')}</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <GlobalOutlined />
                <span>{t('language')}:</span>
                <Select
                  value={i18n.language} // 绑定当前语言
                  onChange={handleLanguageChange} // 使用新的切换函数
                  options={[
                    { label: t('language_zh'), value: 'zh' },
                    { label: t('language_en'), value: 'en' },
                  ]}
                  style={{ width: 120 }}
                />
              </Space>
              <Space>
                <span>{t('dark_mode')}:</span>
                <Switch checked={darkMode} onChange={setDarkMode} />
              </Space>
            </Space>
          </>
        )}
      </Card>
      {/* 新增：收款二维码模态框 */}
      <Modal
        title="收款二维码"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null} // 移除底部按钮
        centered
        width={320}
      >
        <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
          <p>请扫描以下二维码进行收款。</p>
          {address && (
            <>
              {/* 这里使用占位符图片，因为它不需要额外的库 */}
              {/* 如果需要真实的二维码，可以安装 qrcode.react 库 */}
              <img
                src={`https://placehold.co/200x200/2563EB/ffffff?text=${address.substring(0, 8)}...`}
                alt="QR Code"
                style={{ borderRadius: '8px' }}
              />
              <Text code copyable>{address}</Text>
            </>
            
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default Profile;
