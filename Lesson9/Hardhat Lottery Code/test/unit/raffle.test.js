const { assert, expect } = require("chai")
const { FunctionFragment } = require("ethers/lib/utils")
const { network, deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", function () {
          let raffle, VRFCoordinatorV2Mock, deployer, interval
          const chainId = network.config.chainId

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer

              //deploying all deploy scripts
              await deployments.fixture(["all"])

              //connecting the contracts with deployer
              raffle = await ethers.getContract("Raffle", deployer)
              VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()
          })

          describe("constructor", function () {
              it("initializes the raffle contract correctly", async function () {
                  //ideally we make our tests have just one assert per it

                  const raffleState = await raffle.getRaffleState()

                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })

          describe("enterRaffle", function () {
              it("reverts when you don't pay enough", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "RAFFLE__NotEnoughEthEntered"
                  )
              })

              it("records player when they enter", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  assert.equal(playerFromContract, deployer)
              })

              it("emits an event when entering", async function () {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
                      raffle,
                      "RaffleEntry"
                  )
              })

              it("doesnt allow entrance when raffle is calculating", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])

                  //pretending to be a chainlink keeper
                  //calling the performUpKeep function
                  await raffle.performUpkeep([])

                  //expect condition
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
                      "RAFFLE__NotOpen"
                  )
              })
          })

          describe("checkUpkeep", function () {
              it("returns false if people have not sent any ETH", async function () {
                  //means make all the conditions of checkUpkeep true except the one sending the balance
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])

                  //not writing the remaining one condition, i.e, raffleState == OPEN, as in the beforeEach function, we deploy the raffle contract, and when deploying we pass in the args for constructor and there in raffleState is set to OPEN itself, so no need for us to set it open.
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])

                  assert(!upkeepNeeded)
              })

              it("returns false if raffle is not open", async function () {
                  //so we don't want raffle to be open, that means we need to it in performUpkeep, and for the rest - we gotta make them true
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])

                  await raffle.performUpkeep([])
                  const raffleState = await raffle.getRaffleState()

                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])

                  //assert
                  assert.equal(raffleState.toString(), "1")
                  assert.equal(upkeepNeeded, false)
              })

              it("returns false if enough time hasn't passed", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() - 10])
                  await network.provider.send("evm_mine", [])

                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert(!upkeepNeeded)
              })
          })

          describe("performUpkeep", function () {
              it("it can only run if checkUpkeep is true", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])

                  //i dont get it here, if performUpkeep is returning something true, it means checkUpkeep was true as performUpkeep got executed, so it should be a test for checkUpkeep right, not performUpkeep

                  const tx = await raffle.performUpkeep([])
                  assert(tx)
              })

              it("reverts if checkUpkeep is not true", async function () {
                  await expect(raffle.performUpkeep([])).to.be.reverted
              })

              it("updates the raffle state, calls the vrfCoordinator and emits an event", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])

                  //calling the performUpkeep
                  const txResponse = await raffle.performUpkeep([])
                  const txReceipt = await txResponse.wait(1)

                  //emitting the event
                  const requestId = txReceipt.events[1].args.requestId

                  //getting the raffle state
                  const raffleState = await raffle.getRaffleState()

                  //assert
                  assert(requestId.toNumber() > 0)
                  assert.equal(raffleState.toString(), "1")
              })
          })
      })
