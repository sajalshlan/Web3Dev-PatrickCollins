// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.17;

//Raffle Contract

//players entering with paying entry fee
//pick a random winner -> verifyable random variable chainlink
//winner selected every X minutes -> automate it

//Chainlink Oracle -> Randomness, Automated Execution(Chainlink keepers)

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

error RAFFLE__NotEnoughEthEntered();

contract Raffle is VRFConsumerBaseV2{

    /* State Variables */
    uint private immutable i_entranceFee;
    address payable[] private s_players;

    /* Events */
    event RaffleEntry(address indexed player);
    

    constructor(address vrfCoordinatorV2, uint entranceFee) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
    }

    //making enterRaffle payable as people will sending eth, hence we accepting msg.value

    function enterRaffle() public payable {
        if(msg.value<i_entranceFee){
            revert RAFFLE__NotEnoughEthEntered();
        }
        s_players.push(payable(msg.sender));

        //emit an event whenever we update a dynamic array or mapping
        //event named as reverse of function name
    emit RaffleEntry(msg.sender);

    }


     function requestRandomWinner() external {
        //request a random number
        //do something with it
        //make it a 2 transaction process, harder for people to manipulate then
     }

     function fulfillRandomWords(uint requestId, uint[] memory randomWords) internal override{

     }

function getEntranceFee() public view returns(uint){
    return i_entranceFee;
}

function getPlayers(uint index) public view returns(address) {
return s_players[index];
}

 }