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

    constructor(address _aggregator) {
        priceFeed = AggregatorV3Interface(_aggregator);
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
        uint coinsToBorrow = (msg.value * getEthUsdPrice()) / 1e8;

        if(coinsToBorrow == 0){
            revert InsufficientDepositBalance();
        }

        // mint coins and update balances
        vaultBalances[msg.sender].ethDeposited += msg.value;
        stablecoin.mint(msg.sender, coinsToBorrow);
        vaultBalances[msg.sender].coinBorrowed += coinsToBorrow;
    }

    function withdraw() public {

        if(vaultBalances[msg.sender].coinBorrowed > stablecoin.balanceOf(msg.sender)) {
            revert InsufficientWithdrawBalance();
        }

        // burn coin and update vault balances
        stablecoin.burn(msg.sender, vaultBalances[msg.sender].coinBorrowed);
        vaultBalances[msg.sender].coinBorrowed = 0;

        // transfer ether and update vault balances
        (bool success, ) = payable(msg.sender).call{value:vaultBalances[msg.sender].ethDeposited}("");
        require(success, "Transfer failed");
        vaultBalances[msg.sender].ethDeposited = 0;
    }

    function getVaultBalances() public view returns (uint, uint) {
        Balance memory myBalance = vaultBalances[msg.sender];
        return (myBalance.ethDeposited, myBalance.coinBorrowed);
    }
}