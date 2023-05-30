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
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"], // This is always the same for the hardhat node's first account
    },
    moonbase: {
      url: "some/url",
      accounts: ["some/pk"],
    },
  },
};

export default config;