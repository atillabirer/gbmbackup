
# GBM_Dapp

A GBM auction is an Open Ended, Incentivized English auction. More details on how it works here : https://www.gbm.auction      

This codebase allows our clients (you) to deploy and configure their fully-owned-by-you GBM dapp in a matter of minutes.
A demo Frontend is included so that you can iterate on top of it when integrating to your own marketplace. You can also use this frontend as a basis for a completely new marketplace.   

In order to modify the deployment parameters, you can edit the gbm.config file options yourself or soon, use the step by step option picker as a part of the deployment process.

## Features coming very soon : 
 => TheGraph built in schema    
 => Frontend polishing/connection to existing smart contract features
 

## Feature Roadmap :
=> Solidity codebase audit (under way)               

# For developpers wanting to launch the demo, click [here](/GBM-Diamond/README.md)             
          

## Which chain to chose to hold a GBM auction    
   
GBM auctions, just like any other auction, are in need quite a bid of gas to do on chain : each bid necessitate two transfer of currency (new bidder, previous bidder), many variables need to be written inside the chain state, etc...   This is a non-issue in chain where the block size is far above the block consumption (Polygon, Moonbeam, etc...), but the incentive of GBM auctions (make money when you are outbid) can disappear if auctioning lower-price items on Ethereum Mainnet.    

As such, we suggest avoiding holding the auction themselves on Ethereum mainnet unless you are auctionning expensive items. If your sold assets exist on Ethereum mainnet, what we suggest is to create a "voucher" nft on an L2/alternative EVM chain, hold the auction on those chain with the winner receivng the voucher NFT, and then shortly after the end of the auction, give the actual auctionned asset on Ethereum Mainnet to the address that is the holder of the voucher NFT on the chain where the auction was held. No need for a complex bridge or fancy new tech, everything works extremely well and is entirely compatible with existing software and marketplaces. The UX challenge here is onboarding your user with a currency used on the L2 (wETH, USDC, etc), the rest is very transparent and gas optimized.  
   

## Integration work
    
There is many way to integrate the GBM dapp in your platform, each with their own compromise between UX and developper time.  

We only provide code. You fully own every part of your infrastructure, deployed smart contracts, wallet private keys, etc. There is no backdoors. You control everything.

### Quickest
Self host the dapp as it is with only very minor frontend adjustment for branding and hosting the configuration file of the deployment.     >
     
*For who* : Low costs experiments selling a few dozen items    
*Timeline of dev work* : A single day, assuming you already know how to send an NFT to a smart contract and are a full stack dev.    
*Necessary infra* : An amazon t2.small to host the node server. All the rest of the data come from the smart contract getting queried trough metamask by the frontend.     
*Drawback* : Due to being pure dapp, will not handle selling more than a few dozen items in total.


### Web3 EVM Marketplace     
Use our frontend as a guideline/modify it to accept data feed from your backend. Run it from a different subdomain/section on your website. The GBM dApp can also do direct fixed price sales, english auction, resale, etc... Pick what you want from the features.
   
*For who* : Existing marketplace/projects wanting to add a standalone GBM feature while limiting cost.
*Timeline of dev work* : Depend of your existing infrastructure. Between two weeks and a month, more if you want deeper integration with your existing services.
*Necessary infra* : An indexer for all the NFT sold on your marketplaces as well as tracking the status of sales/auctions/deposits within the GBM dapp. A database cluster to servce those indexed data to the frontend instead of relying on the 


### I'm neither of the above, what are my options ?

We currently have in the work a self-hosted API version of the GBM dapp. It will work extremely similarily to the Web3 EVM marketplace : 
>You users do not need a web3 wallet anymore, instead they just provide a user ID and an optional idenfitication mechanism (eg : non-evm blockchain wallet signature, SSO, etc...).  
>The provided frontend will need some adaptation to replace any web3 interaction with your userID scheme interactions.
>The API will map those userIDs to private keys, and then will use those private keys to interact with a normal GBM dapp on a private EVM blockchain that you control. For those without the knowledge to run such a blockchain, we have a ready made soplution coming Q3 2023.

From there, two cases.
**Blockchain to privatised GBM EVM DAPP**
>The bids need to be fully funded and the assets of auction winners need to be properly tracked. Wherever the assets you are selling exist, you need to tell the API that bids amounts are properly put and withdrawn from escrow, and that the assets auctionned are properly changing hand. In essence, you need to build a bridge. This is trivial enough if you are dealing with physical assets/fiat as ultimately you are bridging toward a classic database, it can be much more tricky and require much more domain specific technical expertise if you are bridging from an another blockchain.    
>The GBM api software need to be able to manipulate items in escrow : this could be sending paypal transactions or executing blockchain transaction, but ultimately you have a server that is a juicy target for hacks. The software we provide is of course coming with some built-in security, but by the very nature of being at it's core a price exploration and settlement engine, it will be able to move assets. We can of course advice and help with best practises, but it is much preferred has an experienced sysadmin and good security practices. The best armored door in the world is useless if you leave the key on the lock.
>If you are bridging from an another blockchain to keep track of escrow, why not have your users use the EVM web3 dapp anyway ?

**Database to privatised GBM EVM DAPP**
>If you are for example selling digital items (gaming, tickets, etc) with a prepaid account system, then we have a ready made solution coming Q3 2023
>A Frontend will be provided as an example : the Dapp frontend without the Web3 elements and instead a demo set of products being sold using prepaid fiat account for bids. We have a proof of concept for Paypal and Stripe -you will still need to partner with them yourself, we are not middlemen-
>You will need to adapt this frontend to your app/website/game needs. The core of it is understanding the API and setting up webhooks so that the GBM API can actually manipulate users assets as reaction to bids and auction.  
