// pages/Discover.tsx
import { Card, Typography, Avatar, Tag, Row, Col, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const dapps = [
  {
    name: 'Uniswap',
    description: '去中心化交易平台，支持Token闪兑',
    icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    type: 'DeFi',
    url: 'https://app.uniswap.org',
  },
  {
    name: 'OpenSea',
    description: '全球最大NFT市场',
    icon: 'https://opensea.io/static/images/logos/opensea.svg',
    type: 'NFT',
    url: 'https://opensea.io',
  },
  {
    name: 'Zapper',
    description: '资产管理 & DeFi 控制台',
    icon: 'https://zapper.fi/favicon.ico',
    type: '工具',
    url: 'https://zapper.fi',
  },
];

const Discover = () => {
  const { t } = useTranslation();
  return (
    <div style={{ padding: 24 , marginTop:100}}>
      <Title level={2} style={{ color: 'white' }}>{t('discover.title')}</Title>
      <Text type="secondary" style={{ color: 'white' }}>{t('disconnect.connectPrompt')}</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {dapps.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.name}>
            <Card hoverable style={{ background: 'rgba(206, 163, 163, 0.5)', border: 'none' }}>
              <Card.Meta
                avatar={<Avatar src={item.icon} size="large" />}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.name}</span>
                    <Tag color="blue">{item.type}</Tag>
                  </div>
                }
                description={<Text type="secondary">{item.description}</Text>}
              />
              <Button
                type="primary"
                block
                style={{ marginTop: 16, background: 'rgba(148, 14, 14, 0.5)' }}
                onClick={() => window.open(item.url, '_blank')}
              >
                {t('discover.openDapp')}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Discover;