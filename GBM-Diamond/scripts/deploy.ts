const hre = require("hardhat");
const prompt = require("prompt-sync")();
const { getSelectors, FacetCutAction } = require("./libraries/diamond.ts");
import { ethers } from "hardhat";
import config from "../hardhat.config";

let hardhatHelpers = require("@nomicfoundation/hardhat-network-helpers");  // << Required for time dependendant test

var conf: any;
conf = JSON.parse(require("../gbm.config.ts").conf);

let automatedTesting:boolean = false;

const FacetNames = [
    "DiamondInitFacet",
    "DiamondLoupeFacet",
    "OwnershipFacet",
    "GBMAdminFacet",
    "GBMAuctionBiddingFacet",
    "GBMCurrencyFacet",
    "GBMEscrowFacet_Tracking",
    "GBMGettersFacet",
    "GBMPrimaryAndSecondaryAuctionRegistrationFacet",
    "GBMDirectSalePrimaryAndSecondaryFacet"
];

let deployOrder = ["DCF", "DD", "FT", "FT", "FT", "FT", "FT", "FT", "FT", "FT", "FT", "CUT", "PRST", "CRC", "TST"]

let cut: any[] = [];
let facets: any[] = [];

let diamondCutFacetAddress: string;
let diamondAddress: string;
let savedERC721Address: string;

export function setDiamondAddress(address: string) {
    diamondAddress = address
};

export function setDiamondCutFacetAddress(address: string) {
    diamondCutFacetAddress = address
};

export function addToPreviousCuts(prevCut: any) {
    cut = prevCut;
}

export function addToPreviousFacets(prevFacets: any) {
    facets = prevFacets;
}

export function passNewConf(newConf: any) {
    conf = newConf;
}

async function fetchGasPrice() {
    return 20000000000;
}

export async function performDeploymentStep(step: number) {
    // conf = JSON.parse(require("../gbm.config.ts").conf);
    //switching colour to black on white
    switch (step) {
        case 0:
            await deployDiamondCutFacet();
            return [`SERVER || MSG || DiamondCutFacet deployed at: ${diamondCutFacetAddress}`, `SERVER || DCF || ${diamondCutFacetAddress}`];
        case 1:
            await deployDiamond();
            return [`SERVER || MSG || Diamond deployed at: ${diamondAddress}`, `SERVER || DD || ${diamondAddress}`];
        case 12:
            await cutDiamond();
            return [`SERVER || MSG || Diamond has been cut with new facets`, `SERVER || CUT`];
        case 13:
            await setPresets();
            return [`SERVER || MSG || GBM Presets registered`, `SERVER || PRST`];
        case 14:
            await setCurrency();
            return [`SERVER || MSG || Default currency has been set`, `SERVER || CRC`];
        case 15:
            {
                if (automatedTesting) {
                    await runTestAuction();
                    return [`SERVER || MSG || Successfully performed a test auction`, `SERVER || TST || ${savedERC721Address}`];
                } else 

                if (conf.RunTestAuction) {
                    await runTestAuctionManual();
                    return [`SERVER || MSG || Successfully performed a test auction`, `SERVER || TST || ${savedERC721Address}`];
                }
                else return [`SERVER || MSG || No test werere configugred to be ran`, `SERVER || TST || ${savedERC721Address}`];
            }

        default:
            await deployFacet(step - 2);
            return [`SERVER || MSG || Deployed ${FacetNames[step - 2]}`, `SERVER || FT || ${JSON.stringify(cut)} || ${JSON.stringify(facets)}`];
    }
}

let globConnectedMetamaskWalletAddress:string;


export async function HardhatNetworkSetup_Before(_ConnectedMetamaskWalletAddress: string) {
    if (_ConnectedMetamaskWalletAddress) {
        await hardhatHelpers.setBalance(_ConnectedMetamaskWalletAddress, 10 ** 24);
        await hardhatHelpers.impersonateAccount(_ConnectedMetamaskWalletAddress);
    }

    let wallets = await ethers.getSigners()
    await hardhatHelpers.setBalance(wallets[0].address, 10 ** 24);
    globConnectedMetamaskWalletAddress = _ConnectedMetamaskWalletAddress;
}

export async function HardhatNetworkSetup_After(_ConnectedMetamaskWalletAddress: string, _nonceToSet: number) {
    const gBMAdminFacet = await ethers.getContractAt("GBMAdminFacet", diamondAddress);

    //Transferring the admin rights fully to the metamask wallets
    let res = await gBMAdminFacet.getGBMAdmin();
    console.log("Change requested from the current GBMAdmin Address: " + res + " to be the address: " + _ConnectedMetamaskWalletAddress);
    let gasPrice = await fetchGasPrice();
    console.log("Changing the GBM admin");
    let tx = await gBMAdminFacet.setGBMAdmin(_ConnectedMetamaskWalletAddress, {
        gasPrice: gasPrice,
    });

    //Stopping impersonating the remote account
    tx = await hardhatHelpers.stopImpersonatingAccount(_ConnectedMetamaskWalletAddress, { gasPrice: gasPrice, });

    if (_nonceToSet != 0) {
        await hardhatHelpers.setNonce(_ConnectedMetamaskWalletAddress, _nonceToSet);
    }
}

export async function HardhatNetworkSetBlockNumber(_blockNumber: number) {
    await hardhatHelpers.mineUpTo(_blockNumber);
}

async function deployDiamondCutFacet() {
    const accounts = await ethers.getSigners();
    const contractOwner = accounts[0];
    console.log("Now deploying the Diamond and its core facets");
    let gasPrice = await fetchGasPrice();
    const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
    const diamondCutFacet = await DiamondCutFacet.deploy({
        gasPrice: gasPrice
    });
    await diamondCutFacet.deployed();
    diamondCutFacetAddress = diamondCutFacet.address
    //console.log("DiamondCutFacet deployed:", diamondCutFacet.address,);
}

async function deployDiamond() {
    const accounts = await ethers.getSigners();
    const contractOwner = accounts[0];
    let gasPrice = await fetchGasPrice();
    const Diamond = await ethers.getContractFactory("Diamond");
    const diamond = await Diamond.deploy(
        contractOwner.address,
        diamondCutFacetAddress, {
        gasPrice: gasPrice
    });
    await diamond.deployed();
    diamondAddress = diamond.address;
    console.log("\x1b[42m\x1b[31mDiamond deployed:", diamond.address, " <<< THIS IS THE ADDRESS OF YOUR GBM MARKETPLACE\x1b[0m\x1b[30m\x1b[47m");
}

async function deployFacet(step: number) {
    let gasPrice = await fetchGasPrice();
    const Facet = await ethers.getContractFactory(FacetNames[step]);
    const facet = await Facet.deploy({
        gasPrice: gasPrice
    });
    await facet.deployed();

    facets.push(facet); //Bookeeping

    cut.push({
        facetAddress: facet.address,
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(facet),
    });
}

async function cutDiamond() {
    const diamondCut = await ethers.getContractAt("IDiamondCut", diamondAddress);
    let tx;
    let receipt;

    const reloadInitFacet = await ethers.getContractAt(FacetNames[0], cut[0].facetAddress);

    //console.log(reloadInitFacet.interface)
    let functionCall = reloadInitFacet.interface.encodeFunctionData("init", [177013]); //Henshin
    let gasPrice = await fetchGasPrice();

    tx = await diamondCut.diamondCut(cut, facets[0].address, functionCall, {
        gasPrice: gasPrice,
    });

    receipt = await tx.wait();
    if (!receipt.status) {
        throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    console.log("Completed diamond cut");
}

async function setPresets() {
    const gBMAdminFacet = await ethers.getContractAt("GBMAdminFacet", diamondAddress);

    //console.log(gBMAdminFacet);

    let tx;
    let gasPrice;

    if (conf.GBMPresetArray.length != 0) {
        for (let i = 0; i < conf.GBMPresetArray.length; i++) {
            let dapreset: any = conf.GBMPresetArray[i];
            console.log("Registering GBM preset at index " + dapreset.presetIndex);
            console.log(JSON.stringify(dapreset));
            let res;

            //Updating gas price
            gasPrice = await fetchGasPrice();

            let tx = await gBMAdminFacet.setGBMPreset(
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
                    gasPrice: gasPrice,
                });

        }

        gasPrice = await fetchGasPrice();

        //Setting the first preset as the default one
        let tx = await gBMAdminFacet.setDefaultGBMPreset(1, {
            gasPrice: gasPrice,
        });
    }

    if (!conf.UseSameAddressForDeployerAndGbmAdmin) {
        let res = await gBMAdminFacet.getGBMAdmin();
        console.log("Change requested from the current GBMAdmin Address: " + res + " to be the address: " + conf.GBMAdminOverrideAddress);

        console.log("Setting the tx to change the admin");
        tx = await gBMAdminFacet.setGBMAdmin(conf.GBMAdminOverrideAddress, {
            gasPrice: gasPrice,
        });

        res = await gBMAdminFacet.getGBMAdmin();
        console.log("GBMAdmin Address Changed to: " + res);

    } else {
        let res = await gBMAdminFacet.getGBMAdmin();
        console.log("GBMAdmin Address: " + res);
    }
}

async function setCurrency() {
    const gBMCurrencyFacet = await ethers.getContractAt("IGBMCurrencyFacet", diamondAddress);

    let tx;
    let gasPrice;

    //Registering the currencies
    if (conf.CurrenciesArray.length != 0) {
        for (let i = 0; i < conf.CurrenciesArray.length; i++) {
            let dapreset: any = conf.CurrenciesArray[i];
            console.log("Registering currency at index " + dapreset.CurrencyIndex);
            console.log(JSON.stringify(dapreset));

            //Updating gas price
            gasPrice = await fetchGasPrice();
            tx = await gBMCurrencyFacet.setCurrencyName(
                dapreset.CurrencyIndex,
                dapreset.CurrencyName, {
                gasPrice: gasPrice,
            });

            let res = await gBMCurrencyFacet.getCurrencyAddress(dapreset.CurrencyIndex);
            if (res.toLowerCase() != dapreset.CurrencyAddress.toLowerCase()) {
                gasPrice = await fetchGasPrice();
                tx = await gBMCurrencyFacet.setCurrencyAddress(
                    dapreset.CurrencyIndex,
                    dapreset.CurrencyAddress, {
                    gasPrice: gasPrice,
                });
            }
        }

        gasPrice = await fetchGasPrice();
        console.log("Setting the default currency to currency at index: " + conf.CurrenciesArray[0].CurrencyIndex);
        tx = await gBMCurrencyFacet.setDefaultCurrency(
            conf.CurrenciesArray[0].CurrencyIndex,
            {
                gasLimit: 100000, //hardcoded cause ethers fuckery
                gasPrice: gasPrice,
            });

        let res = await gBMCurrencyFacet.getDefaultCurrency();
        console.log(res);
        while (res.toString() == "0") {
            await new Promise(resolve => setTimeout(resolve, 1000));
            res = await gBMCurrencyFacet.getDefaultCurrency();
            console.log(res.toString());
        }
    }
}

async function runTestAuction() {

    console.log("\x1b[34m\x1b[47mStarting the Automated tests")

    let tokenURIList = require("./libraries/NFTTestList.json").nftarray;
    let tokenIDMintedSofar = 0;

    const gBMAuctionRegistrationFacet = await ethers.getContractAt("GBMPrimaryAuctionRegistrationFacet", diamondAddress);
    const gBMGettersFacet = await ethers.getContractAt("GBMGettersFacet", diamondAddress);
    const gBMBiddingFacet = await ethers.getContractAt("GBMAuctionBiddingFacet", diamondAddress);
    const gBMDoItAll = await ethers.getContractAt("GBM_Interface", diamondAddress);

    let wallets = await ethers.getSigners()

    //Deploying a fake ERC20
    console.log("Creating an ERC-20 token");
    let gasPrice = await fetchGasPrice();
    const erc20 = await ethers.getContractFactory("ERC20Generic");
    const erc20C = await erc20.deploy({
        gasPrice: gasPrice
    });
    await erc20C.deployed();

    //console.log(erc20C);
    console.log("ERC-20 💲 token deployed at address: " + erc20C.address);



    gasPrice = await fetchGasPrice();
    //Registering the ERC20 token into GBM diamond
    let txa =  await gBMDoItAll.setCurrencyAddress(
        2,
        erc20C.address,
        {
            gasPrice: gasPrice,
        });
    
    txa =  await gBMDoItAll.setCurrencyName(
        2,
       "fUSD",
        {
            gasPrice: gasPrice,
    });

    console.log("Added ERC-20 💲 token to currency index 2");

    // Summoning Jpow
    txa =  await erc20C.mint(
        "10000000000000000000000",
        {
            gasPrice: gasPrice,
        });
    
    //Allowing the market to spend all our money
    txa =  await erc20C.approve(
        diamondAddress,
        "10000000000000000000000",
        {
            gasPrice: gasPrice,
        });


    //Deploying a test ERC721
    console.log("Creating an ERC-721 🐱 token");
    gasPrice = await fetchGasPrice();
    const erc721 = await ethers.getContractFactory("ERC721Generic");
    const erc721C = await erc721.deploy("GBM-TEST-721", "GBM721", {
        gasPrice: gasPrice
    });
    await erc721C.deployed();

    //Deploying a test ERC1155
    console.log("Creating an ERC-1155 🐰 token");
    gasPrice = await fetchGasPrice();
    const erc1155 = await ethers.getContractFactory("ERC1155Generic");
    const erc1155C = await erc1155.deploy("GBM-TEST-1155", "GBM1155", {
        gasPrice: gasPrice
    });
    await erc1155C.deployed();

    //console.log(erc1155C);
    console.log("ERC-1155 token deployed at address: " + erc1155C.address);

    //Minting a bunch of 721 
    for (let i = 0; i < 5; i++) {
        console.log("Minting ERC-721 🐱 tokenID " + (tokenIDMintedSofar + 1));
        let tx = await erc721C.mint(
            tokenURIList[tokenIDMintedSofar],
            {
                gasPrice: gasPrice,
            });
        console.log("Transfering ERC-721 🐱 tokenID " + (tokenIDMintedSofar + 1) + " to the GBM diamond contract");
        tx = await erc721C["safeTransferFrom(address,address,uint256)"](
            wallets[0].address,
            diamondAddress,
            (tokenIDMintedSofar + 1),
            {
                gasPrice: gasPrice,
            });

        tokenIDMintedSofar++;
    }

    let tokenIDOffset = tokenIDMintedSofar;
    //Minting a bunch of 1155 
    for (let i = 0; i < 5; i++) {

        console.log("Minting 10 of ERC-1155 🐰 tokenID " + (tokenIDMintedSofar + 1));
        let tx = await erc1155C.mint(
            (tokenIDMintedSofar + 1),
            10,
            tokenURIList[tokenIDMintedSofar],
            {
                gasPrice: gasPrice,
            });
        console.log("Transfering ERC-1155 🐰 tokenID " + (tokenIDMintedSofar + 1) + " to the GBM diamond contract");
        tx = await erc1155C["safeTransferFrom(address,address,uint256,uint256,bytes)"](
            wallets[0].address,
            diamondAddress,
            (tokenIDMintedSofar + 1),
            10,
            "0x",
            {
                gasPrice: gasPrice,
            });

        tokenIDMintedSofar++;
    }

    let timestamp = (await ethers.provider.getBlock(ethers.provider.getBlockNumber())).timestamp;

    //Create a safe GBM auction
    console.log("Creating test safe ERC721 🐱 auction....");
    gasPrice = await fetchGasPrice();
    let tx = await gBMAuctionRegistrationFacet.safeRegister721Auction(
        1, //Token ID 
        erc721C.address, // tokenContractAddress, 
        0, //gbmPreset
        timestamp, //Start time = ASAP
        0, //currencyID
        wallets[0].address, //beneficiary
        {
            gasPrice: gasPrice,
        });


    //Fetching the latest auctionID :

    let bidIDRes = await gBMGettersFacet.getTotalNumberOfSales();
    let numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    let highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);

    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //placing a bid for 100 wei
    tx = await gBMBiddingFacet.bid(
        bidIDRes, //SaleID 
        100,
        0,
        {
            gasLimit: "312345",
            gasPrice: gasPrice,
            value: 100
        }
    );

    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Bid placed at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //Create a safe GBM auction
    console.log("Creating test safe ERC721 🐱 auction....");
    timestamp = (await ethers.provider.getBlock(ethers.provider.getBlockNumber())).timestamp;
    gasPrice = await fetchGasPrice();
    tx = await gBMAuctionRegistrationFacet.safeRegister721Auction(
        2, //Token ID 
        erc721C.address, // tokenContractAddress, 
        0, //gbmPreset
        timestamp, //Start time = ASAP
        0, //currencyID
        wallets[0].address, //beneficiary
        {
            gasPrice: gasPrice,
        });

    bidIDRes = await gBMGettersFacet.getTotalNumberOfSales();
    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    gasPrice = await fetchGasPrice();
    //placing a bid for 10 wei
    tx = await gBMBiddingFacet.bid(
        bidIDRes, //SaleID 
        100,
        0,
        {
            gasLimit: "312345",
            gasPrice: gasPrice,
            value: 100
        }
    );

    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Bid placed at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //placing a bid for 200 wei
    tx = await gBMBiddingFacet.bid(
        bidIDRes, //SaleID 
        200,
        100,
        {
            gasLimit: "312345",
            gasPrice: gasPrice,
            value: 200
        }
    );

    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);

    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);

    console.log("Bid placed at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);



    //Create a safe GBM auction using ERC20
    console.log("Creating test safe ERC1155+ERC20 🐰💲 auction....");
    gasPrice = await fetchGasPrice();
    tx = await gBMAuctionRegistrationFacet.safeRegister1155auction(
        6, //Token ID 
        erc1155C.address, // tokenContractAddress, 
        6, //Amount
        0, //gbmPreset
        timestamp, //Start time = ASAP
        2, //currencyID
        wallets[0].address, //beneficiary
        {
            gasPrice: gasPrice,
        });

    bidIDRes = await gBMGettersFacet.getTotalNumberOfSales();
    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //placing a bid for 100 fUSD
    tx = await gBMBiddingFacet.bid(
        bidIDRes, //SaleID 
        "100000000000000000000",
        0,
        {
            gasLimit: "312345",
            gasPrice: gasPrice,
        }
    );

    
    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);

    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);

    console.log("Bid 💲 placed at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    

    //Create a safe GBM auction
    console.log("Creating test safe ERC1155 🐰 auction....");
    gasPrice = await fetchGasPrice();
    tx = await gBMAuctionRegistrationFacet.safeRegister1155auction(
        7, //Token ID 
        erc1155C.address, // tokenContractAddress, 
        7, //Amount
        0, //gbmPreset
        timestamp, //Start time = ASAP
        0, //currencyID
        wallets[0].address, //beneficiary
        {
            gasPrice: gasPrice,
        });

    bidIDRes = await gBMGettersFacet.getTotalNumberOfSales();
    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    console.log("Now starting to wait for the auctions to be claimable.");
    console.log("⚠️   Make sure that the chain is minting blocks at regular intervals or support evm_setTime ⚠️");

    let endTimeStampTarget
    let auctionEndTime;
    let gracePeriod;
    let totalNumberOfSales = await gBMGettersFacet.getTotalNumberOfSales();
    let targetChainTimestamp;

    for (let i = 1; i <= totalNumberOfSales; i++) {
        let delta = 1;
        while (delta > 0) {
            timestamp = (await ethers.provider.getBlock(ethers.provider.getBlockNumber())).timestamp;

            auctionEndTime = await gBMGettersFacet.getSale_EndTimestamp(i);
            gracePeriod = await gBMGettersFacet.getSale_GBMPreset_CancellationPeriodDuration(i);
            targetChainTimestamp = auctionEndTime.add(gracePeriod);
            console.log("AuctionID: " + i + " auctionEndTime is " + auctionEndTime + " with a grace period of " + gracePeriod + " seconds : Chain target timestamp for claim is " + targetChainTimestamp);
            console.log("Current chain timestamp is " + timestamp);

            delta = parseInt(targetChainTimestamp.sub(timestamp).toString());

            if (delta > 0 && delta < 100) {
                console.log("This is " + delta + "s in the future, waiting for " + (delta) + "s");
                if (hardhatHelpers) {
                    await hardhatHelpers.time.increaseTo(targetChainTimestamp);
                    await ethers.provider.send("evm_mine", []);
                } else {
                    await new Promise(resolve => setTimeout(resolve, (delta * 1000)));
                }

            } else if (delta > 0) {
                console.log("This is " + delta + "s in the future, waiting for 100s");
                if (hardhatHelpers.time) {
                    await hardhatHelpers.time.increaseTo(targetChainTimestamp);
                    await ethers.provider.send("evm_mine", []);
                } else {
                    await new Promise(resolve => setTimeout(resolve, (100 * 1000)));
                }
            } else {
                console.log("This is " + delta + "s in the past, claiming now");
            }

        }

        //We have reach the timer, time to claim

        //Claming the auction
        console.log("Claming SaleID : " + i);
        gasPrice = await fetchGasPrice();
        tx = await gBMBiddingFacet.claim(
            i, //SaleID 
            {
                gasPrice: gasPrice,
            }
        );

    }


    //getSale_GBMPreset_CancellationPeriodDuration
    console.log("Automated Tests Over\n\**********************************************\x1b[0m");
}


async function runTestAuctionManual() {

    console.log("\x1b[34m\x1b[47mStarting the Manual tests");

    
    let wallets = await ethers.getSigners();
    let metamaske:any;
    if (globConnectedMetamaskWalletAddress) {
        await hardhatHelpers.setBalance(globConnectedMetamaskWalletAddress, 10 ** 24);
        await hardhatHelpers.impersonateAccount(globConnectedMetamaskWalletAddress);
        metamaske = await ethers.getSigner(globConnectedMetamaskWalletAddress);;
    } else {
        metamaske = wallets[0];
    }

    let tokenURIList = require("./libraries/NFTTestList.json").nftarray;
    let tokenIDMintedSofar = 0;

    const gBMAuctionRegistrationFacet = await ethers.getContractAt("GBMPrimaryAuctionRegistrationFacet", diamondAddress);
    const gBMGettersFacet = await ethers.getContractAt("GBMGettersFacet", diamondAddress);
    const gBMBiddingFacet = await ethers.getContractAt("GBMAuctionBiddingFacet", diamondAddress);


    //Deploying a fake ERC20
    console.log("Creating an ERC-20 token");
    let gasPrice = await fetchGasPrice();
    const erc20 = await ethers.getContractFactory("ERC20Generic", metamaske);
    const erc20C = await erc20.deploy({
        gasPrice: gasPrice
    });
    await erc20C.deployed();

    //console.log(erc20C);
    console.log("ERC-20 token deployed at address: " + erc20C.address);

    //Deploying a test ERC721 contract
    console.log("Creating an ERC-721 🐱 token");
    gasPrice = await fetchGasPrice();
    const erc721 = await ethers.getContractFactory("ERC721Generic",  metamaske);
    const erc721C = await erc721.deploy("GBM-TEST-721", "GBM721", {
        gasPrice: gasPrice
    });
    await erc721C.deployed();

    //Deploying a test ERC1155
    console.log("Creating an ERC-1155 🐰 token");
    gasPrice = await fetchGasPrice();
    const erc1155 = await ethers.getContractFactory("ERC1155Generic",  metamaske);
    const erc1155C = await erc1155.deploy("GBM-TEST-1155", "GBM1155", {
        gasPrice: gasPrice
    });
    await erc1155C.deployed();

    //console.log(erc1155C);
    console.log("ERC-1155 token deployed at address: " + erc1155C.address);

    //Minting a bunch of 721 
    for (let i = 0; i < 10; i++) {
        console.log("Minting ERC-721 🐱 tokenID " + (tokenIDMintedSofar + 1));
        let tx = await erc721C.mint(
            tokenURIList[tokenIDMintedSofar],
            {
                gasPrice: gasPrice,
            });
        console.log("Transfering ERC-721 🐱 tokenID " + (tokenIDMintedSofar + 1) + " to the GBM diamond contract");
        if(i<5){
            tx = await erc721C["safeTransferFrom(address,address,uint256)"](
                metamaske.address,
                diamondAddress,
                (tokenIDMintedSofar + 1),
                {
                    gasPrice: gasPrice,
                });
        }

        tokenIDMintedSofar++;
    }

    let tokenIDOffset = tokenIDMintedSofar;
    //Minting a bunch of 1155 
    for (let i = 0; i < 5; i++) {

        console.log("Minting 10 of ERC-1155 🐰 tokenID " + (tokenIDOffset + 1));
        let tx = await erc1155C.mint(
            (tokenIDOffset + 1),
            10,
            tokenURIList[tokenIDOffset],
            {
                gasPrice: gasPrice,
            });
        console.log("Transfering ERC-1155 🐰 tokenID " + (tokenIDOffset + 1) + " to the GBM diamond contract");
        tx = await erc1155C["safeTransferFrom(address,address,uint256,uint256,bytes)"](
            metamaske.address,
            diamondAddress,
            (tokenIDOffset + 1),
            10,
            "0x",
            {
                gasPrice: gasPrice,
            });

            tokenIDOffset++;
    }

    let timestamp = (await ethers.provider.getBlock(ethers.provider.getBlockNumber())).timestamp;

    //Create a safe GBM auction
    console.log("Creating test safe ERC721 🐱 auction....");
    gasPrice = await fetchGasPrice();
    let tx = await gBMAuctionRegistrationFacet.safeRegister721Auction(
        1, //Token ID 
        erc721C.address, // tokenContractAddress, 
        0, //gbmPreset
        timestamp, //Start time = ASAP
        0, //currencyID
        metamaske.address, //beneficiary
        {
            gasPrice: gasPrice,
        });

    savedERC721Address = erc721C.address;
    //Fetching the latest auctionID :

    let bidIDRes = await gBMGettersFacet.getTotalNumberOfSales();
    let numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    let highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);

    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //placing a bid for 100 wei
    tx = await gBMBiddingFacet.bid(
        bidIDRes, //SaleID 
        100,
        0,
        {
            gasLimit: "312345",
            gasPrice: gasPrice,
            value: 100
        }
    );

    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Bid placed at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //Create a safe GBM auction
    console.log("Creating test safe ERC721 🐱 auction....");
    timestamp = (await ethers.provider.getBlock(ethers.provider.getBlockNumber())).timestamp;
    gasPrice = await fetchGasPrice();
    tx = await gBMAuctionRegistrationFacet.safeRegister721Auction(
        2, //Token ID 
        erc721C.address, // tokenContractAddress, 
        0, //gbmPreset
        timestamp, //Start time = ASAP
        0, //currencyID
        metamaske.address, //beneficiary
        {
            gasPrice: gasPrice,
        });


    //Fetching the latest auctionID :
    bidIDRes = await gBMGettersFacet.getTotalNumberOfSales();
    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    gasPrice = await fetchGasPrice();
    //placing a bid for 10 wei
    tx = await gBMBiddingFacet.bid(
        bidIDRes, //SaleID 
        100,
        0,
        {
            gasLimit: "312345",
            gasPrice: gasPrice,
            value: 100
        }
    );

    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Bid placed at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //placing a bid for 200 wei
    tx = await gBMBiddingFacet.bid(
        bidIDRes, //SaleID 
        200,
        100,
        {
            gasLimit: "312345",
            gasPrice: gasPrice,
            value: 200
        }
    );

    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);

    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);

    console.log("Bid placed at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);


    //Create a safe GBM auction
    console.log("Creating test safe ERC721 🐱 auction....");
    timestamp = (await ethers.provider.getBlock(ethers.provider.getBlockNumber())).timestamp;
    gasPrice = await fetchGasPrice();
    tx = await gBMAuctionRegistrationFacet.safeRegister721Auction(
        3, //Token ID 
        erc721C.address, // tokenContractAddress, 
        0, //gbmPreset
        timestamp, //Start time = ASAP
        0, //currencyID
        metamaske.address, //beneficiary
        {
            gasPrice: gasPrice,
        });

    //Fetching the latest auctionID :
    bidIDRes = await gBMGettersFacet.getTotalNumberOfSales();
    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);


    //getSale_GBMPreset_CancellationPeriodDuration
    //Create an safe GBM auction
    console.log("Creating test safe ERC1155 🐰 auction for token ID" + (tokenIDOffset-4));
    gasPrice = await fetchGasPrice();
    tx = await gBMAuctionRegistrationFacet.safeRegister1155auction(
        tokenIDOffset-4, //Token ID 
        erc1155C.address, // tokenContractAddress, 
        6, //Amount
        0, //gbmPreset
        timestamp, //Start time = ASAP
        0, //currencyID
        metamaske.address, //beneficiary
        {
            gasPrice: gasPrice,
        });

    bidIDRes = await gBMGettersFacet.getTotalNumberOfSales();
    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //Create a safe GBM auction
    console.log("Creating test safe ERC1155 🐰 auction for token ID" + (tokenIDOffset-3));
    gasPrice = await fetchGasPrice();
    tx = await gBMAuctionRegistrationFacet.safeRegister1155auction(
        tokenIDOffset-3, //Token ID 
        erc1155C.address, // tokenContractAddress, 
        5, //Amount
        0, //gbmPreset
        timestamp, //Start time = ASAP
        0, //currencyID
        metamaske.address, //beneficiary
        {
            gasPrice: gasPrice,
        });

    bidIDRes = await gBMGettersFacet.getTotalNumberOfSales();
    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);
    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);
    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    console.log("I was impersonating: " + globConnectedMetamaskWalletAddress);


    console.log("Auctions ready to be tested manually\n\**********************************************\x1b[0m");
}

export async function main(testingEnabled:boolean) {


    automatedTesting = testingEnabled;
    console.log("\x1b[30m\x1b[47m");

    for (let i = 0; i < 16; i++) {
        console.log("performDeploymentStep(" + i + ")");
        await performDeploymentStep(i);
    }
    console.log("\x1b[0m");
}