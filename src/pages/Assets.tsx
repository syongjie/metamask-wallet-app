import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Button, Space, List, Avatar, Divider } from 'antd';
import { SwapOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { getTokenBalance } from '../utils/Balance ';
import { ethers } from 'ethers';

// const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // 以太坊USDT官方合约地址
const tokenAddress = "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47"; // Bsc测试网合约地址
const Assets = () => {
  const [tokenBalance, setTokenBalance] = useState({
  symbol: 'string',
  balance: 'string',
  rawBalance: 'bigint'
});
const [userAddress, setUserAddress] = useState<string | null>(null);

useEffect(() => {
  const fetchBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);

      const result = await getTokenBalance(address, tokenAddress, provider);
      console.log("Token Balance Result:", result);
      setTokenBalance(result);
    } catch (error) {
      console.error("获取代币余额失败:", error);
    }
  };

  fetchBalance();
}, []);

const mockTokens = [
  {
    name: 'ETH',
    symbol: 'ETH',
    balance: '1.245',
    valueUSD: 4000,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    name: tokenBalance?.symbol || 'USDT',
    symbol: tokenBalance?.symbol || 'USDT',
    balance: tokenBalance?.balance || '0',
    valueUSD: parseFloat(tokenBalance?.balance || '0'),
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
];

return (
  <div style={{ padding: 24 }}>
    <Row gutter={16}>
      <Col span={24}>
        <Card style={{ backgroundColor: 'rgba(196, 138, 138, 0.5)', border: 'none', }}>
          <Statistic
            title="总资产估值（USD）"
            value={mockTokens.reduce((sum, item) => sum + item.valueUSD, 0)}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix="$"
          />
        </Card>
      </Col>
    </Row>

    <Divider />

    <Row gutter={16} style={{ marginBottom: 20 }}>
      <Col>
        <Space>
          <Button style={{ backgroundColor: 'rgba(153, 79, 79, 0.5)', border: 'none' }} type="primary" icon={<UploadOutlined />}>转账</Button>
          <Button style={{ backgroundColor: 'rgba(153, 79, 79, 0.5)', border: 'none' }} type="default" icon={<DownloadOutlined />}>收款</Button>
          <Button style={{ backgroundColor: 'rgba(153, 79, 79, 0.5)', border: 'none' }} type="dashed" icon={<SwapOutlined />}>闪兑</Button>
        </Space>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={24}>
        <Card title="代币资产" style={{ backgroundColor: 'rgba(190, 152, 152, 0.5)', border: 'none' }}>
          <List
            itemLayout="horizontal"
            dataSource={mockTokens}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.icon} />}
                  title={`${item.name} (${item.symbol})`}
                  description={`余额: ${item.balance}`}
                />
                <div>${item.valueUSD}</div>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  </div>
);
};

export default Assets;