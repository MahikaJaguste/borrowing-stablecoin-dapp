import { useState, useContext, useEffect } from "react";
import { AppContext } from '../App.js';
import { ethers } from "ethers";

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
            setCoinBorrowed(result2.toString());
        }
    }

    return (
        <>
        <p>Ether deposited:</p> {ethDeposited ? ethDeposited : <p>Loading</p>}
        <p>CoinBorrowed</p> {coinBorrowed ? coinBorrowed : <p>Loading</p>}
        </>
    )
}


export default Balances;
