//const { CHAIN_STAGE, CHAIN_ID, ChainStage } = require("@layerzerolabs/core-sdk")

const LZ_ADDRESS = {
    "rinkeby": "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA",
    "bsc-testnet": "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
    "fuji": "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706",
    "mumbai": "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
    "arbitrum-rinkeby": "0x4D747149A57923Beb89f22E6B7B97f7D8c087A00",
    "optimism-kovan": "0x72aB53a133b27Fa428ca7Dc263080807AfEc91b5",
    "fantom-testnet": "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf"
  }
const LZ_ADDRESS_ONLINE = {
    //"rinkeby": "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA",
    //"bsc-testnet": "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
    //"fuji": "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706",
    //"mumbai": "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
    //"arbitrum-rinkeby": "0x4D747149A57923Beb89f22E6B7B97f7D8c087A00",
    //"optimism-kovan": "0x72aB53a133b27Fa428ca7Dc263080807AfEc91b5",
    //"fantom-testnet": "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf"
}
function getEndpointId(online=false) {
    if (isLocalhost()) {
        return 30137
    }
    if(online){
    const CHAIN_ID_ONLINE = {
        "rinkeby":          10001,
        "bsc-testnet":      10002,
        "fuji":             10006,
        "mumbai":           10009,
        "arbitrum-rinkeby": 10010,
        "optimism-kovan":   10011,
        "fantom-testnet":   10012
    }
    return CHAIN_ID_ONLINE[hre.network.name]
    }

    const CHAIN_ID = {
        "ethereum":          1,
        "bsc":               2,
        "avax":              6,
        "polygon":           9,
        "arbitrum":          10,
        "optimism":          11,
        "fantom":            12
    }
    return CHAIN_ID[hre.network.name]
}

function isLocalhost() {
    return hre.network.name === "localhost" || hre.network.name === "hardhat"
}

function isTestnet() {
    return true;
    //return (
    //    hre.network.name === "localhost" ||
    //    hre.network.name === "hardhat" ||
    //    CHAIN_STAGE[hre.network.name] === ChainStage.TESTNET ||
    //    CHAIN_STAGE[hre.network.name] === ChainStage.TESTNET_SANDBOX
    //)
}

function getEndpointIdByName(name){
    const CHAIN_ID = {
        "rinkeby":          10001,
        "bsc-testnet":      10002,
        "fuji":             10006,
        "mumbai":           10009,
        "arbitrum-rinkeby": 10010,
        "optimism-kovan":   10011,
        "fantom-testnet":   10012
    }
    return CHAIN_ID[name]
}
const POOLS = {
    "mumbai":{
        // mbtc mockToken
        1:{"info":{
                "sharedDecimals":18,
                "address":"0xe3aE2E7297680752F5486ebF3f8aD047BeeD3657", //mbtc
                "chainPaths":[{"dstChainId":10006, "dstPoolId":2, "weight":1}]}},
        12:{"info":{
                "sharedDecimals":18,
                "address":"0xD2B5Dd4f7bf11Ddb2ED2467805360254a36a69Bc",  //tusd
            },
        "chainPaths":[{"dstChainId":10006, "dstPoolId":112, "weight":1}]
        }
        },
    "fuji":{
        //2:{"info":{
        //    "sharedDecimals":18,
        //    "address":"0xCc15197f9cA3c942816540304138e822030c4365"}, //mbtc
        //    "chainPaths":[{"dstChainId":10009, "dstPoolId":1, "weight":1}]
        //},
        1:{"info":{
            "sharedDecimals":6,
            "address":"0x4A0D1092E9df255cf95D72834Ea9255132782318", //tusd
            },
        "chainPaths":[{"dstChainId":10009, "dstPoolId":12, "weight":1}]
    }
    }
}

module.exports = {
    POOLS,
    getEndpointId,
    isLocalhost,
    isTestnet,
    getEndpointIdByName
};

// ONLINE data
//Ethereum
//USDC: 1
//USDT: 2
//
//BSC
//USDT: 2
//BUSD: 5
//Avalanche
//USDC: 1
//USDT: 2
//Polygon
//USDC: 1
//USDT: 2
//Arbitrum
//USDC: 1
//USDT: 2
//Optimism
//USDC: 1
//Fantom
//USDC: 1

//Ethereum​
//chainId: 1
//Router.sol: 0x8731d54E9D02c286767d56ac03e8037C07e01e98
//StargateToken.sol: 0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6
//LPStaking.sol: 0xB0D502E938ed5f4df2E681fE6E419ff29631d62b
//Bridge.sol: 0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97
//Binance Smart Chain​
//chainId: 2
//Router.sol: 0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8
//StargateToken.sol: 0xB0D502E938ed5f4df2E681fE6E419ff29631d62b
//LPStaking.sol: 0x3052A0F6ab15b4AE1df39962d5DdEFacA86DaB47
//Bridge.sol: 0x6694340fc020c5E6B96567843da2df01b2CE1eb6
//Avalanche​
//chainId: 6
//Router.sol: 0x45A01E4e04F14f7A4a6702c74187c5F6222033cd
//StargateToken.sol: 0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590
//LPStaking.sol: 0x8731d54E9D02c286767d56ac03e8037C07e01e98
//Bridge.sol: 0x9d1B1669c73b033DFe47ae5a0164Ab96df25B944
//Polygon​
//chainId: 9
//Router.sol: 0x45A01E4e04F14f7A4a6702c74187c5F6222033cd
//StargateToken.sol: 0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590
//LPStaking.sol: 0x8731d54E9D02c286767d56ac03e8037C07e01e98
//Bridge.sol: 0x9d1B1669c73b033DFe47ae5a0164Ab96df25B944
//Arbitrum​
//chainId: 10
//Router.sol: 0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614
//StargateToken.sol: 0x6694340fc020c5E6B96567843da2df01b2CE1eb6
//LPStaking.sol: 0xeA8DfEE1898a7e0a59f7527F076106d7e44c2176
//Bridge.sol: 0x352d8275AAE3e0c2404d9f68f6cEE084B5bEB3DD
//Optimism​
//chainId: 11
//Router.sol: 0xB0D502E938ed5f4df2E681fE6E419ff29631d62b
//StargateToken.sol: 0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97
//LPStaking.sol: 0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8
//Bridge.sol: 0x701a95707A0290AC8B90b3719e8EE5b210360883
//Fantom​
//chainId: 12
//Router.sol: 0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6
//StargateToken.sol: 0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590
//LPStaking.sol: 0x224D8Fd7aB6AD4c6eb4611Ce56EF35Dec2277F03
//Bridge.sol: 0x45A01E4e04F14f7A4a6702c74187c5F6222033cd