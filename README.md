# GBM_Istari

A GBM auction is an Open Ended, Incentivized English auction. More details on how it works here : https://www.gbm.auction      

This codebase include ready to use smart contracts in order for you to deploy your own marketplaces on any EVM enabled Chains. You will be owning all the contracts deployed with full admin rights on all of those, as well as being able to control fees, presets, currencies, etc... 
A demo Frontend is included so that you can iterate on top of it when integrating to your own marketplace. You can also use this frontend as a basis for a completely new marketplace.

In order to modify the deployment parameters, you can edit the gbm.config file options yourself or use the upcoming wizard part of the deployment scripts.

## Features coming very soon (Days) : 
=> Secondary sales registration by third parties on whitelisted set of NFT smart contracts          
=> Direct Sale support                
=> TheGraph built in schema    
=> Grace period           
=> Admin Panel          
=> Configuration wizard          
=> Demo Frontend polish    

## Feature Roadmap :
=> Solidity codebase audit                

# Launching the Demo

## Prerequisites

- [Node.js](https://nodejs.org/en/download) 
- [Metamask](https://metamask.io/download/)

Make sure both of the above are installed before going through the steps below.

If you're having any issues scroll down to the Troubleshooting section.

## List of steps

1) Clone the project
2) Navigate to the project directory
3) cd GBM-Diamond
4) npm install
5) npm run build
6) Import account #0 from the output to MetaMask
7) Add private key of account #0 to hardhat.config.ts
8) Navigate to http://localhost:3000
9) Click on the Metamask slider at the top right
10) Go to the GBM Deployment page and click on the 'Deploy Button'

To end the demo at any point tap Ctrl + C while focused on your terminal window. 
## Cloning the project

The first step of course is to grab your own copy of the project - either cloning through git or a ZIP download works. Once that's done you will need to navigate to the project directory through the terminal. If you're not familiar with the basic commands, then follow the following steps depending on your operating system: 

MacOS: Through the Finder application, navigate to the project folder, right click on it, and choose 'New Terminal at Folder' from the bottom of the list.

Windows: Through the Windows Explorer application, navigate to the project folder, right click on it, and choose 'Open in Terminal' from the bottom of the list.

Linux: I'm sure you know basic terminal commands already 😉

Now dive an extra level deeper by typing the command below and tapping enter/return. you will know be at the root of the project. 

> cd GBM-Diamond  

The demo application will require its own list of dependencies in order to function, so the first command to run here is:

> npm install

This might take a few minutes, but when done, follow it up with the line below:

> npm run build

You should now have both a Demo application running at port 3000 of your computer (accessible at http://localhost:3000) as well as your own test blockchain node. 
## Setting up MetaMask

MetaMask should prompt you for the creation of a wallet when set up for the first time, so I'm assuming you're already past that step. There's two things that will need to be done in advance here: 

- Set up Metamask to use a demo account. 
- Set up Metamask to listen to our test node

Let's start with the former. You should have noticed that your terminal likely went a bit crazy and started printing out a ton of hexadecimal values - That is the Hardhat plugin creating the node under the hood, and assigning 20 accounts that can be used to play around with it. Our target is the very first one, so copy the Private Key value under Account #0.

With that value in our clipboard, go to the MetaMask plugin on your browser of choice. Click on the abstract color collage that's diametrically opposed to the fox logo to access the Accounts menu, and click on 'Import account'. Paste the value from your clipboard to the empty field and click on Import to finalize the demo account creation. MetaMask will also switch to this account right away. 

While you are still holding onto that private key, it needs to be added to one more place. In our project directory, open the file called hardhat.config.ts with your text editor of choice (VSCode recommended) and look at line 12:

> accounts: ["0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddead"], // Demo pkey

Replace the hex value in the array (keeping the quotes) with your private key, and save the file. 

Now reset the demo project by focusing on the terminal window and tapping Ctrl+C (even on Mac), then re-running 'npm run build'.

Go to http://localhost:3000 and click on the slider next to the fox logo. This will enable the use of metamask for this page, as well as add the local node instance as an available network. 

## Deploying the GBM Diamond

Navigate to the GBM Deployment page, and click on the 'Deploy' button at the bottom. You should start getting a few logs from the deployment process and it should soon be complete. You will see that a few more tabs have opened up at the top of the page, so feel free to play around with them and see what happens. 

## Troubleshooting
 
A lot of the issues you might come across can be best described as "Hardhat and MetaMask don't play well with each other". You might have an issue fetching information right after a deployment due to MetaMask not syncing with Hardhat in time, but refreshing the page after a few seconds should solve that. If that doesn't solve the issue, check the console logs of your browser.

Another solution would be to go to MetaMask and click on Account > Settings > Advanced > Clear Activity Tab Data, to reset your transaction nonce and keep the two plugins synchronized (this does not affect your other accounts).

Similarly, shutting down the node annoyingly enough doesn't report the action to MetaMask. So assuming you wanted to relaunch everything from scratch you'd need to follow the steps below:

- Stop and restart the current process in the terminal
- Account > Settings > Advanced > Clear Activity Tab Data in MetaMask
- In the GBM Deployment Window, click on the 'Reset and Redeploy' button

Feature: 


>Register for auction either 721 or 1155 token
>A 1155 token for auction has an arbitrary amount of token, but each auction is a single token ID
>At auction creation, a currency preset must be selected


Current progress : 

Core of the diamond done
Currencies done
Preset registration done


Admin up to date with rest of features
Automated deployment up to date with rest of features.
