const hre = require("hardhat");
const prompt = require("prompt-sync")();
const { getSelectors, FacetCutAction } = require("./libraries/diamond.ts");
import { ethers } from "hardhat";
import config from "../hardhat.config";

var conf: any;



const FacetNames = [
    "DiamondInitFacet",
    "DiamondLoupeFacet",
    "OwnershipFacet",
    "GBMAdminFacet",
    "GBMAuctionBiddingFacet",
    "GBMCurrencyFacet",
    "GBMEscrowFacet_NoTracking",
    "GBMGettersFacet",
    "GBMPrimaryAuctionRegistrationFacet"
];

const cut: any[] = [];
const facets: any[] = [];

let diamondCutFacetAddress: string;
let diamondAddress: string;

export function setDiamondAddress(address: string) {
    diamondAddress = address
};

export function setDiamondCutFacetAddress(address: string) {
    diamondCutFacetAddress = address
};

export function addToPreviousCuts(prevCut: any) {
    cut.push(prevCut);
}

export function addToPreviousFacets(prevFacet: any) {
    facets.push(prevFacet);
}

async function fetchGasPrice() {
    return 20000000000;
}

export async function performDeploymentStep(step: number) {
    conf = JSON.parse(require("./libraries/gbm.default.config.ts").conf);
    //switching colour to black on white
    switch (step) {
        case 0:
            await deployDiamondCutFacet();
            return `DiamondCutFacet deployed at: ${diamondCutFacetAddress}`;
        case 1:
            await deployDiamond();
            return `Diamond deployed at: ${diamondAddress}`;
        case 11:
            await cutDiamond();
            return `Diamond has been cut with new facets`;
        case 12:
            await setPresets();
            return `GBM Presets registered`;
        case 13:
            await setCurrency();
            return `Default currency has been set`;
        case 14:
            await runTestAuction();
            return `Successfully performed a test auction`;
        default:
            await deployFacet(step - 2);
            return `Deployed ${FacetNames[step - 2]}`
    }
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
    console.log("DiamondCutFacet deployed:", diamondCutFacet.address,);
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
    let functionCall = facets[0].interface.encodeFunctionData("init", [177013]); //Henshin
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
                dapreset.incentiveGrowthMultiplier, {
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

    console.log("\x1b[34m\x1b[47mStarting the tests")

    let tokenURIList = require("./libraries/NFTTestList.json").nftarray;
    let tokenIDMintedSofar = 0;

    const gBMAuctionRegistrationFacet = await ethers.getContractAt("GBMPrimaryAuctionRegistrationFacet", diamondAddress);
    const gBMGettersFacet = await ethers.getContractAt("GBMGettersFacet", diamondAddress);
    const gBMBiddingFacet = await ethers.getContractAt("GBMAuctionBiddingFacet", diamondAddress);

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
    console.log("ERC-20 token deployed at address: " + erc20C.address);


    //Deploying a test ERC721
    console.log("Creating an ERC-721 token");
    gasPrice = await fetchGasPrice();
    const erc721 = await ethers.getContractFactory("ERC721Generic");
    const erc721C = await erc721.deploy("GBM-TEST-721", "GBM721", {
        gasPrice: gasPrice
    });
    await erc721C.deployed();

    //Deploying a test ERC1155
    console.log("Creating an ERC-1155 token");
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
        console.log("Minting ERC-721 tokenID " + (tokenIDMintedSofar + 1));
        let tx = await erc721C.mint(
            tokenURIList[tokenIDMintedSofar],
            {
                gasPrice: gasPrice,
            });
        console.log("Transfering ERC-721 tokenID " + (tokenIDMintedSofar + 1) + " to the GBM diamond contract");
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

        console.log("Minting 10 of ERC-1155 tokenID " + (tokenIDMintedSofar + 1));
        let tx = await erc1155C.mint(
            (tokenIDMintedSofar + 1),
            10,
            tokenURIList[tokenIDMintedSofar],
            {
                gasPrice: gasPrice,
            });
        console.log("Transfering ERC-1155 tokenID " + (tokenIDMintedSofar + 1) + " to the GBM diamond contract");
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
    console.log("Creating test unsafe ERC721 auction....");
    gasPrice = await fetchGasPrice();
    let tx = await gBMAuctionRegistrationFacet.unsafeRegister721Auction(
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
    //console.log(res);

    let numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);

    let highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);

    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //placing a bid for 10 wei
    tx = await gBMBiddingFacet.bid(
        bidIDRes, //SaleID 
        10,
        0,
        {
            gasLimit: "312345",
            gasPrice: gasPrice,
            value: 10
        }
    );

    //console.log(tx)

    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);

    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);

    console.log("Bid placed at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);



    //Create a safe GBM auction
    console.log("Creating test safe ERC721 auction....");

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


    //Fetching the latest auctionID :

    bidIDRes = await gBMGettersFacet.getTotalNumberOfSales();
    //console.log(res);

    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);

    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);

    console.log("Test auction created at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //placing a bid for 10 wei
    tx = await gBMBiddingFacet.bid(
        bidIDRes, //SaleID 
        10,
        0,
        {
            gasLimit: "312345",
            gasPrice: gasPrice,
            value: 10
        }
    );


    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);

    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);

    console.log("Bid placed at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    //placing a bid for 20 wei
    tx = await gBMBiddingFacet.bid(
        bidIDRes, //SaleID 
        20,
        10,
        {
            gasLimit: "312345",
            gasPrice: gasPrice,
            value: 20
        }
    );

    numberOfBidsRes = await gBMGettersFacet.getSale_NumberOfBids(bidIDRes);

    highestBidValue = await gBMGettersFacet.getSale_HighestBid_Value(bidIDRes);

    console.log("Bid placed at saleID " + bidIDRes + ", currently there is " + numberOfBidsRes + " bids and the highest one is of a value of " + highestBidValue);

    console.log("Tests Over\n\**********************************************\x1b[0m");
}

async function main() {

    console.log("\x1b[30m\x1b[47m");

    for (let i = 0; i < 15; i++) {
        await performDeploymentStep(i);
    }
    console.log("\x1b[0m");
}

if (true) {
    main();
}