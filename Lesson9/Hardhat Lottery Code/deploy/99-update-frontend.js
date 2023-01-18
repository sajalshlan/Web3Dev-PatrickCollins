//constantly update abi and contract addresses in the frontend
const { ethers } = require("hardhat")
const fs = require("fs")

const FRONTEND_ADDRESSES_FILE =
    "../../Lesson10/nextjs-smart-contract-lottery/constants/contractAddresses.json"
const FRONTEND_ABI_FILE = "../../Lesson10/nextjs-smart-contract-lottery/constants/abi.json"
const chainId = network.config.chainId.toString()

module.exports = async () => {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend")
        updateContractAddresses()
        console.log("addresses updated")
        updateAbi()
        console.log("abi updated")
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")

    //we can directly get and write the file in one line
    fs.writeFileSync(FRONTEND_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const currentAddresses = JSON.parse(fs.readFileSync(FRONTEND_ADDRESSES_FILE, "utf-8"))

    //now the chainid game
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(raffle.address)) {
            currentAddresses[chainId].push(raffle.address)
        }
    }
    currentAddresses[chainId] = [raffle.address]

    //now write these back to the file
    //lete hain toh parse karke, dete hai toh stringify karke
    fs.writeFileSync(FRONTEND_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend"]
