import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useMoralis, useWeb3Contract, isWeb3Enabled } from "react-moralis";

export const LotteryEntance = () => {
  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [entranceFee, setEntranceFee] = useState("0");

  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const { runContractFunction: enterRaffle } = useWeb3Contract({
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

  //useEffect hook to render
  useEffect(() => {
    if (isWeb3Enabled) {
      console.log("useeffect");
      async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        setEntranceFee(entranceFeeFromCall);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      Hi! lottery ki mkc{" "}
      {raffleAddress ? (
        <div>
          <button
            onClick={async () => {
              await enterRaffle();
            }}
          >
            Enter Raffle
          </button>
          <br />
          Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
        </div>
      ) : (
        <div>Raffle Address not detected</div>
      )}
    </>
  );
};
