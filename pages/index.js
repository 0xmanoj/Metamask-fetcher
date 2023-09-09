require('dotenv').config();
import React, { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Image from 'next/image';
import imageEth from "../ether.png";
import Creater from "../0x0.webp";


const Home = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [connect, setConnect] = useState(false);
    const [balance, setBalance] = useState('');
    const failMessage = "Please install Metamask and Connect !!";
    const sucessMessage = "Your Account has been successfully Connected";


    const checkIfWalletConnected = async () => {

        if (!window.ethereum) return;

        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                // Create a new provider with the current network
                const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`);
                const address = ethers.utils.getAddress(accounts[0]);
                const balance = await provider.getBalance(address);
                const showBalance = ethers.utils.formatEther(balance);
                console.log(provider);
                setBalance(showBalance + " ETH");
            } else {
                setBalance("0 ETH"); // No account connected
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
            setBalance("Error fetching balance");
        }
    };

    const CWallet = async () => {
        if (!window.ethereum) return console.log(failMessage);

        const accounts = await window.ethereum.request(
            { method: "eth_requestAccounts" }
        )

        setCurrentAccount(accounts[0]);

        window.location.reload();
    };

    useEffect(() => {
        checkIfWalletConnected();
    });

    useEffect(() => {
        async function accountChanged() {
            window.ethereum.on('accountsChanged', async function () {
                const accounts = await window.ethereum.request(
                    { method: "eth_accounts" }
                );
                if(accounts.length){
                    setCurrentAccount(accounts[0])
                }else{
                    window.location.reload();
                }
            });
        }
        accountChanged();
    },[]);
    return (
        <div className='card-container'>
            {!currentAccount ? "" : <span className='pro'>PRO</span>}
            <Image src={Creater} alt='Profile' width={80} height={80} />
            <h3>Check Ether</h3>

            {!currentAccount ? (
                <div>
                    <div className='message'>
                        <p>
                            {failMessage}
                        </p>
                    </div>
                    <Image src={imageEth} alt='ether' width={100} height={140} />
                    <p>
                        Welcome to ether account balance checker
                    </p>
                </div>
            ) : (
                <div>
                    <h6>
                        Verified <span className='tick'>&#10004;</span>
                    </h6>
                    <p>
                        Ether account and balance checker <br /> find account details
                    </p>
                    <div className='buttons'>
                        <button className='primary goast' onClick={() => { }}>Ether Account details</button>
                    </div>
                </div>
            )}
            {!currentAccount && !connect ? (
                <div className='buttons'>
                    <button className='primary' onClick={() => CWallet()}>Connect Wallet</button>
                </div>
            ) : (
                <div className='skills'>
                    <h6>Your Ether</h6>
                    <ul>
                        <li>
                            Account
                        </li>
                        <li>
                            {currentAccount}
                        </li>
                        <li>
                            Balance
                        </li>
                        <li>{balance}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;
