import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "actualHardhat",
  networks: {
    hardhat: {
    },
    actualHardhat: {
      url: "http://127.0.0.1:8545",
    },
//     moonbase: {
//       url: "some/url",
//       accounts: ["some/pk"],
//     },
  },
};

export default config;
