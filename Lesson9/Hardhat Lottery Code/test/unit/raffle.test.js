const { network, deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", async function () {
          let raffle, VRFCoordinatorV2Mock
          beforeEach(async function () {
              const { deployer } = await getNamedAccounts()

              //deploying all deploy scripts
              await deployments.fixture(["all"])

              //connecting the contracts with deployer
              raffle = await ethers.getContract("Raffle", deployer)
              VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })

          describe("constructor", async function () {
              it("initializes the raffle contract correctly", async function () {
                  //ideally we make our tests have just one assert per it
              })
          })
      })
