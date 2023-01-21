import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { errors, ethers } from "ethers";
import { useMoralis, useWeb3Contract, isWeb3Enabled } from "react-moralis";
import { useNotification } from "web3uikit";
import pic from "../assets/you.jpg";

export const LotteryEntance = () => {
  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("");
  const [recentWinner, setRecentWinner] = useState("");

  //dispatch - used for dispatching state to context
  const dispatch = useNotification();

  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  //enter raffle function
  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, //specify the chainId here
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  //getting the entrance fee from the contract using useWeb3Contract hook and useState hook to re-render it
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  //getting the number of players from the contract
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  //getting the recent winner from the contract
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  //handlesuccess function and notificaton function
  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNotification(tx);
    updateUI();
  };

  const handleNotification = (tx) => {
    dispatch({
      type: "info",
      message: "Transaction Completed",
      title: "Transaction Notification",
      position: "topL",
      icon: "bell",
    });
  };

  //update UI function for all - entranceFee, recentWInner and number of players

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    setEntranceFee(entranceFeeFromCall);

    const playersFromCall = (await getNumberOfPlayers()).toString();
    setNumberOfPlayers(playersFromCall);

    const recentWinnerFromCall = (await getRecentWinner()).toString();
    setRecentWinner(recentWinnerFromCall);
  }

  //useEffect hook to render
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      {raffleAddress ? (
        <div className="p-5">
          <button
            className="bg-blue-500 hover:bg-blue-300 hover:text-pearl text-white rounded-xl mb-4 px-3 py-1"
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isFetching || isLoading}
          >
            {isFetching || isLoading ? (
              <div className="animate-spin spinner-border h-6 w-6 border-b-2 rounded-full text-white"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div className="mb-1 text-lg">
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
          <div className="mb-1 text-lg">
            Number Of Players: {parseInt(numberOfPlayers)}
          </div>
          <div className="mb-1 text-lg">Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <img src={pic} />
      )}
    </>
  );
};
