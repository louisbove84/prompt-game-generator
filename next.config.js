/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for React Native async-storage warning
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
      };
    }
    
    // Ignore WalletConnect SDK warnings
    config.ignoreWarnings = [
      { module: /@walletconnect/ },
      { module: /@metamask\/sdk/ },
    ];

    return config;
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
