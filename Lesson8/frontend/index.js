import { ethers } from "./ethers-5.6.min.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const fundBtn = document.getElementById("fundBtn");
const balanceBtn = document.getElementById("balanceBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
connectBtn.onclick = connect;
fundBtn.onclick = fund;
balanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;

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
  const ethAmount = document.getElementById("fund").value;
  if (window.ethereum) {
    console.log(`Funding with ${ethAmount}`);
    //provider/ connection to the blockchain
    //signer/wallet/account / someone with gas
    //the contract we are connecting to: its ABI and address

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    //the metamask extension will act as the provider here, giving us the RPC url and the account active currently as the signer

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      //hey wait for this tx to finish
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");

      //listen for the tx to be mined
      //listen for an event -> later, after learning
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);

  //listen for this transaction to finish
  //but the provider.once() fnc fires a listen function, which js adds to the event loop and will do the console.log("Done!") from above and then come back to this listener, we don't want that, we want this listener to get executed first and then it log Done!, so adding a promise here

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function getBalance() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw() {
  if (window.ethereum) {
    console.log("withdrawing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      console.log("done!");
    } catch (error) {
      console.log(error);
    }
  }
}
