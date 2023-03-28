 const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", function () {
    //making these variables global so that later the it() test can also access them
    let simpleStorageFactory, simpleStorage
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("should start with a fav number of 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"

        //toString() as the currentValue is going to be a big number
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("should update when we call store", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)
        const updatedValue = await simpleStorage.retrieve()

        assert.equal(updatedValue.toString(), expectedValue)
    })
})
