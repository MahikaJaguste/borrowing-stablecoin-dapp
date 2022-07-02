async function main() {
    const [deployer] = await ethers.getSigners(); //get the account to deploy the contract
  
    console.log("Deploying contracts with the account:", deployer.address); 

    const Vault = await ethers.getContractFactory("Vault"); // Getting the Contract

    const networkName = hre.network.name;
    let vault;
    if(networkName == "rinkeby" || networkName == 'hardhat' || networkName == 'localhost'){
        vault = await Vault.deploy("0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"); //deploying the contract
    }
    else if (networkName == "mumbai") {
        vault = await Vault.deploy("0x0715A7794a1dc8e42615F059dD6e406A6594651A"); //deploying the contract
    }

    await vault.deployed(); // waiting for the contract to be deployed
    console.log("Vault deployed to:", vault.address); // Returning the contract address

    // const result = await vault.getEthUsdPrice();
    // console.log(result);

}
  
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
}); // Calling the function to deploy the contract 

// Rinkeby
// vault address: 0x1BFb3567AD7FE3Df33b9a45F3038Cf545B4418E9
// stablecoin address: 0xed57af2595bF660A08b241A19E799280107af330

// Mumbai
// vault address: 
// stablecoin address: 