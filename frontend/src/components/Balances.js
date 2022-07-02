import { useState, useContext, useEffect } from "react";
import { AppContext } from '../App.js';
import { ethers } from "ethers";
import { Container, Row, Col, Card } from 'react-bootstrap';

function Balances() {

    const {signer, vaultContract} = useContext(AppContext);

    const [ethDeposited, setEthDeposited] = useState(null);
    const [coinBorrowed, setCoinBorrowed] = useState(null);

    useEffect(() => {
        getVaultBalances();
    }, []);

    async function getVaultBalances() {
        if(signer){
            const [result1, result2] = await vaultContract.connect(signer).getVaultBalances();
            setEthDeposited((ethers.utils.formatEther(result1)).toString());
            setCoinBorrowed(ethers.utils.formatEther(result2).toString());
        }
    }

    return (
        <>
        
        <Container>
        <Row>
          <Col>
          <Card>
            <Card.Body>
                <p>ETH deposited:</p> {ethDeposited ? ethDeposited : <p>Loading</p>}
            </Card.Body>
          </Card>
          </Col>
                
          <Col>
          <Card>
            <Card.Body>
                <p>MSC Borrowed:</p> {coinBorrowed ? coinBorrowed : <p>Loading</p>}
            </Card.Body>
          </Card>
          
          </Col>
        </Row>
      </Container>
      </>
  
    )
}


export default Balances;
