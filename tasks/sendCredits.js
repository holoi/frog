//const { CHAIN_ID } = require("@layerzerolabs/core-sdk")
const CHAIN_ID = {
    "rinkeby":          10001,
    "bsc-testnet":      10002,
    "fuji":             10006,
    "mumbai":           10009,
    "arbitrum-rinkeby": 10010,
    "optimism-kovan":   10011,
    "fantom-testnet":   10012
}

task("sendCredits", "sendCredits function from stargate to destination chainId")
    .addParam("poolId", "the poolId")
    .addParam("dstPoolId", "the destination poolId")
    .addParam("targetNetworks", "csv of the target network names")
    .setAction(async (taskArgs, hre) => {
        let accounts = await ethers.getSigners()
        let owner = accounts[0]

        //const bridge = await ethers.getContract("Bridge")
        //const lz = await bridge.layerZeroEndpoint()
        //console.log(lz)
        //return
        const router = await ethers.getContract("Router")

        let targetNetworks = taskArgs.targetNetworks.split(",")
        for (let targetNetwork of targetNetworks) {
            let chainId = CHAIN_ID[targetNetwork]
            try {
                let tx = await router.sendCredits(
                    chainId,
                    taskArgs.poolId,
                    taskArgs.dstPoolId,
                    owner.address,
                    { value: ethers.utils.parseEther("1.9") } // guess, but it should cover the relayer fee
                )
                await tx.wait(1)
                console.log(
                    `💸 ${hre.network.name} > sendCredits( ${chainId}, poolId:${taskArgs.poolId} dstPoolId:${taskArgs.dstPoolId} ) -> tx.hash: ${tx.hash}`
                )
            } catch (e) {
                if (!e.error) {
                    console.log(e)
                } else {
                    console.log(
                        `*  ${hre.network.name} > sendCredits( ${chainId}, poolId:${taskArgs.poolId} dstPoolId:${taskArgs.dstPoolId} ) ... Error: ${e.error.message}]`
                    )
                }
            }
        }
    })
