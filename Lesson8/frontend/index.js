import { ethers } from "./ethers-5.6.min.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const fundBtn = document.getElementById("fundBtn");
connectBtn.onclick = connect;
fundBtn.onclick = fund;

console.log(ethers);

async function connect() {
  if (window.ethereum) {
    await ethereum.request({ method: "eth_requestAccounts" });
    console.log("connected to metamask!");
    connectBtn.innerHTML = "Connected";
  } else {
    connectBtn.innerHTML = "Please download Metamask extension";
  }
}

async function fund() {
  const ethAmount = "70";
  if (window.ethereum) {
    console.log(`Funding with ${ethAmount}`);
    //provider/ connection to the blockchain
    //signer/wallet/account / someone with gas
    //the contract we are connecting to: its ABI and address

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
