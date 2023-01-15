const { ethers } = require("ethers");

const connectBtn = document.getElementById("connectBtn");

async function connect() {
  if (typeof window.ethereum != "undefined") {
    await ethereum.request({ method: "eth_requestAccounts" });
    connectBtn.textContent = "Connected";
    console.log("Connected to metamask");
  }
}

async function execute() {
  if (typeof window.ethereum != "undefined") {
    //contract address - "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    //abi - got it from simpleStorage.json, in there is an object abi
    //node connection - got it - metamask
    //function - yea we got a function to call, store

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const abi = [
      {
        inputs: [
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_favoriteNumber",
            type: "uint256",
          },
        ],
        name: "addPerson",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        name: "nameToFavoriteNumber",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "people",
        outputs: [
          {
            internalType: "uint256",
            name: "favoriteNumber",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "retrieve",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_favoriteNumber",
            type: "uint256",
          },
        ],
        name: "store",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    //now we stick our metamask(rpc) to ethers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //we could also do this, directly with the rpc url:
    //const provider = new ethers.providers.Web3Provider(http://127.0.0.1:8545/) - directly the local hardhat node rpc url
    //but instead inserting window.ethereum and then it can itself detect what testnet/chain the user is working on, and will itself detect the rpc url, rather than us hardcoding

    //now to get our connected account
    const signer = provider.getSigner();

    //now an instance of that contract with contractAddress, abi to get the functions to interact with and signer, i.e, the user's wallet/account with which he/she will connect and execute transactions
    const contract = await ethers.Contract(contractAddress, abi, signer);

    //call a function
    await contract.store(24);
  }
}

module.exports = { connect, execute };
