import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React, { useMemo } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletConnection = ({ children }) => {
    // Set up network
    const network = WalletAdapterNetwork.Devnet;
    
    // Generate endpoint URL using clusterApiUrl
    const endpoint = useMemo(
        () => clusterApiUrl(network),
        [network]
    );

    // Configure wallet options
    const config = useMemo(
        () => ({
            commitment: 'confirmed',
            endpoint,
            wsEndpoint: '',
            autoConnectTimeout: 10000,
            confirmTransactionInitialTimeout: 60000
        }),
        [endpoint]
    );

    // Initialize wallet adapter
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter({
                network,
                timeout: 30000,
            })
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint} config={config}>
            <WalletProvider 
                wallets={wallets} 
                autoConnect={true}
                onError={(error) => {
                    console.error('Wallet error:', error);
                }}
            >
                <WalletModalProvider
                    logo="/solana-logo.png"
                    featuredWallets={2}
                >
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletConnection;