import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useMemo } from 'react';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import CreateToken from './pages/CreateToken';
import MintToken from './pages/MintToken';
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';

function App() {
  // Set up Solana network and endpoint
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Configure connection options
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

  // Set up wallet adapters with configuration
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({
        network,
        timeout: 30000,
      }),
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
        <WalletModalProvider>
          <Router>
            <div className="App">
              <NavBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-token" element={<CreateToken />} />
                <Route path="/mint-token" element={<MintToken />} />
              </Routes>
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;