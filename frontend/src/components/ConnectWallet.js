import { useContext } from "react";
import { ethers } from 'ethers';
import { AppContext } from '../App.js';

function ConnectWallet() {

  const {accounts,
        setAccounts,
        setSigner,
        setProvider,
      } = useContext(AppContext);

  let myAccounts;

  // Requests access to the user's META MASK WALLET
  // https://metamask.io
  async function requestAccount() {
    console.log('Requesting account...');

    // ❌ Check if Meta Mask Extension exists 
    if(window.ethereum) {
      console.log('detected');

      try {
        myAccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(myAccounts);
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
      const signer = web3Provider.getSigner(myAccounts[0]);
      setSigner(signer)
    }
  }

  return (
    <>
        <header>
        {
            accounts ?
            <p>Wallet Address: {accounts[0]}</p>
            :
            <button onClick={connectWallet}>Connect Wallet</button>
        }   
        </header>
    </>
  );
}

export default ConnectWallet;
