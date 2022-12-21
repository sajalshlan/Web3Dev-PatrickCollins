const { assert, expect } = require("chai")
const { resolveProperties } = require("ethers/lib/utils")
const { getNamedAccounts, ethers, deployments } = require("hardhat")

describe("FundMe", async function () {
    //deploy our fundMe contract
    //using hardhat-deploy
    // const accounts = await ethers.getSigners()
    // const accountZero = accounts[0]

    let fundMe, deployer, mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") // 1 ETH

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("the eth sent in should be greater than the minimumUSD value", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })

        it("updating the funder to address data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })

        it("add funder to an array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.funders(0)
            assert.equal(response, deployer)
        })
    })

    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })

        it("withdraw ETH and sent to a single founder", async () => {
            let gasCost
            //Arrange
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            //Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            //Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                endingDeployerBalance.add(gasCost).toString(),
                startingFundMeBalance.add(startingDeployerBalance).toString()
            )
        })

        it("address to fundedAmount data structure empty", async () => {
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), "0")
        })
    })
})
