const { utils } = require("ethers");
const { BigNumber } = require("ethers");
const { hexStripZeros } = require("ethers/lib/utils");

function bn(n,p){
    return BigNumber.from(n).mul(BigNumber.from(10).pow(p))
}

task("xTestnetSwap", "run swap")
    //.addParam("name", "the token name")
    //.addParam("symbol", "the symbol")

    .setAction(async (taskArgs) => {
        // testnet addresses
        const mbtc_token_f = "0xCc15197f9cA3c942816540304138e822030c4365";
        const mbtc_token_m = "0xe3aE2E7297680752F5486ebF3f8aD047BeeD3657"; //mumbai
        const tusd_token = "0xD2B5Dd4f7bf11Ddb2ED2467805360254a36a69Bc";
        const sushi_router = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
        const cult_token = "0x12F3262be14f5607a36a86b9F2fe95aFC6ffd775";
        const stg_router_mumbai = "0x9764f85472018387fF2FDfe542B9AD7b70AeebE8";
        const stg_router_fuji = "0x9a5E46ef59897CD74D825bcf0A9dFB20F7Bdf060";
        const lz_fuji = "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706";
        let xswap
        if (hre.network.name == "fuji"){
            xswap = "0x493bd6854897A73596E33E8B047607245b950293"
        }else if (hre.network.name == "mumbai"){
            xswap = "0x1cf266838d871eb6383264690490c7295Aff60dc"
        }
        // our target
        // mumbai     ->            stg  ->     fuji
        // sushiswap(mbtc->tusd)    tusd        sushiswap(tusd->cult)

        //let targetNetworks = taskArgs.targetNetworks.split(",")
        //for (let targetNetwork of targetNetworks) {
        //    let dstChainId = getEndpointIdByName(targetNetwork)
        //const stg_en
        let accounts = await ethers.getSigners()
        let owner = accounts[0] // me
        console.log(`owner: ${owner.address}`)

        let swap = await ethers.getContractAt("sushiLayerZero", xswap)
        let mbtc = await ethers.getContractAt("MockToken", mbtc_token_m)
        let cult = await ethers.getContractAt("MockToken", cult_token)
        let tusd = await ethers.getContractAt("MockToken", tusd_token)
        //approve router

        if (hre.network.name == "fuji"){
        //let tx = await cult.approve(xswap, bn("10000000000", 18))
        //console.log(`approve tx:${tx}`)
        //let cult_allow = await cult.allowance(owner.address, xswap)
        //console.log(cult_allow)
        }else{
        //let tx = await mbtc.approve(xswap, bn("10000000000", 18))
        //console.log(`approve tx:${tx}`)
        //let mbtc_all = await mbtc.allowance(owner.address, xswap)
        //console.log(mbtc_all)
        }

        //swap
        if (hre.network.name == "fuji"){
            const cultAmount = ethers.utils.parseEther("2000", await cult.decimals())
            const srcChainId = 10006
            const dstChainId = 10009
            const srcPoolId = 1
            const dstPoolId = 2
            const target = "0x1cf266838d871eb6383264690490c7295Aff60dc"
            const slip = 1
            const remote_payload = utils.defaultAbiCoder.encode(
                // dst, amount, path
                ["address", "uint256", "address[]"],
                [
                    owner.address,
                    1000,
                    [tusd_token, mbtc_token_m]
                ]
            )
            tx = await (await swap.swapThenStg(
                cultAmount,
                [cult_token, tusd_token],
                0,
                dstChainId,
                srcPoolId,
                dstPoolId,
                target,
                slip,
                remote_payload,//"0x",//remote_payload,
                { value: ethers.utils.parseEther("1") } 
                )).wait(1)
            console.log(`swapThenStg tx:${tx.transactionHash}`)
            return

        }
        let mbtcInDecimal = ethers.utils.parseUnits("0.01", await mbtc.decimals())
        //isallowed
        let al = await swap.TOKENS_ALLOWED(tusd_token)
        console.log(`allowed amount:${al}`)

        const remote_payload = utils.defaultAbiCoder.encode(
            // dst, amount, path
            ["address", "uint256", "address[]"],
            [
                owner.address,
                111111111,
                [tusd_token, cult_token]
            ]
        )
        const srcChainId = 10009
        const dstChainId = 10006
        const srcPoolId = 2
        const dstPoolId = 1
        const target = "0x493bd6854897A73596E33E8B047607245b950293"
        const slip = 1
        tx = await (await swap.swapThenStg(
            mbtcInDecimal,
            [mbtc_token_m, tusd_token],
            0,
            dstChainId,
            srcPoolId,
            dstPoolId,
            owner.address,
            slip,
            "0x",//remote_payload,
            { value: ethers.utils.parseEther("1") } 
            )).wait(1)
        console.log(`swapThenStg tx:${tx.transactionHash}`)
    })
