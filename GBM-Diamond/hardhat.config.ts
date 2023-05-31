import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "actualHardhat",
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: [3000, 6000]
      }
    }, 
    actualHardhat:{
      url: "http://127.0.0.1:8545"
    }
  },
};

export default config;
