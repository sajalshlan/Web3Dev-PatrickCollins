// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.17;

//Raffle Contract

//players entering with paying entry fee
//pick a random winner -> verifyable random variable chainlink
//winner selected every X minutes -> automate it

//Chainlink Oracle -> Randomness, Automated Execution(Chainlink keepers)

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";


/* Errors */
error RAFFLE__NotEnoughEthEntered();
error RAFFLE__TransferFailed();
error RAFFLE_NotOpen();


contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {

    /* Type declaration */
    enum RaffleState {
        OPEN,
        CALCULATING
    } //uint 0 = OPEN, 1 = CALCULATING

    /* State Variables */
    uint private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;

    /* Lottery Variables */
    address payable private s_recentWinner;
    RaffleState private s_raffleState;


    /* Events */
    event RaffleEntry(address indexed player);
    event RequestedRaffleWinner(uint indexed requestId);
    event WinnerPicked(address indexed winner);
    

    constructor(address vrfCoordinatorV2, uint entranceFee, bytes32 gasLane, uint64 subscriptionId, uint32 callbackGasLimit) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_entranceFee = entranceFee;
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
    }

    //making enterRaffle payable as people will sending eth, hence we accepting msg.value

    function enterRaffle() public payable {
        if(msg.value<i_entranceFee){
            revert RAFFLE__NotEnoughEthEntered();
        }
        
        if(s_raffleState != RaffleState.OPEN)
            revert RAFFLE_NotOpen();

        s_players.push(payable(msg.sender));

        //emit an event whenever we update a dynamic array or mapping
        //event named as reverse of function name
    emit RaffleEntry(msg.sender);

    }

    /**
     * @dev this is the function that the chainlink keeper nodes call
     * they look for the `upkeepNeeded` to return true.
     * The following should be true in order to return true:
     * 1. time interval should have passed
     * 2. lottery should have atleast 1 player and some ETH
     * 3. we should have test LINK in our subscription
     * 4. lottery should be in an 'open' state, meaning when the random number is returning, it should not allow any new players to join in
     */

    function checkUpkeep(bytes calldata /* checkData */) external override returns(bool upkeepNeeded, bytes memory /* performData */) {

    }

     function requestRandomWinner() external {
        //request a random number
        //do something with it
        //make it a 2 transaction process, harder for people to manipulate then
        s_raffleState = RaffleState.CALCULATING;
        uint requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, //gas lanes - a has lane key hash value, max price you are willing to pay for a req
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
     }

     function fulfillRandomWords(uint /* requestId */, uint[] memory randomWords) internal override{
        uint indexOfTheWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfTheWinner];

        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;
        //now since we got recent winner, let's transfer them the money
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if(!success) revert RAFFLE__TransferFailed();

        emit WinnerPicked(recentWinner);
     }

function getEntranceFee() public view returns(uint){
    return i_entranceFee;
}

function getPlayers(uint index) public view returns(address) {
return s_players[index];
}

function getRecentWinner() public view returns(address) {
    return s_recentWinner;
}

}