const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  //compile this code
  //yarn compile

  //deploying this code/contract

  const provider = new ethers.providers.JsonRpcProvider("");

  const wallet = new ethers.Wallet("", provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");

  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("deploying, please wait...");

  const contract = await contractFactory.deploy();
  console.log(contract);

  await contract.deployTransaction.wait(1);

  //getting a number - interacting with our contract

  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current fav number: ${currentFavoriteNumber.toString()}`);

  //storing a number - interacting with our contract
  const transactionResponse = await contract.store("7");
  //using double quotes, i.e, passing 7 as string as it's better to pass variables as strings, and ethers is smart enough to get that it is actually a number

  const transactionReceipt = await transactionResponse.wait(1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
