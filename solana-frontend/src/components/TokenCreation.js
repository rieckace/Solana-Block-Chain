import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createMint, getAccount, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { useState, useEffect } from 'react';
import '../styles/T_creating.css';

const TokenCreation = () => {
    const { connection } = useConnection();
    const { publicKey, signTransaction, connected } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [mintAddress, setMintAddress] = useState('');
    const [error, setError] = useState('');
    const [balance, setBalance] = useState(0);

    // Check wallet connection and balance
    useEffect(() => {
        const checkBalance = async () => {
            if (connected && publicKey) {
                try {
                    const balance = await connection.getBalance(publicKey);
                    setBalance(balance / LAMPORTS_PER_SOL);
                } catch (err) {
                    console.error("Error fetching balance:", err);
                }
            }
        };

        if (!connected) {
            setError('Please connect your wallet first');
        } else {
            setError('');
            checkBalance();
        }
    }, [connected, publicKey, connection]);

    const handleCreateToken = async () => {
        if (!connected || !publicKey || !signTransaction) {
            setError('Wallet not connected properly');
            return;
        }

        if (balance < 0.05) {
            setError('Insufficient SOL balance. You need at least 0.05 SOL');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            console.log("Creating token with authority:", publicKey.toString());
            
            // Create a new keypair for the mint
            const mintKeypair = Keypair.generate();
            console.log("Mint public key:", mintKeypair.publicKey.toString());

            // Create the token mint with increased timeout
            const mint = await createMint(
                connection,
                publicKey,  // payer
                publicKey,  // mint authority
                publicKey,  // freeze authority
                9,         // decimals
                mintKeypair,
                {
                    commitment: 'confirmed',
                    preflightCommitment: 'confirmed',
                    skipPreflight: false,
                    maxRetries: 5
                }
            );

            // Wait for confirmation
            await connection.confirmTransaction(mint, 'confirmed');

            // Verify the mint was created
            try {
                const mintInfo = await getAccount(
                    connection,
                    mint,
                    'confirmed',
                    TOKEN_PROGRAM_ID
                );
                console.log("Mint info:", mintInfo);
            } catch (verifyError) {
                console.error("Error verifying mint:", verifyError);
                throw new Error('Token creation failed verification');
            }

            setMintAddress(mint.toBase58());
            console.log(`Token Created! Mint Address: ${mint.toBase58()}`);
            
            // Save mint address to localStorage
            localStorage.setItem('lastCreatedMint', mint.toBase58());
            
        } catch (error) {
            console.error("Error creating token:", error);
            setError(error.message || 'Failed to create token. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="token-creation card fade-in">
            <div className="wallet-section">
                <WalletMultiButton />
                {connected && publicKey && (
                    <div className="wallet-info">
                        <p className="wallet-address">
                            Connected: {publicKey.toString().slice(0, 4)}...
                            {publicKey.toString().slice(-4)}
                        </p>
                        <p className="wallet-balance">
                            Balance: {balance.toFixed(4)} SOL
                        </p>
                    </div>
                )}
            </div>

            {!connected || !publicKey ? (
                <p className="connect-prompt">Please connect your wallet to create tokens</p>
            ) : (
                <>
                    <div className="info-message">
                        <p>Make sure you have enough SOL for transaction fees (≈0.05 SOL)</p>
                        <p>Network: Devnet</p>
                    </div>

                    <button 
                        onClick={handleCreateToken} 
                        disabled={isLoading || balance < 0.05}
                        className={`create-button ${isLoading ? 'loading' : ''}`}
                    >
                        {isLoading ? 'Creating Token...' : 'Create Token'}
                    </button>

                    {error && (
                        <div className="error-message fade-in">
                            <p>{error}</p>
                        </div>
                    )}

                    {mintAddress && (
                        <div className="success-message fade-in">
                            <h3>Token Created Successfully!</h3>
                            <p>Mint Address:</p>
                            <code className="mint-address">{mintAddress}</code>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(mintAddress);
                                    alert('Address copied to clipboard!');
                                }}
                                className="copy-button"
                            >
                                Copy Address
                            </button>
                            <a 
                                href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button"
                            >
                                View on Explorer
                            </a>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TokenCreation;