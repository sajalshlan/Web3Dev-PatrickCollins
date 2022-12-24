// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.17;

//Raffle contract
//Enter the lottery - paying some amount
//Winner to be selected every X minutes -> completly automated
//Chainlink Oracle -> Randomness, Autmated execution (by chainlink keepers)

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