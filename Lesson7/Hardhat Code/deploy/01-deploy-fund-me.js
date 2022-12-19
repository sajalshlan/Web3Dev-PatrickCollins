//import

const { network } = require("hardhat")

//main function

// //calling the main function
// function deployFunc(hre) {
//     hre.getNamedAccounts()
//     hre.deployments()
// }

// module.exports.default = deployFunc

const { helperConfig, networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //if chain is X use address Y
    //if chain is Z use address A
    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    //mock contract for localhost?
    //if the contract doesn't exist, we deploy a minimal version of it for our local testing - make a deploy script 00

    //we use namedAccounts, a method  given by the ethers library to easily give name to those different private key spots, mentioned in the network section of config file

    //so, when going for localhost or hardhat network, we want to use a mock

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //put price feed address
        log: true,
    })
}
