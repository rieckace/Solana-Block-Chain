import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { mintTo, getMint, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import React, { useState, useEffect } from 'react';
import '../styles/T_minting.css';

const TokenMinting = () => {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [mintAddressInput, setMintAddressInput] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const savedMint = localStorage.getItem('lastCreatedMint');
        if (savedMint) {
            setMintAddressInput(savedMint);
        }
    }, []);

    const handleMintToken = async () => {
        if (!publicKey) {
            setError('Please connect your wallet first');
            return;
        }

        if (!mintAddressInput || !amount || isNaN(amount)) {
            setError('Please provide valid mint address and amount');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const mintPubkey = new PublicKey(mintAddressInput);
            
            // Get mint info and verify authority
            const mintInfo = await getMint(connection, mintPubkey);
            
            if (!mintInfo.mintAuthority?.equals(publicKey)) {
                throw new Error('You are not the mint authority for this token');
            }

            // Get or create associated token account
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                publicKey,
                mintPubkey,
                publicKey
            );

            // Calculate amount with decimals
            const tokenAmount = parseInt(amount) * Math.pow(10, mintInfo.decimals);

            // Create and send transaction
            const transaction = new Transaction().add(
                mintTo(
                    connection,
                    publicKey,
                    mintPubkey,
                    tokenAccount.address,
                    publicKey,
                    tokenAmount
                )
            );

            transaction.recentBlockhash = (
                await connection.getLatestBlockhash()
            ).blockhash;
            transaction.feePayer = publicKey;

            if (signTransaction) {
                const signed = await signTransaction(transaction);
                const signature = await connection.sendRawTransaction(signed.serialize());
                await connection.confirmTransaction(signature, 'confirmed');
                
                console.log('Minting successful:', signature);
                alert(`Successfully minted ${amount} tokens!`);
            }
        } catch (error) {
            console.error('Error:', error);
            setError(`Failed to mint tokens: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="token-minting">
            {!publicKey ? (
                <p className="connect-prompt">Please connect your wallet to mint tokens</p>
            ) : (
                <>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Enter Token Mint Address"
                            value={mintAddressInput}
                            onChange={(e) => setMintAddressInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <input
                            type="number"
                            placeholder="Enter Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isLoading}
                            min="1"
                        />
                    </div>
                    
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}

                    <button 
                        onClick={handleMintToken} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Minting Tokens...' : 'Mint Tokens'}
                    </button>
                </>
            )}
        </div>
    );
};

export default TokenMinting;