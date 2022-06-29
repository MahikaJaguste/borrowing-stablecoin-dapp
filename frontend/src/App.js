import { useState, createContext } from "react";
// import { ethers } from 'ethers';
import ConnectWallet from './components/ConnectWallet.js';
import DepositForm from './components/DepositForm.js';

export const AppContext = createContext();

function App() {

  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");

  const contextObj = {
    walletAddress: walletAddress,
    setWalletAddress: setWalletAddress,
    provider:provider,
    setProvider: setProvider,
  };

  return (
    <AppContext.Provider value={contextObj}>
        <>
          <ConnectWallet/>
          <h3>Send ETH as collateral, get MSC Stablecoin as loan!</h3>
          <DepositForm/>
        </>
    </AppContext.Provider>

  );
}

export default App;
