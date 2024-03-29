
# GBM dApp

**Disclaimer: The GBM dApp, its codebase, the GBM auction system, the GBM brand and all related  intellectual property are owned by Perpetual Altruism Ltd and covered by copyright, trademark and patent applications. All rights reserved. You may only use the aforementioned with a valid licence from Perpetual Altruism Ltd. To get a license, please contact us via https://www.gbm.auction.**

This codebase allows you to deploy and configure your own GBM dApp in a matter of minutes. The GBM dApp consists of an upgradable diamond-pattern Solidity smart contract infrastructure with an integrated pure HTML/CSS frontend with some vanilla JavaScript. You can:
* customise the look of the GBM dApp frontend and use it as is;
* iterate on top of the GBM dApp to integrate it with your own platform; or
* use this frontend as a basis for a completely new platform.

Before deployment and integration, please read our **[GBM Auction Guide](https://docs.google.com/document/d/16jqjfFTFS7bSP9HDhC4fJkDzihmskhByZL13tcpRX5o/edit?usp=sharing)** to make sure you understand how GBM auctions and all its associated features work. This resource will also be helpful to communicate about GBM to your audience. 

## Features coming soon
* Solidity codebase audit
* TheGraph built-in schema
* Frontend polishing/connection to existing smart contract features       

## For developers wanting to launch the demo, click [here](/GBM-Diamond/README.md) 

## Which chain should I deploy the GBM dApp on?    

The GBM dApp can be deployed on any EVM-compatible blockchain. The blockchain the GBM dApp is deployed on will be the one on which the auctions are run: this means bids will be in a currency from that blockchain, and users will be required to pay gas from that blockchain to place bids or list items for auction.

GBM auctions require a fair amount of gas to be implemented on chain. For example, each bid requires two currency transfers and many variables to be written. This is not an issue on blockchains where the block size is far greater than the block consumption (e.g. Polygon, Moonbeam) ; however it can be a problem on a chain like Ethereum mainnet, in particular if the item being sold at GBM auction is not of high value. Therefore, we recommend avoiding deploying the dApp and running GBM auctions on Ethereum mainnet unless you are auctioning expensive items.

The blockchain you run the auctions on does **not** have to be the blockchain the assets being sold are on. For example, if you are doing a NFT drop on Ethereum, you could deploy the dApp and run the auctions on Polygon selling “coupons” NFTs. The auction winners would receive these coupon NFTs on Polygon and use them to redeem the actual Ethereum NFTs. This coupon solution does not require anything else to be implemented and is entirely compatible with existing scripts, software and marketplaces. The drawback would be that currency of the auction would need to be on Polygon (e.g. MATIC, USDC, WETH) and bidders would pay gas in MATIC.  
   

## Integration
    
There are many ways to integrate the GBM dApp in your platform, each with their own compromise between user experience and developer time. 

Regardless of your implementation, you fully own every part of your infrastructure, deployed smart contracts, wallet private keys, etc. There are no backdoors. You control everything.

### 1. Quickest (Pure dApp)
Self-host the dApp as is, customise the look of the front-end using the Admin panel and you’re ready to go.
     
+ *For who* : Low costs experiments selling a few dozen items       
+ *Timeline of dev work* : A single day, assuming you already know how to send an NFT to a smart contract and are a full stack dev.       
+ *Necessary infra* : An amazon t2.small to host the node server. All the rest of the data come from the smart contract getting queried through Metamask by the frontend.        
+ *Drawback* : Due to being pure dApp, the live auction search page will not handle selling more than a few dozen items in total. If metamask loses the connection or the user leaves the website, they won't receive notifications (for example when they are outbid).         

### 2. Web3 EVM Marketplace / NFT Drop          
Use our frontend as a guideline/modify it to accept data feed from your backend. For even lower dev cost, run it from a different subdomain/section on your website and iteratively merge features. 
   
+ *For who* : Existing marketplace/NFT projects wanting to add a standalone GBM feature while limiting cost.                  
+ *Timeline of dev work* : Depend on your existing infrastructure. Between two weeks and a month, more if you want deeper integration with your existing services.              
+ *Necessary infra* : An indexer for all the NFTs sold on your platform as well as tracking the status of sales/auctions/deposits within the GBM dApp. A database cluster to service those indexed data to the frontend instead of relying on the public web3 node, and making proper optimised DB requests instead of DDOSing public nodes with loops to fetch/search existing auctions. And of course your normal frontend delivery infrastructure.   
+ *Drawback* : Frontend developement and polishing takes time. Making and hosting an indexer is not the simplest thing either. However, if you are an NFT project, you should already have the skillsets in-house.

### 3. I'm neither of the above, what are my options ?
We currently have in the works a self-hosted API version of the GBM dApp. The UX will work similarly to the Web3 EVM marketplace but: 
+ Your users do not need a blockchain wallet anymore, instead they just provide a user ID and an optional identification mechanism (eg : non-evm blockchain wallet signature, SSO, etc...); 
+ The provided frontend is replacing web3 interaction with your userID scheme interactions.                            
+ The API will map those userIDs to private keys, and then will use those private keys to interact with a normal GBM dapp on a private EVM blockchain that you control. For those without the knowledge to run such a blockchain, we have a ready made solution coming Q3 2023.                                      

From there, two integration cases:
                        
**Blockchain to privatised GBM EVM DAPP**
+ The bids and the assets must be properly tracked so you can tell the API to do the settlement. In essence, you need to build a bridge between your system and the dApp. This is trivial enough if you are dealing with physical assets/fiat as ultimately you are bridging toward a classic database. It can be much more tricky and require much more domain specific technical expertise if you are bridging from another blockchain. If you are bridging from another blockchain to keep track of escrow, why not have your users use the EVM web3 GBM dApp anyway?  
+ The GBM API software needs to be able to manipulate items in escrow: this could be sending PayPal transactions or executing blockchain transactions, but ultimately you have a server that is a juicy target for hacks. The software we provide is of course coming with some built-in security, but it is a price exploration and settlement engine, so by design it will be able to move assets. We can of course advise and help with best practises, but you will need an experienced sysadmin and good security practices. 
+ Another solution is to re-implement the GBM marketplace in your own blockchain’s smart contract language. We are open to collaboration on the matter and already have delivered such implementations for non-EVM chains.     
+ If you are a blockchain project yourself, GBM could also be integrated as a precompile/part of the base protocol. We are open to collaboration on the matter.                   

**Database to privatised GBM EVM DAPP**
+ If you are selling digital items (gaming, tickets, etc) with a prepaid account system and do not care much about blockchain/Web3, then we have a ready made solution coming Q3 2023.
+ A Frontend will be provided as an example : the dApp frontend without the Web3 elements and instead a demo set of products being sold using prepaid fiat account for bids. We have a proof of concept for Paypal and Stripe, but you will still need to onboard and partner with them yourself and have merchant accounts for your users             
+ You will need to adapt the provided frontend to your app/website/game needs. The main task is understanding the API and setting up webhooks so that the GBM API can actually manipulate users' assets in reaction to bids and auctions.                      
+ The ongoing cost is hosting a bunch of docker containers along your website. You do not need blockchain-specific expertise, it will work just fine as a black box.                 
