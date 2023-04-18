export const conf:any = {
    "UseSameAddressForDeployerAndGbmAdmin" : true, //set to true if the gbm administrator is also the smart contract deployer/diamond administrator
    "GBMAdminOverride": "0x0000000000000000000000000000000000000000" // Address of the GBM admin if different than the deployer
}