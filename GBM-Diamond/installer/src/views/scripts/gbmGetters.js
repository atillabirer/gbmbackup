import GBMGettersFacetArtifact from './artifacts/contracts/facets/GBMGettersFacet.sol/GBMGettersFacet.json';
import { ethers, Signer } from 'ethers';

const contractABI = GBMGettersFacetArtifact.abi;
const contractBytecode = GBMGettersFacetArtifact.bytecode;
const contractAddress = '0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650';

async function attemptGetters() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    
    console.log("Account:", await signer.getAddress());
    
    const Getters = new ethers.ContractFactory(
        contractABI, contractBytecode, signer
    )
    
    Getters.attach(contractAddress).then(() => {
        console.log(Getters.interface.functions)
    });
}
