#npx hardhat --network mumbai wireStargateTokens --target-networks fuji
#npx hardhat --network fuji wireStargateTokens --target-networks mumbai
#
#npx hardhat --network mumbai wireBridges --target-networks fuji 
#npx hardhat --network fuji wireBridges --target-networks mumbai
#
#npx hardhat --network mumbai createPools
#npx hardhat --network fuji createPools
#npx hardhat --network mumbai createChainPaths --target-network fuji
#npx hardhat --network fuji createChainPaths --target-network mumbai
#npx hardhat --network mumbai activateChainPaths --target-network fuji
#npx hardhat --network fuji activateChainPaths --target-network mumbai

npx hardhat --network mumbai addLiquidity --pool-id 12 --qty 2000000
npx hardhat --network fuji addLiquidity --pool-id 112 --qty 2000000
npx hardhat --network mumbai sendCredits --pool-id 12 --dst-pool-id 112 --target-networks fuji
npx hardhat --network fuji sendCredits --pool-id 112 --dst-pool-id 12 --target-networks mumbai
