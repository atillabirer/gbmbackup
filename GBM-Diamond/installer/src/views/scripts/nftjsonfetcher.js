NFT_DICTIONNARY = JSON.parse(localStorage.getItem('nftcache'));
if (!NFT_DICTIONNARY) {
    NFT_DICTIONNARY = {};
}


//Call this function to get the NFT details as soon as you have them, without waiting for the nft media to be cached by the browser
async function getBasicNFTDataFromTokenURI(_tokenURI) {

    if (!NFT_DICTIONNARY[_tokenURI]) {
        NFT_DICTIONNARY[_tokenURI] = {};
    }

    if (!NFT_DICTIONNARY[_tokenURI].jsonfetched) {
        const _res = await fetch(_tokenURI);
        const _jsonData = await _res.json();
        NFT_DICTIONNARY[_tokenURI].name = "";
        if (_jsonData.name != undefined) {
            NFT_DICTIONNARY[_tokenURI].name = _jsonData.name;
        }
        NFT_DICTIONNARY[_tokenURI].description = "No Description";
        if (_jsonData.description != undefined) {
            NFT_DICTIONNARY[_tokenURI].description = _jsonData.description;
        }

        NFT_DICTIONNARY[_tokenURI].image = _jsonData.image;
        if (!NFT_DICTIONNARY[_tokenURI].jsonfetched) {
            NFT_DICTIONNARY[_tokenURI].jsonfetched = true;
        }

        localStorage.setItem('nftcache', JSON.stringify(NFT_DICTIONNARY));
    }
    return NFT_DICTIONNARY[_tokenURI];
}


//Call this function to get the NFT details in an async solving only once the media is cached by your browser.
//Safe to call after an await getBasicNFTDataFromTokenURI, will not spam.
async function getNFTAndCacheMedia(_tokenURI) {
    let res = await getBasicNFTDataFromTokenURI(_tokenURI);
    await fetch(res.image);
    return NFT_DICTIONNARY[_tokenURI];
}

/* Returned format of the NFT objects : 

    let nft = await getBasicNFTDataFromTokenURI('https://ipfs.io/ipfs/QmfX3mtt3ocFpKmvBhe5JXFGR9bN7yWFP6oXiuD5ex2BYW?filename=Whale1.json');
    ===>
        {
            "name": "undefined",
            "description": "GBM Whale, An NFT used for testing purposes",
            "image": "https://ipfs.io/ipfs/QmaSGHzGz1w9aj7tXk6UY116D1LC5i4GwyY2AFTFtCuR1x?filename=GBM%20Whale%20%231.png",
            "jsonfetched": true
        }

*/