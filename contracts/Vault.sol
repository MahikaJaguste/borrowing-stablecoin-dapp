// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Stablecoin.sol";

error InsufficientDepositBalance();
error InsufficientWithdrawBalance();

contract Vault {

    AggregatorV3Interface immutable public priceFeed;
    Stablecoin immutable public stablecoin;
    
    struct Balance{
        uint ethDeposited;
        uint coinBorrowed;
    }

    mapping(address => Balance) private vaultBalances;

    constructor() {
        priceFeed = AggregatorV3Interface(0x0715A7794a1dc8e42615F059dD6e406A6594651A);
        stablecoin = new Stablecoin();
    }

    function getEthUsdPrice() public view returns (uint adjustedPrice) {
        (,int price,,,) = priceFeed.latestRoundData();
        if(price <= 0){
            revert InsufficientDepositBalance();
        }
        adjustedPrice = uint(price);
    }

    function deposit() public payable {
        // does not send any ether
        if (msg.value == 0){
            revert InsufficientDepositBalance();
        }
 
        // 8 decimals to get price of 1 ETH in USD
        // 18 decimals to get msg.value in ETH
        uint coinsToBorrow = (msg.value * getEthUsdPrice()) / 1e26;

        if(coinsToBorrow == 0){
            revert InsufficientDepositBalance();
        }

        // mint coins and update balances
        stablecoin.mint(msg.sender, coinsToBorrow);
        vaultBalances[msg.sender].ethDeposited += msg.value;
        vaultBalances[msg.sender].coinBorrowed += coinsToBorrow;

    }

    function withdraw(uint coinAmount) public {

        if(coinAmount > vaultBalances[msg.sender].coinBorrowed || vaultBalances[msg.sender].ethDeposited == 0) {
            revert InsufficientWithdrawBalance();
        }

        // divide getEthUsdPrice by 8 decimals
        // mulitply answer with 18 decimals to get ethTo Withdraw in wei
        uint ethToWithdraw = (coinAmount * 1e26) / getEthUsdPrice();

        // get minimum between ether to be withdrawn and ether available in user account
        if(ethToWithdraw > vaultBalances[msg.sender].ethDeposited) {
            ethToWithdraw = vaultBalances[msg.sender].ethDeposited;
        }
        
        // burn coin and transfer ether
        (bool success, ) = payable(msg.sender).call{value:ethToWithdraw}("");
        require(success, "Transfer failed");
        stablecoin.burn(msg.sender, coinAmount);

        // update valut balances
        vaultBalances[msg.sender].ethDeposited -= ethToWithdraw;
        vaultBalances[msg.sender].coinBorrowed -= coinAmount;
    }

    function getVaultBalances() public view returns (uint, uint) {
        Balance memory myBalance = vaultBalances[msg.sender];
        return (myBalance.ethDeposited, myBalance.coinBorrowed);
    }
}


// vault address: 0x8B02fa275Fcc061813E6b94c556e320d63Eb46de