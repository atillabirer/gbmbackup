## Outstanding issues

### Global (JavaScript)

- [ ] .BAT file to launch deployment for easy demo (need NODE already installed)
- [ ] **JavaScript file cleanup in general**
- [ ] Fix split second white page on reload/change
- [ ] Unify the Filter button CSS for Token and Auctions pages
- [ ] Change pathing to not use queryParams and mimic myNFT auction page
- [ ] Add the "Powered by GBM" badge to the footer of every page
- [ ] **Buffer state while Metamask connection handling (connect first time) eg while typing password**


### Deployment

- [ ] **Adapt the deploy script for the deployer=admin scenario**
- [ ] **Add an abort button that resets a failed deployment**
- [ ] **Report back-end errors in case of a failed deployment**
- [ ] **Detect admin address from the contract post-deployment**
- [ ] Prevent deploy click if admin address fails regex check
- [ ] Add "enable English auction" slider. 

### Browse Auctions

- [x] Keep loading / pinging after deployment until it works
    - [ ] Spotted a getPresets() failure at one point, have yet to replicate
- [ ] Add bid event listener logic
- [ ] Display message on empty list (if no auctions, design to be done)
- [ ] Add filter buttons, even if placeholders
- [ ] **Remove no bid yet message, remove the column for upcoming auctions**
- [ ] Change so it queries the last 20-25 auctions instead of all of them
- [ ] Missing Load More Button
- [ ] Use the load animation/script from this page on other pages 

### My NFTs & Listings

- [ ] Display auction info on relevant cards (all different views, including ERC-1155)
- [ ] Update view of filter buttons - dropdown instead of tab buttons?(see Figma)
- [ ] Only show metamask wallet NFTs, not all in the contract
    - [x] Done for 1155
- [ ] Remainder calculation for 1155 if token has multiple sales
- [ ] Replace the hardhat image on the NFT card (provide design)

### Token Sale / IDO Browse auctions

- [ ] **Unfinished View**
- [ ] Tabs should be aware if it's the admin or someone else requesting the page (everywhere)

### Admin Panel 

- [ ] Editing the platform fees
- [ ] Slider to show the badge
- [ ] Remove slider to enable English auction (goes at deployment)
- [ ] Add "Remove" button for base curency
- [ ] New currency: check if it is valid
- [ ] Use image as background

### Create Auction Flow

- [ ] The selects that allows you to chose the preset (create auctions page) needs to look at what presets are available (currently hard coded) -need to work for english
- [ ] **Fetch the NFT data dynamically**
- [ ] Make sure the initial state of radio buttons is set (refresh issues)
- [ ] Check for missing fields before submission
- [ ] Add currency as suffix to the minimum bid input (also for auction page)
- [ ] Fix radio buttons to cover full width of column
- [ ] Align everything to the left
- [ ] Add NFT approval flow

### Auction (Bidding page)

- [ ] Add read more function to description
- [ ] Add show more to bids
- [ ] Add explorer link
- [ ] Fix margins/font-weight for the GBM badge
- [ ] Bigger Margin between incentive badge + bid button
- [ ] Auction status divs should have the same width columns
- [ ] Fact check the NFT details panel (not all correct right now)
- [ ] Share options + QR code
- [ ] -"Learn more" section (e.g. a modal, a side panel, a separate page)

## NFT Drop page

- [ ] Do the frontend

## TheGraph

- [ ] Add thegraph to the dApp codebase 
