import { Abril_Fatface } from "@next/font/google";
import { ConnectButton } from "web3uikit";

export const BetterHeader = () => {
  return (
    <div className="flex flex-row p-5 justify-between items-center">
      <h1 className="font-bold text-2xl text-violet-600">
        Decentralized Lottery mfs
      </h1>
      <ConnectButton moralisAuth={false} />
    </div>
  );
};
