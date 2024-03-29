/* global ethers */

import { ethers } from "hardhat";

import { FunctionFragment, ErrorFragment } from "@ethersproject/abi";

//func:string;
//let contract:Contract
export const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };
// get function selectors from ABI
export function getSelectors(contract: any) {
   const signatures = Object.keys(contract.interface.functions);

  //const signatures = ['cancelAuction(uint256,bytes,address)'] // Add signatures this way if you need to manual edits

  const selectors = signatures.reduce((acc: any, val: string) => {
    if (val !== "init(bytes)") {
      acc.push(contract.interface.getSighash(val));
    }
    return acc;
  }, []);
  selectors.contract = contract;
  selectors.remove = remove;
  selectors.get = get;
  return selectors;
}

// get function selector from function signature
export function getSelector(func: string) {
  const abiInterface = new ethers.utils.Interface([func]);
  return abiInterface.getSighash(ethers.utils.Fragment.from(func));
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
// didn't really use this in the tests
function remove(this: any, functionNames: any) {
  const selectors = functionNames.filter((v: string) => {
    for (const functionName of functionNames) {
      if (v === this.contract.interface.getSighash(functionName)) {
        return false;
      }
    }
    return true;
  });
  selectors.contract = this.contract;
  selectors.remove = this.remove;
  selectors.get = this.get;
  return selectors;
}

function get(this: any, functionNames: any) {
  const selectors = this.filter((v: any) => {
    for (const functionName of functionNames) {
      if (v === this.contract.interface.getSighash(functionName)) {
        return true;
      }
    }
    return false;
  });
  selectors.contract = this.contract;
  selectors.remove = this.remove;
  selectors.get = this.get;
  return selectors;
}

// remove selectors using an array of signatures
export function removeSelectors(selectors: any[], signatures: any[]) {
  const iface = new ethers.utils.Interface(
    signatures.map((v: string) => "function " + v)
  );
  const removeSelectors = signatures.map(
    (v: string | FunctionFragment | ErrorFragment) => iface.getSighash(v)
  );
  selectors = selectors.filter((v: any) => !removeSelectors.includes(v));
  return selectors;
}

// find a particular address position in the return value of diamondLoupeFacet.facets()
export function findAddressPositionInFacets(
  facetAddress: any,
  facets: string | any[]
) {
  for (let i = 0; i < facets.length; i++) {
    if (facets[i].facetAddress === facetAddress) {
      return i;
    }
  }
}
