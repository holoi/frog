const { POOLS,getEndpointId,getEndpointIdByName } = require("../utils/network")

task("testnetSwap", "swap using stargate")
    .addParam("poolId", "the poolId")
    .addParam("dstPoolId", "the destination poolId")
    .addParam("qty", "the quantity to swap")
    .addParam("targetNetwork", "the destination netowrk to swap() tokens to")

    .setAction(async (taskArgs) => {
        let accounts = await ethers.getSigners()
        let owner = accounts[0] // me
        console.log(`owner: ${owner.address}`)

        const factory = await ethers.getContract("Factory")
        console.log(`-> [stargate] factory.address: ${factory.address}`)
        const router = await ethers.getContract("Router")
        console.log(`-> [stargate] router.address: ${router.address}`)

        // get the token address from the router for the pool id so we know the address to approve
        let Pool = await ethers.getContractFactory("Pool")
        let poolData = await factory.getPool(taskArgs.poolId)
        let pool = await Pool.attach(poolData)
        let poolTokenAddr = await pool.token()
        console.log(`swap() poolTokenAddr: ${poolTokenAddr}`)
        let MockToken = await ethers.getContractFactory("MockToken") // erc20
        let mockToken = await MockToken.attach(poolTokenAddr)
        await (await mockToken.approve(router.address, taskArgs.qty)).wait(1)

        let bnQty = ethers.BigNumber.from(taskArgs.qty)
        let bnQtyMin = bnQty.mul(993).div(1000)

        let dstChainId = getEndpointIdByName(taskArgs.targetNetwork)
        console.log(`source(${getEndpointIdByName(hre.network.name)})  swap--> dstChainId(${dstChainId})`)
        let tx = await (
            await router.swap(
                dstChainId,
                taskArgs.poolId,
                taskArgs.dstPoolId,
                owner.address,
                bnQty,
                bnQtyMin,
                //{ dstGasForCall: 1, dstNativeAmount: ethers.utils.parseEther("0.01"), dstNativeAddr: "0x7E57DdEA1F9a028343020B9213b9A8d3Cb9Fa0d9" },
                { dstGasForCall: 0, dstNativeAmount: 0, dstNativeAddr: "0x" },
                owner.address,
                "0x",
                { value: ethers.utils.parseEther("1.5") } // guess a value high enough , it refunds extra
            )
        ).wait()
        console.log(`tx.transactionHash: ${tx.transactionHash}`)
    })
