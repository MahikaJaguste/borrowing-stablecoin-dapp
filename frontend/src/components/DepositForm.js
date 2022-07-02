import { useState, useContext, useEffect } from "react";
import { ethers } from 'ethers';
import { AppContext } from '../App.js';
// import "cryptocompare"
const cc = require('cryptocompare');


function DepositForm() {

  const {signer, vaultContract} = useContext(AppContext);

  const [ethDeposit, setEthDeposit] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [coinToBeBorrowed, setCoinToBeBorrowed] = useState(0);

  useEffect(() => {
    getEthPrice();
  }, []);

  async function getEthPrice() {
    const result = await cc.price('ETH', 'USD');
    setEthPrice(result.USD);
  }

  useEffect(() => {
    if(ethDeposit > 0){
      console.log("eh", Math.floor(ethDeposit * ethPrice))
      setCoinToBeBorrowed(Math.floor(ethDeposit * ethPrice));
    }
    else{
      setCoinToBeBorrowed(0);
    }
  }, [ethDeposit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert(`The amount of ether you entered was: ${ethDeposit}`);
    await vaultContract.connect(signer).deposit({ value: ethers.utils.parseEther(ethDeposit) });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter amount of Ether you want to deposit:
        <br/>
        <input 
            type="number" 
            min="0"
            step="any" 
            onChange={(e) => {
                    let temp_val = parseFloat(e.target.value);
                    if(temp_val >= 0){
                        setEthDeposit(e.target.value);
                    }
                    if(e.target.value === ''){
                      setEthDeposit(0);
                    }
                }
            }
        />
        {coinToBeBorrowed ? <p>Approx coin that can be borrowed: {coinToBeBorrowed}</p> : <></>}
      </label>
      <input type="submit" />
    </form>
  )
}


export default DepositForm;
