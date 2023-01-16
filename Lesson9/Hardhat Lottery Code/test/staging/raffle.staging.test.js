const { assert, expect } = require("chai")
const { network, deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
          let raffle, deployer, raffleEntranceFee

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer

              //connecting the contracts with deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords/ works well with chainlink keepers and VRF, picks a random winner", async function () {
              //now our job is to just enter the raffle, rest everything is maintained by keepers and vrf
              const startingTimeStamp = await raffle.getLatestTimeStamp()
              const accounts = await ethers.getSigner()

              await new Promise(async (resolve, reject) => {
                  raffle.once("WinnerPicked", async () => {
                      console.log("WinnerPicked event fired")

                      try {
                          //initialization
                          const recentWinner = await raffle.getRecentWinner()
                          const raffleState = await raffle.getRaffleState()
                          const winnerEndingBalance = await accounts[0].getBalance()
                          const endingTimeStamp = await raffle.getLatestTimeStamp()

                          //add asserts here
                          await expect(raffle.getPlayers(0)).to.be.reverted
                          await assert.equal(raffleState.toString(), "0")
                          await assert(endingTimeStamp > startingTimeStamp)
                          await assert.equal(
                              winnerEndingBalance.toString(),
                              winnerStartingBalance.toString()
                          )

                          //resolve
                          resolve()
                      } catch (e) {
                          console.log(e)
                          reject(e)
                      }
                  })

                  await raffle.enterRaffle({ value: enterRaffle })
                  const winnerStartingBalance = await accounts[0].getBalance()
              })

              //setup listener before we enter the raffle - just in case blockchain moves very fast
          })
      })
