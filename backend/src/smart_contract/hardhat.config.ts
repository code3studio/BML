import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [process.env.BASE_PRIVATE_KEY || ""],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: { "base-sepolia": process.env.BASE_SCAN_API_KEY },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};

export default config;
