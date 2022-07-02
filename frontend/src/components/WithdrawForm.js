import { useState, useContext } from "react";
import { ethers } from 'ethers';
import { AppContext } from '../App.js';

function WithdrawForm() {

  const {signer, vaultContract} = useContext(AppContext);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert(`The amount of coin you entered was: ${coinReturn}`);
    await vaultContract.connect(signer).withdraw();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter amount of MSC you want to return:
        <br/>
        {/* <input 
            type="number" 
            min="0" 
            step="any"
            onChange={(e) => {
                    let temp_val = parseFloat(e.target.value);
                    if(temp_val >= 0){
                        setCoinReturn(e.target.value);
                    } 
                }
            }
        /> */}
      </label>
      <input type="submit" />
    </form>
  )
}


export default WithdrawForm;
