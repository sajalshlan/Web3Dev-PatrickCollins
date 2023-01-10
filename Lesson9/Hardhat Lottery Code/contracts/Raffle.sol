// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.17;

//Raffle Contract

//players entering with paying entry fee
//pick a random winner -> verifyable random variable chainlink
//winner selected every X minutes -> automate it

//Chainlink Oracle -> Randomness, Automated Execution(Chainlink keepers)


contract Raffle {
    uint private immutable i_entranceFee;

    constructor(uint entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        
    }


//     function pickRandomWinner() {}

function getEntranceFee() public view returns(uint){
    return i_entranceFee;
}

 }