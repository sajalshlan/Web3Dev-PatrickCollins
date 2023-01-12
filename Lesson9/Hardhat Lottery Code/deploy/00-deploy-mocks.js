import { network } from "hardhat"
import { developmentChains } from "../helper-hardhat-config"

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log("Local network detected, deploying mocks...")
        //deploy a mock vrf coordinator
    }
}
