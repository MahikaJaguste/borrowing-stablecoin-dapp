import { useState, useEffect, createContext } from "react";
import { ethers } from 'ethers';
import VAULT_ABI from './artifacts/contracts/Vault.sol/Vault.json';
import ConnectWallet from './components/ConnectWallet.js';
import DepositForm from './components/DepositForm.js';
import WithdrawForm from './components/WithdrawForm.js';

export const AppContext = createContext();

function App() {

  const [accounts, setAccounts] = useState(null);
  const [signer, setSigner] = useState(null)
  const [provider, setProvider] = useState(null);
  const [vaultContract, setVaultContract] = useState(null);

  const contextObj = {
    accounts,
    setAccounts,
    signer,
    setSigner,
    provider,
    setProvider,
    vaultContract,
    setVaultContract
  };

  useEffect(() => {
    const vaultContractAddress = "0xD74aC4600fA3095D0eB2a27597454d4dcF985c80"
    const myContract = new ethers.Contract(vaultContractAddress, VAULT_ABI.abi, provider);
    setVaultContract(myContract);
  }, [provider]);

  return (
    <AppContext.Provider value={contextObj}>
        <>
          <ConnectWallet/>
          <h3>Send ETH as collateral, get MSC Stablecoin as loan!</h3>
          {accounts ? 
            <>
              <DepositForm/> 
              <br/>
              <WithdrawForm/>
            </>
            : 
            <p>Please connect wallet to proceed!</p>
          }
        </>
    </AppContext.Provider>

  );
}

export default App;
