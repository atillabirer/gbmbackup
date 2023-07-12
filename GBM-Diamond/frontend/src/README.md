## Outstanding issues

### Edouard

- [ ] Create table of versions and what features they have enabled. This can be shown on the front-end
- [ ] Have a "dApp Owner" tab which is where the owner can change the owner address
- [ ] The deployment tab becomes "Configuration", and is visible by default by all users
- [ ] Display message on empty list (if no auctions on browse auctions page)
- [ ] Admin panel UI: Use image as background
- [ ] "Learn more" section (e.g. a modal, a side panel, a separate page)
- [ ] "Loading failed" asset

### Global (JavaScript)

- [x] **£ Detect admin and owner address (goal is to then have adaptive tabs based on user priviledges)**
- [ ] JavaScript file cleanup in general
- [ ] Fix split second white page on reload/change
- [ ] **Unify the Filter button CSS for Token and Auctions pages**
- [ ] Change pathing to not use queryParams and mimic myNFT auction page
- [x] **£ Add the "Powered by GBM" badge to the footer of every page, and which links to https://gbm.auction when clicked (ask Edouard for svg asset)**
- [x] **Buffer state while Metamask connection handling (connect first time) eg while typing password**
  - [ ] **Above is tested on "Put in NFT Contract Drop", apply everywhere else**
- [ ] **Mobile version of every page (only bidding page is done currently)**
- [ ] Rename versions on the dApp
- [x] **£ When user refreshes the page and we do not detect any deploymentStatus, we send the user to localhost:3000/**

### Deployment

- [ ] Add an abort button that resets a failed deployment (recover from a bad mainnet deployment e.g. not enough gas) => Too complex for now
- [ ] Prevent deploy click if admin address fails regex check
- [x] **£ When I open the GBM dApp for the first time, if an existing dApp is detected, ask the user if they want to Use deployed dApp or erase and deploy a new one** (https://www.figma.com/file/EHTeSVipOQuUgzlx7oJt6Q/GBM---Brand%2C-Website-and-Video?type=design&node-id=1146-3050&mode=design&t=Nl9VuT8It9Y4E92T-4)
- [x] **£ Push to backend memory (deployerStatus) any change made to the deployerStatus (mostly logo, colour changes) when deployment is finished and succesful, but also when logo upload and adding currency**

### Browse Auctions

- [x] Keep loading / pinging after deployment until it works
  - [ ] Spotted a getPresets() failure at one point, have yet to replicate
- [ ] **£ Add bid event listener logic (subscribe to the events of the GBM diamond and listen to updates like new bids/end_timestamps coming in) Metamask subscribe to events. -Bidding page already has that**
- [ ] Fetch NFT metadata dynamically (if not done already)
- [ ] Display message on empty list (Ed needs to do design first)
- [ ] **Add filter buttons**
- [ ] Remove no bid yet message, remove the column for upcoming auctions <= Very tricky to remove without rewriting the entire page's CSS, consider alternatives
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

- [ ] .

### Admin Panel

- [ ] Editing the platform fees
- [ ] Slider to show the preset name in the GBM badge on bidding page
- [x] **£ Add "Remove" button for base curency** - [x] Backend - [x] Frontend
- [ ] New currency: check if it is valid before adding it (otherwise button is disabled)

### Create Listing Flow

- [ ] **£ The selects that allows you to chose the preset (create auctions page) needs to look at what presets are available (currently hard coded) -coded but not tested**
- [x] **Fetch the NFT data dynamically** <= Requires rework of the tokens page - Pass the ERC721/1155 contract as a query parameter in all scenarios
- [ ] Make sure the initial state of radio buttons is set (refresh issues)
- [ ] Check for missing fields before submission
- [ ] Add currency as suffix to the minimum bid input (also for auction page)
- [ ] **Fix radio buttons to cover full width of column**
- [ ] Align everything to the left
- [ ] Add NFT approval flow (approveAll by default)

### Auction (Bidding page)

- [ ] **Add read more function to show full description**
- [ ] **Add "show more" button do display all bids (by default only show last 3)**
- [ ] Add explorer links for each bid (only being displayed if there is a backend)
- [ ] Fix margins/font-weight for the GBM badge
- [ ] Bigger Margin between incentive badge + bid button
- [ ] Auction status divs should have the same width columns
- [ ] Fact check the NFT details panel (not all correct right now)
- [ ] Share options + QR code
- [ ] Add Outbid noise (ask Edouard for the audio file)

## NFT Drop page

- [ ] Do the frontend

## TheGraph

- [ ] **Add thegraph to the dApp codebase**
