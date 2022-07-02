const { expect, assert, reverted } = require("chai");
const { ethers } = require("hardhat");
const STABLECOIN_ABI = require("../frontend/src/artifacts/contracts/Stablecoin.sol/Stablecoin.json")

describe("Vault contract", function () {
    
    let Vault;
    let vault;;
    let deployer;
    let alice;
    let stablecoin;

    before(async () => {

        [deployer, alice] = await ethers.getSigners(); //get the account to deploy the contract
        // console.log("Deploying contracts with the account:", deployer.address); 

        Vault = await ethers.getContractFactory("Vault"); // Getting the Contract

        const networkName = hre.network.name;
        if(networkName == "rinkeby"){
            vault = await Vault.deploy("0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"); //deploying the contract
        }
        else if (networkName == "mumbai" || networkName == 'hardhat' || networkName == 'localhost') {
            vault = await Vault.deploy("0x0715A7794a1dc8e42615F059dD6e406A6594651A"); //deploying the contract
        }

        await vault.deployed(); // waiting for the contract to be deployed
        // console.log("Vault deployed to:", vault.address); // Returning the contract address

        const stablecoinAddress = await vault.stablecoin();
        stablecoin = new ethers.Contract(stablecoinAddress , STABLECOIN_ABI.abi, deployer);
    });

    it("should deploy correctly", async () => {
        assert.isOk(vault, "Vault deployment failed");
        assert.isOk(stablecoin, "Stablecoin deploymeny failed");
    });

    it("should deposit eth as collateral and lend stablecoin", async () => {
        
        await vault.deposit({value:ethers.utils.parseEther('0.001')});

        const [ethDeposited, coinBorrowed] = await vault.getVaultBalances();
        assert.isTrue(ethDeposited.eq(ethers.utils.parseEther('0.001')));

        assert.isTrue((await stablecoin.balanceOf(deployer.address)).gt(ethers.utils.parseEther('0')));
        assert.isTrue(coinBorrowed.gt(ethers.utils.parseEther('0')));
    });

    it("should withdraw eth on correct repayment of stablecoin", async () => {

        const balance1 = await ethers.provider.getBalance(deployer.address);
        await vault.withdraw();
        const balance2 = await ethers.provider.getBalance(deployer.address);

        assert.isTrue((await stablecoin.balanceOf(deployer.address)).eq(ethers.BigNumber.from(0)));
        assert.isTrue((balance2.sub(balance1)).gte(ethers.utils.parseEther('0.0009')));

        const [ethDeposited, coinBorrowed] = await vault.getVaultBalances();
        assert.isTrue(ethDeposited.eq(ethers.utils.parseEther('0')));   
        assert.isTrue(coinBorrowed.eq(ethers.BigNumber.from("0")));
    });

    it("should not withdraw eth if insufficient stablecoin", async () => {

        await vault.deposit({value:ethers.utils.parseEther('0.002')});
        await stablecoin.transfer(alice.address, 1);
        try{
            await vault.withdraw();
            assert.isTrue(false, "Bug: Able to withdraw even with insufficent balance")
        }
        catch(err){
            assert(err);
        }

        await stablecoin.connect(alice).transfer(deployer.address, 1);
        const balance1 = await ethers.provider.getBalance(deployer.address);
        await vault.withdraw();
        const balance2 = await ethers.provider.getBalance(deployer.address);

        assert.isTrue((await stablecoin.balanceOf(deployer.address)).eq(ethers.BigNumber.from(0)));
        assert.isTrue((balance2.sub(balance1)).gte(ethers.utils.parseEther('0.0019')));

        const [ethDeposited, coinBorrowed] = await vault.getVaultBalances();
        assert.isTrue(ethDeposited.eq(ethers.utils.parseEther('0')));   
        assert.isTrue(coinBorrowed.eq(ethers.BigNumber.from("0")));
    });

});