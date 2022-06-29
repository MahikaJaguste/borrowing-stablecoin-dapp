import { useState, useContext } from "react";
import { ethers } from 'ethers';
import { AppContext } from '../App.js';

function DepositForm() {

  const {signer, vaultContract} = useContext(AppContext);

  const [ethDeposit, setEthDeposit] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`The amount of ether you entered was: ${ethDeposit}`);
    // await vaultContract.connect(signer).deposit({ value: ethers.utils.parseEther(ethDeposit) });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter amount of Ether you want to deposit:
        <br/>
        <input 
            type="number" 
            min="0" 
            onChange={(e) => {
                    let temp_val = parseInt(e.target.value);
                    if(temp_val >= 0){
                        setEthDeposit(e.target.value);
                    } 
                }
            }
        />
      </label>
      <input type="submit" />
    </form>
  )
}


export default DepositForm;
