⚠️ The project is currently under heavy feature addition and polishing and is not considered "ready" yet for a codeless experience ⚠️                     
⚠️ It is good enough already though if you want to just preview GBM or are not afraid to do a code dive ⚠️                           
                                                     
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
6) Navigate to http://localhost:3000
7) Click on the Metamask slider at the top right
8) Go to the GBM Deployment page and click on the 'Deploy Button'

To end the demo at any point tap Ctrl + C while focused on your terminal window.

You can edit the gbm.config file options yourself to modify the ecosystem parameters. For deployment options, please use the dropdowns provided in the frontend. Do not hesitate to get in touch with us if you encounter any difficulties.    

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


## Deploying the GBM Diamond

Navigate to the GBM Deployment page, and click on the 'Deploy' button at the bottom. You should start getting a few logs from the deployment process and it should soon be complete. You will see that a few more tabs have opened up at the top of the page, so feel free to play around with them and see what happens.
You should be able to bid on auctions with several metamask accounts (as long as you send yourself the currency), claim the NFT's at the end of an auction, start new auctions, etc...           


## Running more tests

Every time you stop/restart the test environement 
```    
ctrl+c 
//followed by 
npm run build
```    
you need to also flush your metamask cache and then redeploy your GBM diamond. To do so, please click the refresh arrows next to the metamask icon on the page, and then head to the deployment page to redeploy the diamond.      


## Troubleshooting
 
A lot of the issues you might come across can be best described as "Hardhat and MetaMask don't play well with each other". You might have an issue fetching information right after a deployment due to MetaMask not syncing with Hardhat in time, but refreshing the page after a few seconds should solve that. If that doesn't solve the issue, check the console logs of your browser.

An another issue is metamask extremeley conservative caching, meaning that if you restart your hardhat server, metamask is still gonna think you are running the old tests. To fix this issue and force a metamask cache flush, switch accounts/networks in metamask.

Another solution would be to go to MetaMask and click on Account > Settings > Advanced > Clear Activity Tab Data, to reset your transaction nonce and keep the two plugins synchronized (this does not affect your other accounts).


## Deploying to persistent testnet/mainnet      
        
It his highly advised to first run deployment test on testnets such as moonbase alpha.           
Make sure your [gbm.config](gbm.config) file is properly setup                              
-Currencies added (the first currency in the array is gonna be the default)          
-GBM presets setup (the first preset in the array is gonna be the default)             
-etc...              
Once done, addd your target network to [hardhat.config.ts](hardhat.config.ts) and set it as the default network. Don't forget to add your private keys        
Use 
```    
npx hardhat run scripts/deployer.ts   
```    
or the normal frontend using the "live blockchain" network option.

Come back in a few minutes, and everything should be deployed.
You can then hardcode/connect to your backend the contract addresses and host your frontend for your users to use.
            
# Running automated tests 

Edit [hardhat.config.ts](hardhat.config.ts) and make "hardhat" as the default network then:

```          
cd GBM-Diamond        
npx hardhat run scripts/runtests.ts    
```              
