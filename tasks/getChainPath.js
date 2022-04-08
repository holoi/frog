//const { ChainId } = require("@layerzerolabs/core-sdk")
//const { PoolId } = require("@layerzerolabs/stargate-sdk")
const { POOLS,getEndpointId,getEndpointIdByName } = require("../utils/network")

task("getChainPath", "get chain path from the chainpaths map")
    .addParam("poolId", "the poolId")
    .setAction(async (taskArgs) => {
        // console.log(`taskArgs: ${JSON.stringify(taskArgs)}`);

        let accounts = await ethers.getSigners()
        let owner = accounts[0] // me
        console.log(`owner: ${owner.address}`)
        //
        // let Factory = await ethers.getContractFactory("Factory")
        // let factory = await Factory.attach(taskArgs.factory)
        //
        // let Router = await ethers.getContractFactory("Router")
        // let router = await Router.attach(taskArgs.router)
        // const Factory = await ethers.getContractFactory("Factory")
        // const factoryAddr = (await hre.deployments.get("Factory")).address
        // const factory = await Factory.attach(factoryAddr)

        //const factory = await hre.ethers.getContract("Factory")
        //const factory = await hre.ethers.getContractAt("Factory", "0x439C197429036423d42631181afAC655b19972e5")//fujifactory
        const factory = await hre.ethers.getContractAt("Factory", "0x43c3a5348671D868ED9dD9BFDb2859bE984d262e")//mumbaifactory

        let poolAddr = await factory.getPool(taskArgs.poolId)

        let Pool = await ethers.getContractFactory("Pool")
        let pool = await Pool.attach(poolAddr)

        //const chainId = await getChainId(hre.network.name)
        const chainId = getEndpointIdByName(hre.network.name)

        console.log("chainId", chainId)
        console.log("poolId", taskArgs.poolId)

        const chainPathIndex = await pool.chainPathIndexLookup(chainId, taskArgs.poolId)
        console.log(`chainPathIndex: ${chainPathIndex}`)

        console.log(await pool.chainPaths(chainPathIndex))

        console.log(`poolAddr: ${poolAddr}`)
        console.log(`pool.poolId: ${await pool.poolId()}`)
        console.log(`pool.token: ${await pool.token()}`)
        console.log(`pool.sharedDecmals: ${await pool.sharedDecimals()}`)
        console.log(`pool.localDecimals: ${await pool.localDecimals()}`)
        console.log(`pool.totalLiquidity: ${await pool.totalLiquidity()}`)
        console.log(await pool.name(), await pool.symbol())
    })
