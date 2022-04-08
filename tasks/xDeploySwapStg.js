const { utils } = require("ethers");
const { hexStripZeros } = require("ethers/lib/utils");

task("xDeploySwapStg", "deploy swapstgswap")
    //.addParam("name", "the token name")
    //.addParam("symbol", "the symbol")

    .setAction(async (taskArgs) => {
        // testnet addresses
        const mbtc_token = "0xCc15197f9cA3c942816540304138e822030c4365";
        const tusd_token = "0xD2B5Dd4f7bf11Ddb2ED2467805360254a36a69Bc";
        const sushi_router = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
        const cult_token = "0x12F3262be14f5607a36a86b9F2fe95aFC6ffd775";
        const stg_router_mumbai = "0x9764f85472018387fF2FDfe542B9AD7b70AeebE8";
        const stg_router_fuji = "0x9a5E46ef59897CD74D825bcf0A9dFB20F7Bdf060";
        // our target
        // mumbai     ->            stg  ->     fuji
        // sushiswap(mbtc->tusd)    tusd        sushiswap(tusd->cult)

        //const stg_en
        let accounts = await ethers.getSigners()
        let owner = accounts[0] // me
        console.log(`owner: ${owner.address}`)

        let Swap = await ethers.getContractFactory("sushiLayerZero")
        let swap
        if (hre.network.name == "mumbai"){
            swap = await Swap.deploy(stg_router_mumbai, 2, [tusd_token])
        }else if(hre.network.name == "fuji"){
            swap = await Swap.deploy(stg_router_fuji, 2, [tusd_token])
        }
        
        //0x1cf266838d871eb6383264690490c7295Aff60dc
        //0x493bd6854897A73596E33E8B047607245b950293 fuji
        console.log(`deploy xSwap ${swap.address}`)
    })
