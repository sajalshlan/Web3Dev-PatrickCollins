import Head from "next/head";
import { useState } from "react";
import { ethers } from "ethers";
// import styles from "@/styles/Home.module.css";

//connect to metamask
//execute a function

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState();

  async function connect() {
    if (typeof window.ethereum != "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setSigner(provider.getSigner());
        console.log(signer);
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }
  return (
    <>
      <h2>hello</h2>
      {isConnected ? (
        "Connected"
      ) : (
        <button onClick={() => connect()}>Connect</button>
      )}
    </>
  );
}
