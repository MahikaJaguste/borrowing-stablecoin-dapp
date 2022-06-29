const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("DeadmanSwitch contract", function () {
    
    let DeadmanSwitch;
    let deadmanSwitch;
    let owner;
    let alice;
    let bob;
    let blockWhenDeployed;

    beforeEach(async () => {
        DeadmanSwitch = await ethers.getContractFactory("DeadmanSwitch");
        [owner, alice, bob] = await ethers.getSigners();
        deadmanSwitch = await DeadmanSwitch.deploy(alice.address);
        blockWhenDeployed = await ethers.provider.getBlockNumber();
    });

    it("should deploy correctly", async () => {
        assert.isOk(deadmanSwitch, "Deployment failed");
        expect(await deadmanSwitch.presetAddress()).to.equal(alice.address);
        expect(await deadmanSwitch.latestBlockWhenCalled()).to.equal(blockWhenDeployed);
    });

    it("should accept valid presetAddress", async () => {
        await expect(DeadmanSwitch.deploy(ethers.constants.AddressZero)).to.be.reverted;
        await expect(DeadmanSwitch.deploy(owner.address)).to.be.reverted;
        await expect(deadmanSwitch.updatePresetAddress(ethers.constants.AddressZero)).to.be.reverted;
        await expect(deadmanSwitch.updatePresetAddress(owner.address)).to.be.reverted;
        await deadmanSwitch.updatePresetAddress(bob.address);
        expect(await deadmanSwitch.presetAddress()).to.equal(bob.address);
    });

    it("should accept funds from anyone", async () => {
        // for fallback function
        tx = {
            to: deadmanSwitch.address,
            value: ethers.utils.parseEther('1', 'ether'),
            data: '0x00'
        };
        await owner.sendTransaction(tx);
        await alice.sendTransaction(tx);
        expect(await ethers.provider.getBalance(deadmanSwitch.address)).to.equal(ethers.utils.parseEther('2'));

        // for recieve function
        tx = {
            to: deadmanSwitch.address,
            value: ethers.utils.parseEther('1', 'ether'),
        };
        await owner.sendTransaction(tx);
        await alice.sendTransaction(tx);
        expect(await ethers.provider.getBalance(deadmanSwitch.address)).to.equal(ethers.utils.parseEther('4'));   
    });

    it("should allow only owner to call still_alive", async () => {
        await deadmanSwitch.still_alive();
        const blockWhenCalled = await ethers.provider.getBlockNumber();
        expect(await deadmanSwitch.latestBlockWhenCalled()).to.equal(blockWhenCalled);
        await expect(deadmanSwitch.connect(alice).still_alive()).to.be.reverted;
    });

    it("should not transfer funds when contract balance is empty", async () => {
        expect(await ethers.provider.getBalance(deadmanSwitch.address)).to.equal(ethers.utils.parseEther('0'));
        await hre.network.provider.send("hardhat_mine", ["0xF"]);
        await expect(deadmanSwitch.transferFunds()).to.be.reverted;
    });

    it("should not transfer funds when 10 idle blocks have not yet passed", async () => {
        await deadmanSwitch.still_alive();
        const blockWhenCalled = await ethers.provider.getBlockNumber();
        tx = {
            to: deadmanSwitch.address,
            value: ethers.utils.parseEther('1', 'ether'),
        };
        await owner.sendTransaction(tx);
        const currentBlock = await ethers.provider.getBlockNumber();
        assert.isTrue(currentBlock - blockWhenCalled < 10);
        await expect(deadmanSwitch.transferFunds()).to.be.reverted;
    });

    it("should transfer funds when conditions are satisfied", async () => {
        await deadmanSwitch.still_alive();
        const blockWhenCalled = await ethers.provider.getBlockNumber();
        tx = {
            to: deadmanSwitch.address,
            value: ethers.utils.parseEther('1', 'ether'),
        };
        await owner.sendTransaction(tx);
        await hre.network.provider.send("hardhat_mine", ["0xF"]);

        const currentBlock = await ethers.provider.getBlockNumber();
        assert.isTrue(currentBlock - blockWhenCalled > 10);
        expect(await ethers.provider.getBalance(deadmanSwitch.address)).to.equal(ethers.utils.parseEther('1'));
        
        const b1 = await ethers.provider.getBalance(alice.address);
        await deadmanSwitch.transferFunds();
        const b2 = await ethers.provider.getBalance(alice.address);

        expect(b2.sub(b1)).to.equal(ethers.utils.parseEther('1'));
        expect(await ethers.provider.getBalance(deadmanSwitch.address)).to.equal(ethers.utils.parseEther('0'));
    })

});