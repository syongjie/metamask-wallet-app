import { useEffect, useState,useMemo } from 'react';
import { Statistic, Row, Col, Button, Space, List, Avatar, Divider,Skeleton,Empty } from 'antd';
import { SwapOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
// import { getTokenBalance } from '../utils/Balance ';
import { ethers } from 'ethers';
// import { getNativeBalance } from '../utils/NBNbalance';
import { useMultiTokenBalances, type TokenMeta } from '../utils/UseMultitokenBalance';
import { useTranslation } from 'react-i18next';

// USDT余额信息
// const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // 以太坊USDT官方合约地址
// const tokenAddress = "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47"; // Bsc测试网合约地址
const Assets = () => {
  const { t } = useTranslation();
  // type TokenBalance = {
  //   symbol: string;
  //   balance: string;
  //   rawBalance: bigint;
  // };

  // const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  // const [_userAddress, setUserAddress] = useState<string | null>(null);

  // const provider = new ethers.BrowserProvider(window.ethereum);
  const provider = useMemo(() => new ethers.BrowserProvider(window.ethereum), []);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  // const [tokenList, setTokenList] = useState<TokenMeta[]>([]);
  const tokenList = useMemo<TokenMeta[]>(() => [
  {
    name: 'BNB',
    symbol: 'BNB',
    address: null,
    icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    address: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47', // BSC Testnet
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
], []);
  const { balances,loading } = useMultiTokenBalances(userAddress, provider, tokenList);
 
  // 初始化用户地址和代币列表
  useEffect(() => {
    const init = async () => {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);
    };
    init();
  }, []);

  // NBN余额信息
  // useEffect(() => {
  //   const fetchBalance = async () => {
  //     try {
  //       const provider = new ethers.BrowserProvider(window.ethereum);
  //       const signer = await provider.getSigner();
  //       const address = await signer.getAddress();
  //       setUserAddress(address);

  //       const result = await getNativeBalance(address, provider);
  //       console.log("BNB Balance Result:", result);
  //       setTokenBalance(result);
  //     } catch (error) {
  //       console.error("获取 BNB 余额失败:", error);
  //     }
  //   };

  //   fetchBalance();
  // }, []);


  // useEffect(() => {
  //   const fetchBalance = async () => {
  //     try {
  //       const provider = new ethers.BrowserProvider(window.ethereum);
  //       const signer = await provider.getSigner();
  //       const address = await signer.getAddress();
  //       setUserAddress(address);

  //       const result = await getTokenBalance(address, tokenAddress, provider);
  //       console.log("Token Balance Result:", result);
  //       setTokenBalance(result);
  //     } catch (error) {
  //       console.error("获取代币余额失败:", error);
  //     }
  //   };

  //   fetchBalance();
  // }, []);

  // 使用 useMemo 优化 mockTokens 构建
  const mockTokens = useMemo(() => {
    return balances.map(item => {
      const balance = parseFloat(item.balance || '0');
      const valueUSD = isNaN(balance)
        ? 0
        : balance * (item.symbol === 'BNB' ? 500 : 1); // 手动估值逻辑
      return {
        name: item.symbol,
        symbol: item.symbol,
        balance: item.balance,
        valueUSD,
        icon: item.icon,
      };
    });
  }, [balances]);

  const totalValueUSD = useMemo(() => {
    console.log(mockTokens);
    
    if (loading) return 0;
    return mockTokens.reduce((sum, item) => {
      const v = typeof item.valueUSD === 'number' && !isNaN(item.valueUSD) ? item.valueUSD : 0;
      return sum + v;
    }, 0);
  }, [mockTokens, loading]);


  // const mockTokens = [
  //   {
  //     name: 'ETH',
  //     symbol: 'ETH',
  //     balance: '1.245',
  //     valueUSD: 4000,
  //     icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  //   },
  //   {
  //     name: tokenBalance?.symbol || 'USDT',
  //     symbol: tokenBalance?.symbol || 'USDT',
  //     balance: tokenBalance?.balance || '0',
  //     valueUSD: parseFloat(tokenBalance?.balance || '0'),
  //     icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  //   },
  // ];

  return (
    <div style={{ padding: 24 , marginTop:100}}>
      
      <Row gutter={16}>
        <Col span={24}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 1 }} />
          ) : (
            <Statistic  style={{ backgroundColor: 'rgba(190, 152, 152, 0.5)', border: 'none',borderRadius:'20px',minHeight:'100px',padding:'18px 20px', }}
              title={t('assets.totalValue')}
              value={totalValueUSD}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="$"
            />
          )}
        </Col>
      </Row>

      <Divider />

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col>
          <Space>
            <Button style={{ backgroundColor: 'rgba(153, 79, 79, 0.5)', border: 'none' }} type="primary" icon={<UploadOutlined />}>{t('assets.transfer')}</Button>
            <Button style={{ backgroundColor: 'rgba(153, 79, 79, 0.5)', border: 'none' }} type="default" icon={<DownloadOutlined />}>{t('assets.receive')}</Button>
            <Button style={{ backgroundColor: 'rgba(153, 79, 79, 0.5)', border: 'none' }} type="dashed" icon={<SwapOutlined />}>{t('assets.swap')}</Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}  style={{ backgroundColor: 'rgba(190, 152, 152, 0.5)', border: 'none',borderRadius:'20px', }}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : !userAddress ? (
            <Empty description={t('assets.connectWallet')} />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={mockTokens}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.icon} />}
                    title={`${item.name} (${item.symbol})`}
                    description={`${t('assets.balance')}: ${item.balance}`}
                  />
                  <div>${item.valueUSD.toFixed(2)}</div>
                </List.Item>
              )}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Assets;