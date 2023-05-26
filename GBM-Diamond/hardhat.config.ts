import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    moonbase: {
      url: "some/url",
      accounts: ["some/account"],
    },
    sidechain: {
      url: "some/url",
      accounts: ["some/account"],
    },
  },
};

export default config;