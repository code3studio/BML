import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks:{
    sepolia:{
      url: "https://sepolia.infura.io/v3/fde4c628df0343768e2195c54e4adae7",
      accounts:["eb1ed06f3575252fac37688ef2cadfc4512e67506c16a1b70f9b9ce82e47e8f7"]
    }
  },
  etherscan:{
    apiKey:"7QK4X65F8YVS41S6SEIPCGVFAU4NB34GKM"
  }
};

export default config;
