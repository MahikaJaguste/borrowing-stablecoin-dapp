import { useState, useContext, useEffect } from "react";
import { ethers } from 'ethers';
import { AppContext } from '../App.js';
import { Card, Form, Button } from 'react-bootstrap';
const cc = require('cryptocompare');


function DepositForm() {

  const {signer, vaultContract} = useContext(AppContext);

  const [ethDeposit, setEthDeposit] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [coinToBeBorrowed, setCoinToBeBorrowed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getEthPrice();
  }, []);

  async function getEthPrice() {
    const result = await cc.price('ETH', 'USD');
    setEthPrice(result.USD);
  }

  useEffect(() => {
    if(ethDeposit > 0){
      setCoinToBeBorrowed(Math.floor(ethDeposit * ethPrice));
    }
    else{
      setCoinToBeBorrowed(0);
    }
  }, [ethDeposit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert(`The amount of ether you entered was: ${ethDeposit}`);
    if(ethDeposit){
      setIsLoading(true);
      try{
        const txn = await vaultContract.connect(signer).deposit({ value: ethers.utils.parseEther(ethDeposit) });
        await txn.wait();
      }
      catch(err){
        alert('Transaction failed');
      }
      setIsLoading(false);  
    }   
  }

  return (
  
    <Card>
    <Card.Body>

    <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>ETH Deposit</Form.Label>
          <Form.Control type="number" 
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
                } />
        </Form.Group>
        <Form.Text className="text-muted">
        {coinToBeBorrowed ? <p>You can borrow approximately {coinToBeBorrowed} MSC.</p> : <p>Enter deposit value in ETH</p>}
        </Form.Text>
        <Button
          variant="primary"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Processing...' : 'Deposit'}
        </Button>
        </Form>

    </Card.Body>
    </Card>

  )
}




export default DepositForm;
