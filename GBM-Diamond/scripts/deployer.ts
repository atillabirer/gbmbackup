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
s_p_xx => setup preset number xx; eg : s_p_1 : Will register the GBM preset found at position 1 in the gbm preset aray in gbm.config.ts
s_c_xx => same as above but for currencies. use s_c_xx_yyyy to ovveride with yy as the currency address
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
    "s_p_1",
    "s_p_2",
    "s_c_1",
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

let wallets:any; //= await ethers.getSigners()
let signer:any; //= wallets[0]; //This signer object is gonna be used to create every contract factory in a JIT fashion

let deployerStatus:any = {}; //The current status of the deployment
deployerStatus.commandHistory = [];
deployerStatus.deployedFacets = {};
let tokenURIList = require("./libraries/NFTTestList.json").nftarray;

async function init(){
    wallets =  await ethers.getSigners();
    signer =  wallets[0];
    return;
}

//Potential race condition if the deploy script is called just after having been initalized
//init(); 

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
            {
                await doStep_f_d(step);
                deployerStatus.commandHistory.push(step);
                console.log("=> " + step + "");
                return [("" + step), (deployerStatus.deployedFacets[step.substring(4)])];
            }
        case "d_d":
            {
                await doStep_d_d();
                deployerStatus.commandHistory.push(step);
                console.log("=> " + step + "");
                return [("" + step), "deed is done"]; 
            }

        case "d_c":
            {
                await doStep_d_c();
                deployerStatus.commandHistory.push(step);
                console.log("=> " + step + "");
                return [("" + step), "deed is done"]; ;
            }
        case "s_p":
            {
                await doStep_s_p(step);
                deployerStatus.commandHistory.push(step);
                console.log("=> " + step + "");
                return [("" + step), "deed is done"]; ;
            }

        case "s_c":
            {
                await doStep_s_c(step);
                deployerStatus.commandHistory.push(step);
                console.log("=> " + step + "");
                return [("" + step), "deed is done"]; ;
            }
        
        case "d_h":
            {
                await doStep_d_h(step);
                deployerStatus.commandHistory.push(step);
                console.log("=> " + step + "");
                return [("" + step), "deed is done"]; ;
            }
        
        case "d_t":  
        {
            await doStep_d_t(step);
            deployerStatus.commandHistory.push(step);
            console.log("=> " + step + "");
            return [("" + step), "deed is done"]; ;
        }
         
        
        
    }
}


async function doStep_f_d(arg:string){

    console.log("Deploying the " + arg.substring(4) + " ↗️");

    let gasPrice = await fetchGasPrice();
    const Facet = await ethers.getContractFactory(arg.substring(4), signer);
    const facet = await Facet.deploy({
        ...gasPrice
    });
    await facet.deployed();
    deployerStatus.deployedFacets[arg.substring(4)] = facet.address;
}

async function doStep_d_d(){

    console.log("Deploying the Diamond ↗️ 💎");

    let gasPrice = await fetchGasPrice();
    const Facet = await ethers.getContractFactory("Diamond", signer);
    const facet = await Facet.deploy(
        signer.address,
        deployerStatus.deployedFacets["DiamondCutFacet"],
        {
            ...gasPrice
    });
    await facet.deployed();
    deployerStatus.deployedFacets["Diamond"] = facet.address;
}

async function doStep_d_h(arg: string){
    await hardhatHelpers.impersonateAccount(arg.substring(6));
    signer = await ethers.getSigner(arg.substring(6));

    await hardhatHelpers.setBalance(arg.substring(6), 10 ** 24);
}

async function doStep_d_c(){


    console.log("Cutting the Diamond ⚒️ 💎");

    //Collecting all the depployed contrats
    let facets : Array<any> = [];
    let count = Object.keys(deployerStatus.deployedFacets).length;

    //Creating the cuts by aggregating all the deployed facets
    for(let i =0; i< count; i++){
        let name = Object.keys(deployerStatus.deployedFacets)[i];
        if(name != "Diamond" && name != "DiamondCutFacet"){
            let address = deployerStatus.deployedFacets[name];
            let facet = await ethers.getContractAt(name, address);

            facets.push({
                facetAddress: address,
                action: FacetCutAction.Add,
                functionSelectors: getSelectors(facet),
            });
        }
    }

    //Generating ABI call to the init
    const reloadInitFacet = await ethers.getContractAt("DiamondInitFacet", deployerStatus.deployedFacets["DiamondInitFacet"], signer);
    const diamondCut =  await ethers.getContractAt("DiamondCutFacet", deployerStatus.deployedFacets["Diamond"], signer);
    let functionCall = reloadInitFacet.interface.encodeFunctionData("init", [177013]); //Henshin
    let gasPrice = await fetchGasPrice();
    let tx = await diamondCut.diamondCut(facets, deployerStatus.deployedFacets["Diamond"], functionCall, {
        ...gasPrice
    });

    if(deployerStatus.cutFacets == undefined){
        deployerStatus.cutFacets = facets;
    } else {
        deployerStatus.cutFacets = [...deployerStatus.cutFacets, ...facets];
    }

}

//Set a GBM preset in the diamond
async function doStep_s_p(arg:string){
    const theDiamond =  await ethers.getContractAt("GBM_Interface", deployerStatus.deployedFacets["Diamond"], signer);

    if(arg.substring(0,5) == "s_p_+"){ //Case of all presets   at once
        let ending = parseInt(arg.substring(5));
        for(let i=0; i<ending; i++){


            let gasPrice = await fetchGasPrice();

            let dapreset:any = conf.GBMPresetArray[i];
            
            console.log("Setting GBM Preset #" +  dapreset.presetIndex + " 🏆 ⚙️");
            let tx = await theDiamond.setGBMPreset(
                dapreset.presetIndex,
                dapreset.auctionDuration,
                dapreset.hammerTimeDuration,
                dapreset.cancellationPeriodDuration,
                dapreset.stepMin,
                dapreset.incentiveMin,
                dapreset.incentiveMax,
                dapreset.incentiveGrowthMultiplier,
                dapreset.firstMinBid,
                dapreset.name,
                {
                    ...gasPrice,
                });
        
            if(deployerStatus.registeredPresets == undefined){
                deployerStatus.registeredPresets = {};
            }

            deployerStatus.registeredPresets["" + dapreset.presetIndex] = {
                presetIndex: dapreset.presetIndex,
                auctionDuration: dapreset.auctionDuration,
                hammerTimeDuration: dapreset.hammerTimeDuration,
                cancellationPeriodDuration: dapreset.cancellationPeriodDuration,
                stepMin: dapreset.stepMin,
                incentiveMin: dapreset.incentiveMin,
                incentiveMax: dapreset.incentiveMax,
                incentiveGrowthMultiplier: dapreset.incentiveGrowthMultiplier,
                firstMinBid: dapreset.firstMinBid,
                name: dapreset.name
                
            }

            deployerStatus.commandHistory.push("s_p_" + i);
        }

    } else {
        let index = parseInt(arg.substring(4));
        if(index != 0 && index <= conf.GBMPresetArray.length){
            index--;
        } else {
            throw "Please specify a valid currency index";
        }

        let gasPrice = await fetchGasPrice();

        let dapreset:any = conf.GBMPresetArray[index];
        console.log("Setting GBM Preset #" +  dapreset.presetIndex + " 🏆 ⚙️");
        let tx = await theDiamond.setGBMPreset(
            dapreset.presetIndex,
            dapreset.auctionDuration,
            dapreset.hammerTimeDuration,
            dapreset.cancellationPeriodDuration,
            dapreset.stepMin,
            dapreset.incentiveMin,
            dapreset.incentiveMax,
            dapreset.incentiveGrowthMultiplier,
            dapreset.firstMinBid,
            dapreset.name,
            {
                ...gasPrice,
            });

        if(deployerStatus.registeredPresets == undefined){
            deployerStatus.registeredPresets = {};
        }

        deployerStatus.registeredPresets["" + dapreset.presetIndex] = {
            presetIndex: dapreset.presetIndex,
            auctionDuration: dapreset.auctionDuration,
            hammerTimeDuration: dapreset.hammerTimeDuration,
            cancellationPeriodDuration: dapreset.cancellationPeriodDuration,
            stepMin: dapreset.stepMin,
            incentiveMin: dapreset.incentiveMin,
            incentiveMax: dapreset.incentiveMax,
            incentiveGrowthMultiplier: dapreset.incentiveGrowthMultiplier,
            firstMinBid: dapreset.firstMinBid,
            name: dapreset.name
        }

    }

}

//Set a currency in the diamond
async function doStep_s_c(arg:string){
    const theDiamond =  await ethers.getContractAt("GBM_Interface", deployerStatus.deployedFacets["Diamond"], signer);

    if(arg.substring(0,5) == "s_c_+"){ //Case of all currencies at once
        let ending = parseInt(arg.substring(5));
        for(let i=0; i<ending; i++){

            let gasPrice = await fetchGasPrice();
            let dapreset:any = conf.CurrenciesArray[i];

            console.log("Setting Currency #" +  dapreset.currencyIndex + " 💲⚙️");

            let tx = await theDiamond.setCurrencyAddressAndName(
                dapreset.currencyIndex,
                dapreset.currencyAddress,
                dapreset.currencyName,
                {
                    ...gasPrice,
                });
        
            if(deployerStatus.registeredCurrencies == undefined){
                deployerStatus.registeredCurrencies = {};
            }

            deployerStatus.registeredCurrencies["" + dapreset.currencyIndex] = {
                currencyIndex: dapreset.currencyIndex,
                currencyAddress: dapreset.currencyAddress,
                currencyName: dapreset.currencyName
            }

            deployerStatus.commandHistory.push("s_c_" + i);

        }

    } else {
        let index = parseInt(arg.substring(4));
        if(index != 0 && index<=conf.CurrenciesArray.length){
            index--;
        } else {
            throw "Please specify a valid currency index";
        }

       
        let gasPrice = await fetchGasPrice();
        let dapreset:any = conf.CurrenciesArray[index];
        console.log("Setting Currency #" +  dapreset.currencyIndex + " 💲⚙️");

        let tx = await theDiamond.setCurrencyAddressAndName(
            dapreset.currencyIndex,
            dapreset.currencyAddress,
            dapreset.currencyName,
            {
                ...gasPrice,
            });
    
        if(deployerStatus.registeredCurrencies == undefined){
            deployerStatus.registeredCurrencies = {};
        }

        deployerStatus.registeredCurrencies["" + dapreset.currencyIndex] = {
            currencyIndex: dapreset.currencyIndex,
            currencyAddress: dapreset.currencyAddress,
            currencyName: dapreset.currencyName
        }
    }
}

async function fetchGasPrice() {

    let feeData = await ethers.provider.getFeeData();

    let obj:any = {};
    //obj.gasPrice = feemult(feeData.gasPrice);  //Uncomment this line and comment the next two lines if you are operating on older networks
    obj.maxFeePerGas =  feemult(feeData.maxFeePerGas);
    obj.maxPriorityFeePerGas =  feemult(feeData.maxPriorityFeePerGas);

    return obj;
}

function feemult(input:any){
    let res = input.mul( ethers.BigNumber.from("11"));
    res.div(ethers.BigNumber.from("10"));
    return res;
}



/*   

==========================================================================================================================================

                                                                TEST LOGIC

==========================================================================================================================================


*/



async function doStep_d_t(arg:string){

 
    if(arg.substring(0,7) == "d_t_l_+"){    //d_t_l_+xx

        let ending = parseInt(arg.substring(7));
        for(let i = 1; i<= ending; i++){
            await do_substep_dtm(i);
        }
    } else {    //d_t_l_xx
        let index = parseInt(arg.substring(6));
        await do_substep_dtm(index);
    }
}

async function do_substep_dtm(arg:number){

    //Calling the function from it's name in the array
    await eval("" + testSequenceManual[arg-1].func + "(" + JSON.stringify(testSequenceManual[arg-1].args) + ")");

}


async function doSubStep_create721Contract(args:Array<any>){

    //Deploying a test ERC721
    console.log("Deploying an ERC-721 contract 🐱 ↗️");
    let gasPrice = await fetchGasPrice();
    const erc721 = await ethers.getContractFactory("ERC721Generic", signer);
    const erc721C = await erc721.deploy("GBM Whales", "GBM721", {
        ...gasPrice
    });
    await erc721C.deployed();

    if( deployerStatus.ERC721 == undefined){
        deployerStatus.ERC721 = [];
    }

    deployerStatus.ERC721.push(("" + erc721C.address));

}

async function doSubStep_mint721Token(args:Array<any>){
    let contract721Address = deployerStatus.ERC721[0];
    const the721 =  await ethers.getContractAt("ERC721Generic", contract721Address, signer);

    if( deployerStatus.totalUsedTokenURI == undefined){
        deployerStatus.totalUsedTokenURI = 0;
    }

    deployerStatus.totalUsedTokenURI++;

    console.log("Minting ERC-721 tokenID " + deployerStatus.totalUsedTokenURI + " 🖨️ 🐱");
    let gasPrice = await fetchGasPrice();
    let tx = await the721.mint(
        tokenURIList[deployerStatus.totalUsedTokenURI],
        {
           ...gasPrice,
        });
}


async function doSubStep_transfer721Token(args:Array<any>){  //Args are expced as : from, to, tokenID.   Value are S (signer) or D (Diamond) for from & to.
    let contract721Address = deployerStatus.ERC721[0];
    const the721 =  await ethers.getContractAt("ERC721Generic", contract721Address, signer);

    let _from = "";
    let _to = "";
    let tokenID = args[2];


    if(args[0] == "S"){
        _from = signer.address;
    } else {
        _from = deployerStatus.deployedFacets["Diamond"];
    }

    if(args[1] == "S"){
        _to = signer.address;

        console.log("Transferring ERC-721 tokenID " + tokenID + " to the Signer Wallet 🛫🙂 🐱");
    } else {
        _to = deployerStatus.deployedFacets["Diamond"];
        console.log("Transferring ERC-721 tokenID " + tokenID + " to the Diamond 🛫💎 🐱");
    }


    let gasPrice = await fetchGasPrice();
    let tx = await the721.mint(
        tokenURIList[deployerStatus.totalUsedTokenURI],
        {
           ...gasPrice,
        });
}


async function doSubStep_create1155Contract(args:Array<any>){

    //Deploying a test 1155
    console.log("Deploying an ERC-1155 contract 🐰 ↗️");
    let gasPrice = await fetchGasPrice();
    const erc1155 = await ethers.getContractFactory("ERC1155Generic", signer);
    const erc1155C = await erc1155.deploy("GBM pokeWhales", "GBM1155", {
        ...gasPrice
    });
    await erc1155C.deployed();

    if( deployerStatus.ERC1155 == undefined){
        deployerStatus.ERC1155 = [];
    }

    deployerStatus.ERC1155.push(("" + erc1155C.address));

}


/*   

==========================================================================================================================================

                                                                TEST SEQUENCES

==========================================================================================================================================


*/



let testSequenceManual: Array<any> = [];
testSequenceManual.push({
    "func":"doSubStep_create721Contract",
    "args": [""]
});

//Minting 10 721 tokens for testing purpose
for(let i=0; i<10; i++){
    testSequenceManual.push({
        "func":"doSubStep_mint721Token",
        "args": [""]
    });
}

//Transferring 6 of them to the GBM smart contract
for(let i=0; i<6; i++){
    testSequenceManual.push({
        "func":"doSubStep_transfer721Token",
        "args": ["S","D", i+1]
    });
}

//Minting a 1155 contract
testSequenceManual.push({
    "func":"doSubStep_create1155Contract",
    "args": [""]
});


async function test(){


    await init();

    let demoSteps = [
        "d_h_b_0xf181e8B385FE770C78e3B848F321998F78b0d73e", //replace here with your metamask wallet address
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
        "s_p_+26",
        "s_c_1",
        "d_t_l_+18"
    ]

    for(let i=0; i<demoSteps.length; i++){
        await performDeploymentStep(demoSteps[i]);
    }

    console.log("Deployment test over");

    return;

}

test();