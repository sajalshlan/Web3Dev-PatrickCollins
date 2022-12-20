//import

const { network } = require("hardhat")

//main function

// //calling the main function
// function deployFunc(hre) {
//     hre.getNamedAccounts()
//     hre.deployments()
// }

// module.exports.default = deployFunc

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //if chain is X use address Y
    //if chain is Z use address A
    // let ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //mock contract for localhost?
    //if the contract doesn't exist, we deploy a minimal version of it for our local testing - make a deploy script 00

    //we use namedAccounts, a method  given by the ethers library to easily give name to those different private key spots, mentioned in the network section of config file

    //so, when going for localhost or hardhat network, we want to use a mock
    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("-----------------")
}
module.exports.tags = ["all", "fundme"]
