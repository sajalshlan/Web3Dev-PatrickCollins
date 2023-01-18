import { abi, contractAddresses } from "@/constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useMoralis, useWeb3Contract, isWeb3Enabled } from "react-moralis";

export const LotteryEntance = () => {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [entranceFee, setEntranceFee] = useState("0");

  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, //specify the chainId here
    functionName: "enterRaffle",
    params: {},
    msgValue: "",
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
        setEntranceFee(ethers.utils.formatUnits(entranceFeeFromCall, "ether"));
        console.log(entranceFee);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      Hi! lottery ki mkc <div>Entrance Fee: {entranceFee} ETH</div>
    </>
  );
};
