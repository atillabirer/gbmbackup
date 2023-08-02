import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/types";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "moonbaseAlpha",
  networks: {
    hardhat: { //Network you should set as default for unit testing
      mining: {
        auto: true,
        interval: [10000, 30000]
      }
    },  
    localHardhat:{  // Network you should set as default if testing with the local hardhat option. Will accept any metamask address and impersonate it
      url: "http://127.0.0.1:8545"
    },
    remoteHardhat:{  //Network you should set as default if testing with the live blockchain 👷 ⚙️ 🦊 option. Don't forget to add your pkey.
      url: "http://127.0.0.1:8545",
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"] 
    },
    moonbaseAlpha:{ //Add remote chain in this fastion, don't forget to add your private key.
      url: "https://moonbase-alpha.blastapi.io/10dcf058-6db2-4fa6-a575-7a46cbc3aed2",
      accounts: {
        mnemonic: process.env.MNEMONIC
      } 
    }
  },
};

export default config;
