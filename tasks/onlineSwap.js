const { POOLS,getEndpointId,getEndpointIdByName } = require("../utils/network")

encodeParams = (types, values, packed = false) => {
    if (!packed) {
        return web3.eth.abi.encodeParameters(types, values)
    } else {
        return ethers.utils.solidityPack(types, values)
    }
}

encodePackedParams = (types, values) => {
    return encodeParams(types, values, true)
}

task("onlineSwap", "swap using stargate")
    .addParam("poolId", "the poolId")
    .addParam("dstPoolId", "the destination poolId")
    .addParam("qty", "the quantity to swap")
    .addParam("targetNetwork", "the destination netowrk to swap() tokens to")

    .setAction(async (taskArgs) => {
        let accounts = await ethers.getSigners()
        let owner = accounts[0] // me
        console.log(`owner: ${owner.address}`)

        //fuji 
        // router 0x13093E05Eb890dfA6DacecBdE51d24DabAb2Faa1
        // usdc 0x4A0D1092E9df255cf95D72834Ea9255132782318
        // poolid 1
        //mumbai
        // router 0x817436a076060D158204d955E5403b6Ed0A5fac0
        // usdc 0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7
        // poolid 1

        let router_addr = "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd";
        let usdc_addr = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
        let usdt_addr = "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7"
        let xswap_addr = "0x7740Dc97Ad7B0c3d5f198D4ae75B5bE0c6D0C476"
        if (hre.network.name == "localhost"){
            router_addr = "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd"; //polygon
            usdc_addr = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            usdt_addr = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
            xswap_addr = "0xfbbe20e0621e625af563b06bc86da6b36ee4e7c5"
        }
        const router = await ethers.getContractAt("Router", router_addr)
        //console.log(`-> [stargate] router.address: ${router.address}`)
        //const factory_addr = await router.factory()
        //console.log("factory",  factory_addr)
        //const factory = await ethers.getContractAt("Factory", factory_addr)
        //const fs = await factory.allPoolsLength()
        //console.log(fs)
        //console.log("pools",await factory.allPools(0))
        //console.log("pools",await factory.allPools(1))
        //let pool = await ethers.getContractAt("Pool","0x1205f31718499dBf1fCa446663B532Ef87481fe1")
        //console.log(await pool.token())
        //console.log(await pool.poolId())
        //pool = await ethers.getContractAt("Pool","0x29e38769f23701A2e4A8Ef0492e19dA4604Be62c")
        //console.log(await pool.token())
        //console.log(await pool.poolId())
        //return

        // 0x7740Dc97Ad7B0c3d5f198D4ae75B5bE0c6D0C476 avax_xswap
        // 0xfbbe20e0621e625af563b06bc86da6b36ee4e7c5 poly_xswap
        if(false){//deploy xswap
            const XSwap = await ethers.getContractFactory("XSwap")
            const xswap = await XSwap.deploy(router_addr, 2, [usdc_addr])
            console.log(xswap)
            console.log("xswap", xswap.address)
            return
        }
        if(false){ //xswap swapThenStg ->usdt
            let xswap = await ethers.getContractAt("XSwap", xswap_addr)
            //await xswap.addToken(usdt_addr)
            let usdc = await ethers.getContractAt("MockToken", usdc_addr)
            //let tx = await usdc.approve(xswap_addr, bn(10000, 18))
            //console.log("approve", tx)

            const stg_addr = "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590"
            let stg = await ethers.getContractAt("MockToken", stg_addr)
            //let tx = await stg.approve(xswap_addr, ethers.utils.parseEther("1000", 18))
            //console.log("approve", await tx.wait())
        const stgAmount = ethers.utils.parseEther("0.1", await stg.decimals())
        const dstChainId = 6
        const srcPoolId = taskArgs.poolId
        const dstPoolId = taskArgs.dstPoolId
        const target = owner.address
        const slip = 1
        //const remote_payload = ethers.utils.defaultAbiCoder.encode(
        //    // dst, amount, path
        //    ["address", "uint256", "address[]"],
        //    [
        //        owner.address,
        //        1000,
        //        [tusd_token, mbtc_token_m]
        //    ]
        //)
        console.log(`sushiswap: ${stgAmount} to usdc to ${target} chain:${dstChainId} pool:${srcPoolId}->${dstPoolId}`)
        tx = await (await xswap.swapThenStg(
            stgAmount,
            [stg_addr, usdt_addr],
            0,
            dstChainId,
            srcPoolId,
            dstPoolId,
            target,
            slip,
            "0x",//remote_payload,
            { value: ethers.utils.parseEther("5.5") } 
            )).wait(1)
        console.log(`swapThenStg tx:${tx.transactionHash}`)
        return
        }
        {// delopy on testent && 
        }
        if(true){ //xswap swapThenStg ->usdt -> xavax
            const stg_addr = "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590"
            let xswap = await ethers.getContractAt("XSwap", xswap_addr)
//            await xswap.addToken(usdc_addr)
//            await xswap.addToken(stg_addr)
            let usdc = await ethers.getContractAt("MockToken", usdc_addr)
//            let tx = await usdc.approve(xswap_addr, 10000)
//            console.log("approve", tx)

            let stg = await ethers.getContractAt("MockToken", stg_addr)
            //let tx = await stg.approve(xswap_addr, ethers.utils.parseEther("1000", 18))
            //console.log("approve", await tx.wait())
        const stgAmount = ethers.utils.parseEther("0.1", await stg.decimals())
        const dstChainId = 6
        const srcPoolId = taskArgs.poolId
        const dstPoolId = taskArgs.dstPoolId
        const target = "0x7740dc97ad7b0c3d5f198d4ae75b5be0c6d0c476"
        const slip = 1
        let adapterParams = ethers.utils.solidityPack(
            ['uint16','uint256'],
            [1, 200000]
        )
        console.log("adapter", adapterParams)
        return
        let remote_payload = ethers.utils.solidityPack(
            ["address", "uint256", "address[]"],
            [
                router.address,
                1000,
                ["0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"]
            ])
        console.log("encode payload", remote_payload)


        const payload = encodeParams(
            ["uint256", "uint256"],
            ["0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"])
        //await usdc.approve(router.address, 10000000)
        const a = await router.quoteLayerZeroFee(
            dstChainId,
            1,
            router.address,
            remote_payload,
            { dstGasForCall: 50000, dstNativeAmount: 123400, dstNativeAddr: ethers.utils.solidityPack(["address"], [router.address]) }
            //{ dstGasForCall: 50000, dstNativeAmount: 123400, dstNativeAddr: "0x" }
        )
        console.log(a)
        return
        tx = await (
            await router.swap(
                6,  //dstChainId(avax)
                1,  // srcpoolId(usdc)
                1,  // dstPoolId(usdc)
                owner.address,  // me
                100000,         // amt
                0,              // minAmt
                { dstGasForCall: 0, dstNativeAmount: 0, dstNativeAddr: "0x" },
                target,         // my destination contract
                remote_payload, // my dst contract params
                { value: ethers.utils.parseEther("5") } // guess a value high enough , it refunds extra
            )
        ).wait()
        return
        tx = await (await xswap.swapThenStg(
            stgAmount,
            [stg_addr, usdc_addr],
            0,
            dstChainId,
            srcPoolId,
            dstPoolId,
            target,
            slip,
            "0x",//remote_payload,
            { value: ethers.utils.parseEther("4.3") } 
            )).wait(1)
        console.log(`swapThenStg tx:${tx.transactionHash}`)
        return
        }
        if  (false){//normal stg transfer
            // get the token address from the router for the pool id so we know the address to approve
            let mockToken = await ethers.getContractAt("MockToken", usdc_addr) // erc20
            await (await mockToken.approve(router_addr, 1000000000)).wait(1)

            let bnQty = ethers.BigNumber.from(taskArgs.qty)
            let bnQtyMin = bnQty.mul(99).div(1000)

            //let dstChainId = getEndpointIdByName(taskArgs.targetNetwork)
            dstChainId = 6
            //console.log(`source(${getEndpointIdByName(hre.network.name)})  swap--> dstChainId(${dstChainId})`)
            let tx = await (
                await router.swap(
                    dstChainId,
                    taskArgs.poolId,
                    taskArgs.dstPoolId,
                    owner.address,
                    bnQty,
                    bnQtyMin,
                    { dstGasForCall: 1, dstNativeAmount: ethers.utils.parseEther("0.01"), dstNativeAddr: owner.address },
                    //{ dstGasForCall: 0, dstNativeAmount: 0, dstNativeAddr: "0x" },
                    owner.address,
                    "0x",
                    { value: ethers.utils.parseEther("0.01") } // guess a value high enough , it refunds extra
                )
            ).wait()
            console.log(`tx.transactionHash: ${tx.transactionHash}`)
        }
    })
