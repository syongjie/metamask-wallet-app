// pages/Market.tsx
import { Table, Avatar, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';


const Market = () => {
  const { t } = useTranslation();

  interface TokenMarket {
    key: string;
    name: string;
    symbol: string;
    icon: string;
    price: number;
    change24h: number;
    network: string;
  }

  const data: TokenMarket[] = [
    {
      key: '1',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      price: 3500.23,
      change24h: 1.56,
      network: 'Ethereum',
    },
    {
      key: '2',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      price: 64000.87,
      change24h: -2.13,
      network: 'Bitcoin',
    },
    {
      key: '3',
      name: 'Tether USD',
      symbol: 'USDT',
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      price: 1.00,
      change24h: 0.01,
      network: 'Ethereum',
    },
  ];

  const columns: ColumnsType<TokenMarket> = [
    {
      title: t('market.token'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.icon} style={{ marginRight: 8 }} />
          <div>
            <div>{record.name}</div>
            <small>{record.symbol}</small>
          </div>
        </div>
      ),
    },
    {
      title: t('market.price'),
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (val) => `$${val.toFixed(2)}`,
    },
    {
      title: t('market.change24h'),
      dataIndex: 'change24h',
      key: 'change24h',
      sorter: (a, b) => a.change24h - b.change24h,
      render: (val) => (
        <span style={{ color: val >= 0 ? 'green' : 'red' }}>
          {val >= 0 ? '+' : ''}
          {val.toFixed(2)}%
        </span>
      ),
    },
    {
      title: t('market.network'),
      dataIndex: 'network',
      key: 'network',
      render: (network) => <Tag color="blue">{network}</Tag>,
    },
  ];

  return (
    <div style={{ padding: 24 , marginTop:100}}>
      <h2 style={{ color: 'white' }}>{t('market.title')}</h2>
      <Table
        style={{ background: 'rgba(153, 79, 79, 0.5)', border: 'none' }}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Market;
