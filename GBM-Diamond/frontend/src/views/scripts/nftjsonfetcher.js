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
        const _res = await fetch(hardcodedbypassFilter(_tokenURI));
        const _jsonData = await _res.json();
        NFT_DICTIONNARY[_tokenURI].name = "";
        if (_jsonData.name != undefined) {
            NFT_DICTIONNARY[_tokenURI].name = _jsonData.name;
        }
        NFT_DICTIONNARY[_tokenURI].description = "No Description";
        if (_jsonData.description != undefined) {
            NFT_DICTIONNARY[_tokenURI].description = _jsonData.description;
        }

        NFT_DICTIONNARY[_tokenURI].image = hardcodedbypassFilter(_jsonData.image);
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
    let res = await getBasicNFTDataFromTokenURI(hardcodedbypassFilter(_tokenURI));
    await fetch(hardcodedbypassFilter(res.image));
    return NFT_DICTIONNARY[hardcodedbypassFilter(_tokenURI)];
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

//TODO : Prepend the proper localhost path

let bypassDict = {};
bypassDict["https://ipfs.io/ipfs/QmaSGHzGz1w9aj7tXk6UY116D1LC5i4GwyY2AFTFtCuR1x?filename=GBM%20Whale%20%231.png"] = "/whale/1/image";
bypassDict["https://ipfs.io/ipfs/QmQ6FkXKmr9TdSvEbBRQRApfzormo2j5GwBM4T8XQo2CuV?filename=GBM%20Whale%20%232.png"] = "/whale/2/image";
bypassDict["https://ipfs.io/ipfs/QmUWeirWDwrQbuTGaZt9cyFZazbE8CnwutmfwNvuBjkP5Y?filename=GBM%20Whale%20%233.png"] = "/whale/3/image";
bypassDict["https://ipfs.io/ipfs/QmRuvKjC2ErEjFYauPjkk4DEdjmUBP4aY2YUdPVb329hvb?filename=GBM%20Whale%20%234.png"] = "/whale/4/image";
bypassDict["https://ipfs.io/ipfs/QmQJq7j2k5EgkJewpDEdhwZcwvDcVGjjXW8W95U27NKpCB?filename=GBM%20Whale%20%235.png"] = "/whale/5/image";
bypassDict["https://ipfs.io/ipfs/QmW4mn9JZFccMFb4GGPhsT5MQcZAdWLGTraDS97MhUmdn2?filename=GBM%20Whale%20%236.png"] = "/whale/6/image";
bypassDict["https://ipfs.io/ipfs/QmZ5DF4jGFTirhZg9Tf4eujta2nEuReoASe8jeCLRyNEwi?filename=GBM%20Whale%20%237.png"] = "/whale/7/image";
bypassDict["https://ipfs.io/ipfs/QmTYy1RyvknS8e1oSo2mraV9oNri3rCFV3busvQrPrR7rT?filename=GBM%20Whale%20%238.png"] = "/whale/8/image";
bypassDict["https://ipfs.io/ipfs/QmTxsomcgMfVksT6r74vcMx7a11cdM6HvxsS3cXdJeszMV?filename=GBM%20Whale%20%239.png"] = "/whale/9/image";
bypassDict["https://ipfs.io/ipfs/QmZA6eTj4eVW7zTTaFdPHDfCKfD1PnrD3twzM5SdCc3B8V?filename=GBM%20Whale%20%2310.png"] = "/whale/10/image";
bypassDict["https://ipfs.io/ipfs/QmZHRAYmCT11crJA4hhAJ9CMdjqX54DHT9UzRgP4YQt3oA?filename=GBM%20Whale%20%2311.png"] = "/whale/11/image";
bypassDict["https://ipfs.io/ipfs/QmSNMRGCaEAjqpDb4ZhbexBirqSNHVVJEWS8iGN4NidEXX?filename=GBM%20Whale%20%2312.png"] = "/whale/12/image";
bypassDict["https://ipfs.io/ipfs/Qmaaq3irK4deiakyZP7bf6wvW7WWqztGQ3C8P4QWRhFMBU?filename=GBM%20Whale%20%2313.png"] = "/whale/13/image";
bypassDict["https://ipfs.io/ipfs/QmRaDwW5BqJFn1Mpys36vmRc29own7v45225VWPYyUyRY6?filename=GBM%20Whale%20%2314.png"] = "/whale/14/image";
bypassDict["https://ipfs.io/ipfs/QmaZJjBGTt5xvqa4dH8s7KZf4pX71pUZCjELhtQfJszvNr?filename=GBM%20Whale%20%2315.png"] = "/whale/15/image";
bypassDict["https://ipfs.io/ipfs/QmUvCvm5B4qM7r724BvNz9BEXSjexvqjLhTBRhS42r3FfE?filename=GBM%20Whale%20%2316.png"] = "/whale/16/image";
bypassDict["https://ipfs.io/ipfs/QmSyJPi7GQu4Hezt4LupdVPyiznacjTWBY2H1XxsVE6FMo?filename=GBM%20Whale%20%2317.png"] = "/whale/17/image";
bypassDict["https://ipfs.io/ipfs/QmRSbti1YTsNGW5UwHRouoioSAbM7qyWohXeFitZeHGsYF?filename=GBM%20Whale%20%2318.png"] = "/whale/18/image";
bypassDict["https://ipfs.io/ipfs/QmbQqddoYFEVZ5LpSKGwvCkpafTWJppMggC4jYeA38X3p6?filename=GBM%20Whale%20%2319.png"] = "/whale/19/image";
bypassDict["https://ipfs.io/ipfs/QmTDFBK7spdTfxMQnJ6pRmwBFnzqAhhPr35i7n9u521fjf?filename=GBM%20Whale%20%2320.png"] = "/whale/20/image";
bypassDict["https://ipfs.io/ipfs/QmfX3mtt3ocFpKmvBhe5JXFGR9bN7yWFP6oXiuD5ex2BYW?filename=Whale1.json"] = "/whale/1/json";
bypassDict["https://ipfs.io/ipfs/QmYH4Vw8zwMmKHsdg1H8apYHabTgVXet8s5EkUjazGCH89?filename=Whale2.json"] = "/whale/2/json";
bypassDict["https://ipfs.io/ipfs/QmaRwLVSfSsYRzDqfWMYXCQZixNxRQJePfe3tskwmL4iyU?filename=Whale3.json"] = "/whale/3/json";
bypassDict["https://ipfs.io/ipfs/QmPSYh6WBA6uWeRTNQHWkGx6HZbTRPbG12LD2LV9AC26jC?filename=Whale4.json"] = "/whale/4/json";
bypassDict["https://ipfs.io/ipfs/QmQzXaJmJ5vgWBPH9E1uySAxjfTjDVMXYLb7M24m9LURiV?filename=Whale5.json"] = "/whale/5/json";
bypassDict["https://ipfs.io/ipfs/Qmdws4rjAa6tCMDSkfbCiAFX3JXVXvctFo6V5YTycMKPza?filename=Whale6.json"] = "/whale/6/json";
bypassDict["https://ipfs.io/ipfs/QmVbFogAB2a4eMzSXLDgrbMaCqHMpTLXkp1R1eVbrNiyao?filename=Whale7.json"] = "/whale/7/json";
bypassDict["https://ipfs.io/ipfs/QmWzV6sdDFY3yejm2wjyathE2aL3a9aZGHKZWmJ6hWpeg7?filename=Whale8.json"] = "/whale/8/json";
bypassDict["https://ipfs.io/ipfs/QmSjHsi9wLAbi9DTB4iSiUzUHZtBXNY1B2utgepKW3X1d8?filename=Whale9.json"] = "/whale/9/json";
bypassDict["https://ipfs.io/ipfs/QmUTidCaLFaZcFdSEmWoq1GPkqxuYfEubVxrzTBYNCD1F3?filename=Whale10.json"] = "/whale/10/json";
bypassDict["https://ipfs.io/ipfs/Qmb5eTYedjyFkUHeXuEuvmksNJG7aZjVFjgAAzUpo6Aaa5?filename=Whale11.json"] = "/whale/11/json";
bypassDict["https://ipfs.io/ipfs/QmaXM8rEn2oCBDQ5aqiG5MzicBagKzmne6euqsG2GSY4rf?filename=Whale12.json"] = "/whale/12/json";
bypassDict["https://ipfs.io/ipfs/QmXfSjayPqSzmmV1xXVjwpCgZJqyQitcg5Uv1GXcGVxYSv?filename=Whale13.json"] = "/whale/13/json";
bypassDict["https://ipfs.io/ipfs/QmSsDZ6sktzm7B4ZGSBktTdYJFHymE2TLF9hSrX4dHebuW?filename=Whale14.json"] = "/whale/14/json";
bypassDict["https://ipfs.io/ipfs/QmY81b2LAeeSuWVSTZ3wyjqDUV3ZFrPgnGLZGPKsDD21yC?filename=Whale15.json"] = "/whale/15/json";
bypassDict["https://ipfs.io/ipfs/QmQQ6PLtNhEzLDNquMYEGAaBzjp8zRdgAZwjkjeNMVuog1?filename=Whale16.json"] = "/whale/16/json";
bypassDict["https://ipfs.io/ipfs/QmVUZUKsFoYafwvsjaCCCTcu9WPfsUuo6omqyXC8G2SyZ7?filename=Whale17.json"] = "/whale/17/json";
bypassDict["https://ipfs.io/ipfs/QmRjNN75jgSs8o5gfSQ2erjbVN9m59mvt99EZWcbBdQRyH?filename=Whale18.json"] = "/whale/18/json";
bypassDict["https://ipfs.io/ipfs/QmUmA1uVoWG7hc4JisSLY12rY9vyi2GizaaGMyTAXBTSc7?filename=Whale19.json"] = "/whale/19/json";
bypassDict["https://ipfs.io/ipfs/QmWsRddwMPvTWTFW47d768ce8eCxpt8AJc6pJMLQXf5gDe?filename=Whale20.json"] = "/whale/20/json";


function hardcodedbypassFilter(_tokenURI){
    if(bypassDict[_tokenURI] == undefined){
        return _tokenURI;
    } else {
        return bypassDict[_tokenURI];
    }
}