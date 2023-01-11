// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.17;

//Raffle Contract

//players entering with paying entry fee
//pick a random winner -> verifyable random variable chainlink
//winner selected every X minutes -> automate it

//Chainlink Oracle -> Randomness, Automated Execution(Chainlink keepers)

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error RAFFLE__NotEnoughEthEntered();

contract Raffle is VRFConsumerBaseV2{

    /* State Variables */
    uint private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint64 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;


    /* Events */
    event RaffleEntry(address indexed player);
    

    constructor(address vrfCoordinatorV2, uint entranceFee, bytes32 gasLane, uint64 subscriptionId, uint64 callbackGasLimit) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_entranceFee = entranceFee;
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
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

        i_vrfCoordinator.requestRandomWords(
            i_gasLane, //gas lanes - a has lane key hash value, max price you are willing to pay for a req
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
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