//const { LZ_ADDRESS } = require("@layerzerolabs/core-sdk")

//endpoint
const LZ_ADDRESS = {
    "rinkeby": "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA",
    "bsc-testnet": "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
    "fuji": "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706",
    "mumbai": "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
    "arbitrum-rinkeby": "0x4D747149A57923Beb89f22E6B7B97f7D8c087A00",
    "optimism-kovan": "0x72aB53a133b27Fa428ca7Dc263080807AfEc91b5",
    "fantom-testnet": "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf"
  }

function getLayerZeroAddress(networkName) {
    if(!Object.keys(LZ_ADDRESS).includes(networkName)){
        throw new Error("Unknown networkName: " + networkName);
    }
    console.log(`networkName[${networkName}]`)
    return LZ_ADDRESS[networkName];
}

module.exports = {
    getLayerZeroAddress
}