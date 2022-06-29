// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

error InsufficientDepositBalance();

contract Trial {

    ChildContract immutable public child;
    
    constructor() {
        child = new ChildContract();
    }

    function deposit() public payable {
        if (msg.value == 0){
            revert InsufficientDepositBalance();
        }
        revert InsufficientDepositBalance();
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function convertIntToUint() public pure returns (uint a, uint b) {
        int c = -1;
        int d = 1;
        a = uint(c);
        b = uint(d);
    }

    function funcA() public pure {
        revert InsufficientDepositBalance();
    }

    function funcB() public payable {
        funcA();
    }

    function checkEther(uint depositAmount) public payable {
        require(depositAmount == msg.value, "Not equal");
        payable(msg.sender).call{value:msg.value}("");
    }
}

contract ChildContract {
    constructor() {

    }
}
