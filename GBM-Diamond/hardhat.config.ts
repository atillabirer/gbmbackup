import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "actualHardhat",
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: [10000, 30000]
      }
    }, 
    actualHardhat:{
      url: "http://127.0.0.1:8545"
    },
    moonbaseAlpha:{
      url: "https://rpc.api.moonbase.moonbeam.network",
      //accounts:[""]
    }
  },
};

export default config;
