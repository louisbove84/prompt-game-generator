import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "dotenv/config";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Base Mainnet
    base: {
      url: process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org",
      accounts: process.env.NFT_MINTER_PRIVATE_KEY 
        ? [process.env.NFT_MINTER_PRIVATE_KEY]
        : [],
      chainId: 8453,
    },
    // Base Sepolia Testnet (for testing)
    baseSepolia: {
      url: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.NFT_MINTER_PRIVATE_KEY 
        ? [process.env.NFT_MINTER_PRIVATE_KEY]
        : [],
      chainId: 84532,
    },
    // Local hardhat network for testing
    hardhat: {
      chainId: 31337
    }
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY || "",
      baseSepolia: process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
