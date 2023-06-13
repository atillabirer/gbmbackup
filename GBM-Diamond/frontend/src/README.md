## Outstanding issues

### Global

- [ ] Metamask Disconnect Button - Actual logic missing
- [ ] Chain swap hack on hardhat is refreshing the page before both calls
- [ ] Select / Option CSS missing for dropdowns
- [x] Messed up the above, workable but deviated from figma
- [ ] Clearer Terminal messages
- [ ] Missing 1155 logic
- [ ] Fix issue with bold values in text, font-weight not showing
- [ ] Remove units from timers when at 0

### Deployment

- [ ] Adapt the deploy script for the deployer=admin scenario
- [ ] Fix the deployment process to not require tests (steps)
- [ ] Add an abort button that resets a failed deployment
- [ ] Report back-end errors in case of a failed deployment
- [ ] Detect admin address from the contract post-deployment
- [ ] Prevent deploy click if deployer address fails regex check

### Browse Auctions

- [x] Keep loading / pinging after deployment until it works
- [x] Toggle from Upcoming to Live has a second of a negative timer
- [ ] Adjust the new auction listener to the new view
- [ ] Add bid event listener logic
- [ ] Display message on empty list

### My NFTs

- [ ] Display auction info on relevant cards
- [ ] Update view of filter buttons (see Figma)
- [ ] Add event listeners for auctions/bids
- [ ] Only show metamask wallet NFTs, not all in the contract

### Token Sale

- [ ] Unfinished View
- [ ] Configure the start time / duration options
- [ ] Missing smart contract logic entirely

### Admin Panel 

- [ ] Outdated View
- [ ] Missing the functionality to change admins
- [ ] Missing the functionality to add new currency

### Create Auction Flow

- [ ] Fetch the NFT data dynamically
- [ ] Outdated view (awaiting new Figma)
- [x] Temporary view Token Sale-style
- [x] Fix whale image
- [ ] Make sure the initial state of radio buttons is set (refresh issues)
- [x] Added delayed auction start
- [ ] Check for missing fields before submission

### Auction 

- [x] Fix loader CSS
- [ ] Outdated view (see Figma)
- [x] Add new bid listener
- [x] Test claim functionality
- [x] Add GBM Incentive identifier (HIGH, LOW)
- [ ] Plug the above to actual code
- [ ] Add read more function to description
- [ ] Add show more to bids
- [ ] Add timestamp to bids
- [ ] Fix occasional double bid-found event
