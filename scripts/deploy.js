async function main() {
    const [deployer, presetAddress] = await ethers.getSigners(); //get the account to deploy the contract
  
    console.log("Deploying contracts with the account:", deployer.address); 
  
    const Stablecoin = await ethers.getContractFactory("Stablecoin"); // Getting the Contract
    const stablecoin = await Stablecoin.deploy(); //deploying the contract
  
    await stablecoin.deployed(); // waiting for the contract to be deployed
    console.log("Stablecoin deployed to:", stablecoin.address); // Returning the contract address

    const Vault = await ethers.getContractFactory("Vault"); // Getting the Contract
    const vault = await Vault.deploy(stablecoin.address); //deploying the contract

    await vault.deployed(); // waiting for the contract to be deployed
    console.log("Vault deployed to:", vault.address); // Returning the contract address
  }
  
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
}); // Calling the function to deploy the contract 