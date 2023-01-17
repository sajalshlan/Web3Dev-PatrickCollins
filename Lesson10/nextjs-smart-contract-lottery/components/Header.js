import { useEffect } from "react";
import { useMoralis } from "react-moralis";

export const Header = () => {
  const { enableWeb3, account, isWeb3Enabled, isWeb3EnableLoading } =
    useMoralis();
  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) enableWeb3();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      {account ? (
        <div>
          "Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}"
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
            if (typeof window !== "undefined")
              window.localStorage.setItem = ["connected", "inject"];
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </>
  );
};
