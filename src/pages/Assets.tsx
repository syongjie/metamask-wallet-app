// pages/Assets.tsx
import { Card, Statistic, Row, Col, Button, Space, List, Avatar, Divider } from 'antd';
import { SwapOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';

const mockTokens = [
  {
    name: 'ETH',
    symbol: 'ETH',
    balance: '1.245',
    valueUSD: 4000,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    balance: '2300',
    valueUSD: 2300,
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
];

const Assets = () => {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={24}>
          <Card>
            <Statistic
              title="总资产估值（USD）"
              value={6300}
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
            <Button type="primary" icon={<UploadOutlined />}>转账</Button>
            <Button type="default" icon={<DownloadOutlined />}>收款</Button>
            <Button type="dashed" icon={<SwapOutlined />}>闪兑</Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="代币资产">
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