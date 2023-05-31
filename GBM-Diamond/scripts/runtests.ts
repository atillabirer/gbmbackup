let deploy = require("./deploy.ts");
import { ethers } from "hardhat";

let conf = JSON.parse(require("../gbm.config.ts").conf);

const AUTOMATED_TEST:boolean = true;

async function  main(){
    let wallets = await ethers.getSigners()
    //await deploy.HardhatNetworkSetup_Before(wallets[1].address);
    await deploy.main(true);
    //await deploy.HardhatNetworkSetup_After(wallets[1].address, 0);
}

main();