const { ethers } = require("hardhat")
const { isTestnet } = require("../utils/network")
const { ZERO_ADDRESS } = require("./util/constants")
const { getAddr, deployNew } = require("./util/helpers")
const { BigNumber } = require("ethers")

describe("XSwap: ", function () {
    let owner, alice, badUser1, fakeContract, feeLibrary, lzEndpoint, factory, tokenOne, tokenTwo, pool, router
    let chainId, stargateTokenSpender, poolId, decimals, maxInt256Str, maxInt256, initSupplyMainEndpoint
    let mainEndpointId, name, symbol, dstPoolId, dstChainId, defaultChainPathWeight, nonDefaultChainPathWeight
    let defaultAmountLD, defaultMinAmountLD
    let dstBridge,dstRouter,lzDstEndpoint
    before(async function () {
        ;({ owner, alice, badUser1, fakeContract } = await getAddr(ethers))
        poolId = 1
        chainId = 11
        dstPoolId = 2
        dstChainId = 22
        decimals = 18
        mainEndpointId = 1
        defaultChainPathWeight = 1
        nonDefaultChainPathWeight = 4
        defaultAmountLD = 1
        defaultMinAmountLD = 1
        maxInt256Str = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        maxInt256 = ethers.BigNumber.from(maxInt256Str)
        initSupplyMainEndpoint = ethers.utils.parseEther("1000000000")
        name = "Pool1"
        symbol = "S*P1"
    })

    beforeEach(async function () {
        // contracts
        lzEndpoint = await deployNew("LZEndpointMock", [chainId])
        lzDstEndpoint = await deployNew("LZEndpointMock", [dstChainId])
        tokenOne = await deployNew("MockToken", ["One", "ONE", 18])
        tokenTwo = await deployNew("MockToken", ["Two", "TWO", 18])
        stargateTokenSpender = await deployNew("StargateToken", ["SGTest", "SGTEST", lzEndpoint.address, mainEndpointId, initSupplyMainEndpoint])
        router = await deployNew("Router")
        dstRouter = await deployNew("Router")
        bridge = await deployNew("Bridge", [lzEndpoint.address, router.address])
        dstBridge = await deployNew("Bridge", [lzDstEndpoint.address, dstRouter.address])
        factory = await deployNew("Factory", [router.address])
        dstFactory = await deployNew("Factory", [dstRouter.address])
        feeLibrary = await deployNew("StargateFeeLibraryV02", [factory.address])
        dstfeeLibrary = await deployNew("StargateFeeLibraryV02", [dstFactory.address])

        await router.setBridgeAndFactory(bridge.address, factory.address)
        await dstRouter.setBridgeAndFactory(dstBridge.address, dstFactory.address)

        // setup
        await factory.setDefaultFeeLibrary(feeLibrary.address)
        await dstFactory.setDefaultFeeLibrary(dstfeeLibrary.address)
        await bridge.setBridge(dstChainId, dstBridge.address)
        await dstBridge.setBridge(chainId, bridge.address)
        await lzEndpoint.setDestLzEndpoint(dstBridge.address, lzDstEndpoint.address)
        await lzDstEndpoint.setDestLzEndpoint(bridge.address, lzEndpoint.address)

        // create pool
        await router.createPool(poolId, tokenOne.address, 18, 18, "x", "x*")
        await dstRouter.createPool(dstPoolId, tokenOne.address, 18, 18, "x", "x*")
        //chainpath
        await router.createChainPath(poolId, dstChainId, dstPoolId, 1)
        await dstRouter.createChainPath(dstPoolId, chainId, poolId, 1)
        //active
        await router.activateChainPath(poolId, dstChainId, dstPoolId)
        await dstRouter.activateChainPath(dstPoolId, chainId, poolId)
        // addliq
        amountLd = BigNumber.from("10000000000000000000000")
        amountLd2 = BigNumber.from("10000000000000000000000")
        await tokenOne.approve(router.address, maxInt256Str)
        await tokenOne.approve(dstRouter.address, maxInt256Str)
        await tokenTwo.approve(dstRouter.address, maxInt256Str)
        await router.addLiquidity(poolId, amountLd, owner.address)
        await dstRouter.addLiquidity(dstPoolId, amountLd2, owner.address)
        const poolAddr = await factory.getPool(poolId)
        const dstPoolAddr = await dstFactory.getPool(dstPoolId)
        pool = await ethers.getContractAt("Pool", poolAddr)
        dstPool = await ethers.getContractAt("Pool", dstPoolAddr)
        console.log(await pool.totalLiquidity())
        console.log(await dstPool.totalLiquidity())
        //sendcredit
        await router.sendCredits(dstChainId, poolId,  dstPoolId, owner.address,{value:1})
        await dstRouter.sendCredits(chainId, dstPoolId, poolId, owner.address, {value:1})
    })
    it("swap()", async function () {
        console.log(await tokenOne.balanceOf(owner.address))
        console.log(await tokenTwo.balanceOf(owner.address))
        tx = await router.swap(
                dstChainId,
                poolId,
                dstPoolId,
                owner.address,
                BigNumber.from("11"),
                BigNumber.from("1"),
                { dstGasForCall: 0, dstNativeAmount: 0, dstNativeAddr: "0x" },
                owner.address,
                "0x"
            )
        console.log(await tx.wait())
        console.log(await tokenOne.balanceOf(owner.address))
        console.log(await tokenTwo.balanceOf(owner.address))
    })
})
