//imports
const { ethers } = require("hardhat")

//main
async function main() {
    const simpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )

    console.log("deploying ...")

    const simpleStorage = await simpleStorageFactory.deploy()
    await simpleStorage.deployed()

    console.log(`contract deployed to: ${simpleStorage.address}`)
}

//handling error in main function

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
