// pages/Home.tsx
import { Button, Card, Typography, message, Space, Alert } from 'antd';
import { connectWallet } from '../services/wallet';
import { useWalletStore } from '../store/walletStore';
import { useEffect, useState } from 'react';
import { WalletOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import React from 'react';
import NetworkAlert from '../components/NetworkAlert';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const { Title, Text } = Typography;

const Home = () => {
  const { address, setAddress } = useWalletStore();
  const [network, setNetwork] = useState<string>('未知');

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      message.success('连接成功: ' + addr);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const fetchNetwork = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const net = await provider.getNetwork();
      setNetwork(net.name); // 比如 'homestead'，可转换为 'Ethereum Mainnet'
    }
  };

  useEffect(() => {
    if (address) fetchNetwork();
  }, [address]);

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: '0 auto',}}>
      <Card
        bordered={false}
        style={{ textAlign: 'center',backgroundColor: 'rgba(0, 0, 0, 0)' }}
        cover={
          <img
            alt="wallet"
            src="https://cdn-icons-png.flaticon.com/512/4290/4290854.png"
            style={{ width: 120, margin: '20px auto 0' }}
          />
        }
      >
        <Title level={2}>欢迎使用链上钱包</Title>
        <Text type="secondary">一个连接您与 Web3 世界的安全通道</Text>

        <div style={{ marginTop: 24 }}>
          <Space direction="vertical" size="large">
            <Button
              type="primary"
              icon={<WalletOutlined />}
              size="large"
              onClick={handleConnect}
            >
              {address ? `钱包已连接：${address.slice(0, 6)}...${address.slice(-4)}` : '连接钱包'}
            </Button>

            {
              address && (
                <NetworkAlert />
                // <Alert
                //   message="当前网络"
                //   description={network}
                //   type="success"
                //   showIcon
                //   style={{ marginTop: 16 }}
                // />
              )}
          </Space >
        </div >
      </Card >
    </div >
  );
};

export default Home;
