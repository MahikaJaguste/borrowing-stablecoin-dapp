import { useState, useContext } from "react";
import { ethers } from 'ethers';
import { AppContext } from '../App.js';
import { Card, Form, Button } from 'react-bootstrap';

function WithdrawForm() {

  const {signer, vaultContract} = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert(`Withdraw submitted`);
    setIsLoading(true);
    try{
      const txn = await vaultContract.connect(signer).withdraw();
      await txn.wait();
    }
    catch(err){
      alert('Transaction failed');
    }
    setIsLoading(false);
  }

  return (
    <Card>
    <Card.Body>
    <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>ETH Withdraw</Form.Label>
          <br/>
          <Form.Text className="text-muted">
          Collateral will be returned after
          MSC tokens are burned.
          </Form.Text>
        </Form.Group>

        <Button
          variant="primary"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Processing...' : 'Withdraw'}
        </Button>
        </Form>

    </Card.Body>
    </Card>
  )
}


export default WithdrawForm;
