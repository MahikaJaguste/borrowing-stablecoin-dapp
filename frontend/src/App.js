import { useState, useEffect, createContext } from "react";
import { ethers } from 'ethers';
import VAULT_ABI from './artifacts/contracts/Vault.sol/Vault.json';
import ConnectWallet from './components/ConnectWallet.js';
import DepositForm from './components/DepositForm.js';
import WithdrawForm from './components/WithdrawForm.js';
import Balances from './components/Balances.js';

import 'bootstrap/dist/css/bootstrap.min.css';

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
    // rinkeby
    const vaultContractAddress = "0x1BFb3567AD7FE3Df33b9a45F3038Cf545B4418E9"
    // mumbai
    // const vaultContractAddress = "";
    const myContract = new ethers.Contract(vaultContractAddress, VAULT_ABI.abi, provider);
    setVaultContract(myContract);
  }, [provider]);

  return (
    <AppContext.Provider value={contextObj}>
        <center style={{
                paddingLeft: "500px",
                paddingRight: "500px",
                paddingTop: "50px"
                }}>
          <ConnectWallet/>
          <h3>Send ETH as collateral, get MSC Stablecoin as loan!</h3>
          <br/>
          {accounts ? 
            <>
              <Balances/>
              <br/>
              <DepositForm/> 
              <br/>
              <WithdrawForm/>
            </>
            : 
            <p>Please connect wallet to proceed!</p>
          }
        </center>
    </AppContext.Provider>

  );
}

export default App;
