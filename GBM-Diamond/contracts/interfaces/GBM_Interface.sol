// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { IDiamondCut } from "./IDiamondCut.sol";
import { IDiamondLoupe } from "./IDiamondLoupe.sol";
import { IERC165 } from "./IERC165.sol";
import { IERC173 } from "./IERC173.sol";
import { IERC721TokenReceiver } from "./IERC721TokenReceiver.sol";
import { IERC1155TokenReceiver } from "./IERC1155TokenReceiver.sol";
import { IGBMCurrencyFacet } from "./facets/IGBMCurrencyFacet.sol";
import { IGBMAdminFacet } from "./facets/IGBMAdminFacet.sol";
import { IGBMEventsFacet } from "./facets/IGBMEventsFacet.sol";
import { IGBMGettersFacet } from "./facets/IGBMGettersFacet.sol";
import { IGBMAuctionBiddingFacet } from "./facets/IGBMAuctionBiddingFacet.sol";
import { IGBMPrimaryAuctionRegistrationFacet } from "./facets/IGBMPrimaryAuctionRegistrationFacet.sol";
import { IGBMSecondaryAuctionRegistrationFacet } from "./facets/IGBMSecondaryAuctionRegistrationFacet.sol";
import { IGBMDirectSalePrimaryFacet } from "./facets/IGBMDirectSalePrimaryFacet.sol";



/// @title GBM_Interface
/// @dev Use this to generate ABIs or to interact with the diamond in general. It contains all the functions, even those you chose to disable.
/// @author Guillaume Gonnaud
interface GBM_Interface is  IGBMEventsFacet, 
                            IDiamondCut, 
                            IDiamondLoupe, 
                            IERC165, 
                            IERC173, 
                            IERC721TokenReceiver, 
                            IERC1155TokenReceiver, 
                            IGBMAdminFacet, 
                            IGBMCurrencyFacet,
                            IGBMGettersFacet,
                            IGBMAuctionBiddingFacet,
                            IGBMPrimaryAuctionRegistrationFacet, 
                            IGBMSecondaryAuctionRegistrationFacet,
                            IGBMDirectSalePrimaryFacet {}