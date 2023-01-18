import { abi, contractAddresses } from "@/constants";
import { useMoralis, useWeb3Contract } from "react-moralis";

export const LotteryEntance = () => {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);

  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, //specify the chainId here
    functionName: "enterRaffle",
    params: {},
    msgValue: "",
  });

  return <>Hi! lottery ki mkc</>;
};
