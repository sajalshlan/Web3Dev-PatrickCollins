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

        it("withdraw ETH sent with a single funder", async () => {
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

            const { gasUsed, effectiveGasPrice } = transactionReceipt
            gasCost = gasUsed.mul(effectiveGasPrice)

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

        it("withdraw ETH sent with multiple funders", async () => {
            const accounts = await ethers.getSigners()

            //Arrange
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            //Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionReceipt
            gasCost = gasUsed.mul(effectiveGasPrice)

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

            //make sure that the funders are reset properly

            await expect(fundMe.funders(0)).to.be.reverted

            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.addressToAmountFunded(accounts[i].address),
                    0
                )
            }
        })

        it("only allows the owner to withdraw the amount", async () => {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]

            const attackerConnectedContract = await fundMe.connect(attacker)
            await expect(attackerConnectedContract.withdraw()).to.be.reverted
        })
    })
})
