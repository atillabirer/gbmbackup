/*

The GBM is a diamond, meaning it's a proxy smart contract where each function abi is associated with a remote, code only, facet smart contract.
The main proxy contract (called the diamond) is gonna then use it's fallaback function to delegatecall those asssociated facet depending on the first bytes4 of the call.

The deployment of the GBM dapp is made of the following steps : 
-First deploy the facet contract that allows you to register function on the diamond
-Then deploy the diamond with the facetcut address as an argument
-Deploy all the remote facets
-Register them in the diamond
-Setup and register your marketplace settings


As you can imagine, different features of the marketplace requires different facets, and not every GBM client will all have the same facets installed.

In order to allow a robust deployment with good error handling, each blockchain transaction necessary to deploy and setup the ecosystem have been associated with a hash.

A list of those hash can then form a sequence to have a full deployment that is able to be interrupted/node crash resistant/done from either metamask or hardhat, etc...

The current hash are as follow:

f_d_xxxx => facet deploy, deploy the corresponding facet, eg f_d_DiamondCutFacet. It will return the facet deployed address   
d_d => diamond_deploy : it will deploy a diamond using the latest known deployed DiamondCutFacet
d_c => diamond_cut: It will cut the latest known diamond with all the known deployed facets
d_c_xxxxx => same as above but only for a specific facet
d_u => It will update the diamond with all the known deployed faets
d_u_xxxxx => same as above but only for a specific facet
d_i => Diamond init, to be called after facets cuts but before the rest of the other settings
s_p_xx => setup preset number xx; eg : s_p_0 : Will register the GBM preset found at position 1 in the gbm preset aray in gbm.config.ts
s_c_xx => same as above but for currencies. use s_c_xx_yyyy to use yy as the currency address
s_a_xxxx => setup the new GBM admin to be the wallet at address xxxx

Special codes :
d_h_b_xxxx => Hardat demo before : will allow hardhat to impersonate wallet address xxxx for a metamaskless deployment with a metmask wallet. Also topup this wallet with beeg money
d_t_l_xx => demo test live step xx : Will create ERC721 and ERC1155 contracts, erc20 contracts, transfer them to the connected wallets, and starts auction to be normally interected with by frontend
d_t_a_xx => Same as above but automated. Include time skips.


Here is a a sample "standard deployment" sequence:

[
    "f_d_DiamondCutFacet",
    "d_d",
    "f_d_DiamondInitFacet",
    "f_d_DiamondLoupeFacet",
    "f_d_OwnershipFacet",
    "f_d_GBMAdminFacet",
    "f_d_GBMAuctionBiddingFacet",
    "f_d_GBMCurrencyFacet",
    "f_d_GBMEscrowFacet_Tracking",
    "f_d_GBMGettersFacet",
    "f_d_GBMPrimaryAndSecondaryAuctionRegistrationFacet",
    "f_d_GBMDirectSalePrimaryAndSecondaryFacet",
    "d_c",
    "d_i",
    "s_p_0",
    "s_p_1",
    "s_c_0",
    "s_a_0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
]


On top fo those sequence, the JSON object deployerStatus can be exported/imported to restore a configuration state of the deployment process


*/


const hre = require("hardhat");
const prompt = require("prompt-sync")();
const { getSelectors, FacetCutAction } = require("./libraries/diamond.ts");
import { ethers } from "hardhat";
import config from "../hardhat.config";

let hardhatHelpers = require("@nomicfoundation/hardhat-network-helpers");  // << Required for time dependendant test

var conf: any;
conf = JSON.parse(require("../gbm.config.ts").conf);

let wallets = await ethers.getSigners()
let signer = wallets[0]; //This signer object is gonna use to create every contract factory in a JIT fashion

let deployerStatus:any = {}; //The current status of the deployment
deployerStatus.commandHistory = [];
deployerStatus.deployedFacets = {};

export function setDeployerStatus(_deployerStatus: string) {
    deployerStatus = JSON.parse(_deployerStatus);
}

export function getDeployerStatus(){
    return JSON.stringify(deployerStatus);
}


export async function performDeploymentStep(step: string) {
    console.log("" + step + "?");

    switch(step.substring(0,3)){
        case "f_d":
            return [("" + step), (deployerStatus.deployedFacets[step.substring(4)])];

        
    }
}


async function doStep_f_d(arg:string){
    let gasPrice = await fetchGasPrice();
    const Facet = await ethers.getContractFactory(arg.substring(4), signer);
    const facet = await Facet.deploy({
        gasPrice: gasPrice
    });
    await facet.deployed();
    deployerStatus.commandHistory.push(arg);
    deployerStatus.deployedFacets[arg.substring(4)] = facet.address;
}















async function fetchGasPrice() {
    return 20000000000;
}