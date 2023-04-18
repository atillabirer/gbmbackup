const hre = require("hardhat");
const prompt = require("prompt-sync")();
const { getSelectors, FacetCutAction } = require("./libraries/diamond.ts");
import { ethers } from "hardhat";


var conf:any;

//Implement here your own formula to fetch gas price for your deployment. This function is called before every transaction in the deployment.
async function fetchGasPrice(){
  return 20000000000;
}


async function main() {

  
  let looping = true;

  while(looping){

    const input:any =  prompt("Do you want to use the default configuration ? (y/n) >>>>>     <<<<<\rDo you want to use the default configuration ? (y/n) >>>>> ");

    if(input != null && (input.toLowerCase() == "yes" || input.toLowerCase() == "y")){
      looping = false;
      conf = require("./libraries/gbm.default.config.ts");

      console.log(conf);
      await deployAfterConfLoaded();
    }

    if(input != null && (input.toLowerCase() == "no" || input.toLowerCase() == "n")){
      looping = false;
      conf = require("../gbm.config.ts");
      await deployAfterConfLoaded();
    }

    if(input != null && (input.toLowerCase() == "quit" || input.toLowerCase() == "q")){
      looping = false;
    }
  
  }


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


async function loadManuallyConf(){


  await deployAfterConfLoaded()
}

async function deployAfterConfLoaded(){

  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  console.log("Now deploying the Diamond and it's core facet");


  //Updating gas price
  let gasPrice = await fetchGasPrice();

  // deploy DiamondCutFacet
  console.log("Deploying DiamondCutFacet...");
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const diamondCutFacet = await DiamondCutFacet.deploy({ gasPrice: gasPrice });
  await diamondCutFacet.deployed();
  console.log("DiamondCutFacet deployed:", diamondCutFacet.address);

  
  //Updating gas price
  gasPrice = await fetchGasPrice();

  // deploy Diamond
  
  console.log("Deploying Diamond...");
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(
    contractOwner.address,
    diamondCutFacet.address,
    { gasPrice: gasPrice }
  );
  await diamond.deployed();
  console.log("Diamond deployed:", diamond.address, " <<< THIS IS THE ADDRESS OF YOUR GBM MARKETPLACE");


  console.log("Now that the diamond is deployed, Deploying facets...");

  //Make sure to always leave DiamondInitFacet at position 0 in the array
  const FacetNames = ["DiamondInitFacet","DiamondLoupeFacet", "OwnershipFacet", "GBMCurrencyFacet","GBMAdminFacet"]; 
  const cut: any[] = [];
  const facets: any[] = [];
  for (const FacetName of FacetNames) {

    //Updating gas price
    gasPrice = await fetchGasPrice();

    const Facet = await ethers.getContractFactory(FacetName);
    const facet = await Facet.deploy({ gasPrice: gasPrice });
    await facet.deployed();
    console.log(`${FacetName} deployed: ${facet.address}`);
    facets.push(facet); //Bookeeping

    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    });
  }
  console.log("All facets deployed. Cutting the diamond...");

  // upgrade diamond with facets
  console.log("Diamond Cut:", cut);
  const diamondCut = await ethers.getContractAt("IDiamondCut", diamond.address);
  let tx;
  let receipt;


  let functionCall = facets[0].interface.encodeFunctionData("init");

  tx = await diamondCut.diamondCut(cut, facets[0].address, functionCall, {
    gasPrice: gasPrice,
  });
  console.log("Diamond cut tx: ", tx.hash);
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  console.log("Completed diamond cut");

  //Recap of the deployment
  console.log("==================\n\nSummary of Deployment Addresses:\n");
  console.log("Diamond:", diamond.address, " <<< THIS IS THE ADDRESS OF YOUR GBM MARKETPLACE");
  console.log("DiamondCutFacet:", diamondCutFacet.address);
  { //1337 Scoping
    let counter = 0;
    for (const FacetName of FacetNames) {
      console.log("" + FacetName +": " + facets[counter].address);
      counter++;
    }
  }

}