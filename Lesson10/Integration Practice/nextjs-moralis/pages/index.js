import { useMoralis, useWeb3Contract } from "react-moralis";

export default function Home() {
  const { enableWeb3, isWeb3Enabled } = useMoralis();

  return (
    <>
      <h2>hello mfs</h2>
      {isWeb3Enabled ? (
        <>
          "Connected"
          <button onClick={() => execute()}>Execute</button>
        </>
      ) : (
        <button onClick={() => enableWeb3()}>Connect</button>
      )}
    </>
  );
}
