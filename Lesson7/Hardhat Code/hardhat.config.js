require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
// require("../tasks/block-number")
// require("hardhat-gas-reporter")
// require("solidity-coverage")
require("hardhat-deploy")

//adding this or operators below so that sometimes if the url was not there, so hardhat won't show so many errors.

const GOERLI_RPC_URL =
    process.env.GOERLI_RPC_URL || "https://eth-goerli/example"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "pKey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "aKey"
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY || "aKey"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            //accounts: thanks hardhat!,
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            //different network mai different position:
            31337: 1,
        },
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        apiKey: COINMARKET_API_KEY,
    },
    solidity: {
        compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
    },
}
