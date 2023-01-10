// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.17;

//Raffle Contract

//players entering with paying entry fee
//pick a random winner -> verifyable random variable chainlink
//winner selected every X minutes -> automate it

//Chainlink Oracle -> Randomness, Automated Execution(Chainlink keepers)


contract Raffle {

    /* State Variables */
    uint private immutable i_entranceFee;
    address payable[] private s_players;

    error RAFFLE__NotEnoughEthEntered();

    constructor(uint entranceFee) {
        i_entranceFee = entranceFee;
    }

    //making enterRaffle payable as people will sending eth, hence we accepting msg.value

    function enterRaffle() public payable {
        if(msg.value<i_entranceFee){
            revert RAFFLE__NotEnoughEthEntered();
        }
        s_players.push(payable(msg.sender));
    }


//     function pickRandomWinner() {}

function getEntranceFee() public view returns(uint){
    return i_entranceFee;
}

function getPlayers(uint index) public view returns(address) {
return s_players[index];
}

 }