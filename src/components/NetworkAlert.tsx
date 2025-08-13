// 当前网络
import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';


const NetworkAlert: React.FC = () => {
  const { t } = useTranslation();
  const [network, setNetwork] = useState<string | null>(null);

  // 可选：网络名称映射
  const networkMap: Record<string, string> = {
    homestead: t('networks.ethereumMainnet'),
    sepolia: t('networks.sepoliaTestnet'),
    goerli: t('networks.goerliTestnet'),
    polygon: t('networks.polygonMainnet'),
  };

  useEffect(() => {
    const fetchNetwork = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const net = await provider.getNetwork();
          // console.log("当前网络",net);
          // const name = networkMap[net.name] || `当前网络 (${net.name})`;
          // setNetwork(name);
          const name = networkMap[net.name] || t('networks.unknownNetwork', { name: net.name });
          setNetwork(name);

        } catch (err) {
          console.error('获取网络失败:', err);
          setNetwork('无法获取网络');
        }
      } else {
        setNetwork('未检测到 MetaMask');
      }
    };

    fetchNetwork();

    // 可选：监听网络变更
    const ethereum = (window as any).ethereum;
    if (ethereum && ethereum.on) {
      ethereum.on('chainChanged', fetchNetwork);
      ethereum.on('connect', fetchNetwork);
    }

    return () => {
      if (ethereum && ethereum.removeListener) {
        ethereum.removeListener('chainChanged', fetchNetwork);
        ethereum.removeListener('connect', fetchNetwork);
      }
    };
  }, []);

  if (!network) return null;

  return (
    <Alert
      message={t('networks.currentNetwork')}
      description={network}
      type="success"
      showIcon
      style={{ marginBottom: 16 }}
    />
  );
};

export default NetworkAlert;