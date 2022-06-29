import { useContext } from "react";
import { ethers } from 'ethers';
import { AppContext } from '../App.js';

function ConnectWallet() {

  const {walletAddress, 
        setWalletAddress, 
        provider, 
        setProvider} = useContext(AppContext);

  // Requests access to the user's META MASK WALLET
  // https://metamask.io
  async function requestAccount() {
    console.log('Requesting account...');

    // ❌ Check if Meta Mask Extension exists 
    if(window.ethereum) {
      console.log('detected');

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting...');
      }

    } else {
      alert('Meta Mask not detected');
    }
  }

  // Create a provider to interact with a smart contract
  async function connectWallet() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
    }
  }

  return (
    <>
        <header>
        {
            walletAddress ?
            <p>Wallet Address: {walletAddress}</p> :
            <button onClick={connectWallet}>Connect Wallet</button>
        }   
        </header>
    </>
  );
}

export default ConnectWallet;
