import { useState, useMemo, useEffect } from 'react';
import { 
  Statistic, Row, Col, Button, Space, List, Avatar, Divider, 
  Skeleton, Empty, Modal, Form, Input, Select, message 
} from 'antd';
import { SwapOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import { useMultiTokenBalances, type TokenMeta } from '../utils/UseMultitokenBalance';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeContext';

const { Option } = Select;

const Assets = () => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const [form] = Form.useForm();
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenMeta | null>(null);

  const provider = useMemo(() => new ethers.BrowserProvider(window.ethereum), []);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  
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

  const { balances, loading } = useMultiTokenBalances(userAddress, provider, tokenList);

  useEffect(() => {
    const init = async () => {
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
      } catch (error) {
        console.error(t('fetch_address_error'), error);
      }
    };
    init();
  }, [provider, t]);

  const mockTokens = useMemo(() => {
    return balances.map(item => ({
      ...item,
      valueUSD: parseFloat(item.balance || '0') * (item.symbol === 'BNB' ? 500 : 1)
    }));
  }, [balances]);

  const totalValueUSD = useMemo(() => {
    return loading ? 0 : mockTokens.reduce((sum, item) => sum + (item.valueUSD || 0), 0);
  }, [mockTokens, loading]);

  // 转账功能
  const handleTransfer = async (values: {
    token: string;
    amount: string;
    recipient: string;
  }) => {
    setTransferLoading(true);
    try {
      const token = tokenList.find(t => t.symbol === values.token);
      if (!token) throw new Error(t('token_not_found'));

      const signer = await provider.getSigner();
      
      if (token.address) {
        // ERC20 代币转账
        const contract = new ethers.Contract(
          token.address,
          ['function transfer(address to, uint256 amount) returns (bool)'],
          signer
        );
        const tx = await contract.transfer(
          values.recipient,
          ethers.parseUnits(values.amount, 18) // 假设都是18位小数
        );
        await tx.wait();
      } else {
        // 原生币转账 (如BNB/ETH)
        const tx = await signer.sendTransaction({
          to: values.recipient,
          value: ethers.parseEther(values.amount)
        });
        await tx.wait();
      }

      message.success(t('transfer_success'));
      setTransferModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(t('transfer_error'), error);
      message.error(t('transfer_failed'));
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div style={{ 
      color: darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
      padding: 24, 
      marginTop: 100
    }}>
      {/* 资产概览 */}
      <Row gutter={16}>
        <Col span={24}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 1 }} />
          ) : (
            <Statistic
              style={{ 
                backgroundColor: darkMode ? 'rgba(74, 74, 74, 0.5)' : 'rgba(190, 152, 152, 0.5)',
                border: 'none',
                borderRadius: '20px',
                minHeight: '100px',
                padding: '18px 20px',
              }}
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

      {/* 操作按钮 */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col>
          <Space>
            <Button 
              style={{ 
                backgroundColor: darkMode ? 'rgba(100, 50, 50, 0.5)' : 'rgba(153, 79, 79, 0.5)',
                border: 'none'
              }} 
              type="primary" 
              icon={<UploadOutlined />}
              onClick={() => setTransferModalVisible(true)}
            >
              {t('assets.transfer')}
            </Button>
            <Button 
              style={{ 
                backgroundColor: darkMode ? 'rgba(100, 50, 50, 0.5)' : 'rgba(153, 79, 79, 0.5)',
                border: 'none'
              }} 
              type="default" 
              icon={<DownloadOutlined />}
            >
              {t('assets.receive')}
            </Button>
            <Button 
              style={{ 
                backgroundColor: darkMode ? 'rgba(100, 50, 50, 0.5)' : 'rgba(153, 79, 79, 0.5)',
                border: 'none'
              }} 
              type="dashed" 
              icon={<SwapOutlined />}
            >
              {t('assets.swap')}
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 资产列表 */}
      <Row gutter={16}>
        <Col span={24} style={{ 
          backgroundColor: darkMode ? 'rgba(74, 74, 74, 0.5)' : 'rgba(190, 152, 152, 0.5)',
          border: 'none',
          borderRadius: '20px',
        }}>
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

      {/* 转账模态框 */}
      <Modal
        title={t('assets.transfer')}
        open={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        footer={null}
        centered
        styles={{
          header: { background: darkMode ? '#1f1f1f' : undefined },
          content: { background: darkMode ? '#1f1f1f' : undefined },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTransfer}
          initialValues={{ token: mockTokens[0]?.symbol }}
        >
          <Form.Item
            name="token"
            label={t('assets.token')}
            rules={[{ required: true, message: t('token_required') }]}
          >
            <Select
              placeholder={t('select_token')}
              onChange={(value) => setSelectedToken(tokenList.find(t => t.symbol === value) || null)}
            >
              {mockTokens.map(token => (
                <Option key={token.symbol} value={token.symbol}>
                  <Space>
                    <Avatar src={token.icon} size="small" />
                    {token.name} ({token.symbol})
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label={t('assets.amount')}
            rules={[
              { required: true, message: t('amount_required') },
              { 
                validator: (_, value) => {
                  if (value && parseFloat(value) <= 0) {
                    return Promise.reject(new Error(t('amount_invalid')));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              placeholder={t('enter_amount')} 
              suffix={selectedToken?.symbol} 
              type="number"
            />
          </Form.Item>

          <Form.Item
            name="recipient"
            label={t('assets.recipient')}
            rules={[
              { required: true, message: t('recipient_required') },
              {
                validator: (_, value) => {
                  if (value && !ethers.isAddress(value)) {
                    return Promise.reject(new Error(t('address_invalid')));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input placeholder={t('enter_recipient_address')} />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={transferLoading}
              block
            >
              {t('confirm_transfer')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Assets;