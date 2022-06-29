import { useContext } from "react";
import { ethers } from 'ethers';
import { AppContext } from '../App.js';

function DepositForm() {

  const {walletAddress, provider,} = useContext(AppContext);

  

  return (
    <>
        <h5>Enter amount of Ether you want to deposit</h5>
        
    </>
  );
}

export default DepositForm;
