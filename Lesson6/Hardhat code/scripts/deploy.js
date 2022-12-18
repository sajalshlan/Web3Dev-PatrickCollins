//imports
const { ethers, run, network } = require("hardhat")
require("dotenv").config()

//main
async function main() {
    const simpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )

    console.log("deploying ...")

    const simpleStorage = await simpleStorageFactory.deploy()
    // await simpleStorage.deployed()

    console.log(`contract deployed to: ${simpleStorage.address}`)

    //calling the verifying function
    //doesn't make sense when deploying to local hardhat network as not hardhat scan, so check for that - can check for that using chainId, to see which one's testnet and mainnet

    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value is: ${currentValue}`)

    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)

    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value is: ${updatedValue}`)
}

async function verify(contractAddress, args) {
    console.log("verifying contract ...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguements: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("already verified!")
        } else {
            console.log(e)
        }
    }
}

//handling error in main function

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
