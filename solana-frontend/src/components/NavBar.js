import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import '../styles/NavBar.css';

const NavBar = () => {
    const { publicKey } = useWallet();

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/create-token">Create Token</Link>
                <Link to="/mint-token">Mint Token</Link>
            </div>
            <div className="wallet-info">
                {publicKey && (
                    <div className="wallet-address">
                        Address: {publicKey.toString().slice(0, 4)}...
                        {publicKey.toString().slice(-4)}
                        <button 
                            className="copy-button"
                            onClick={() => navigator.clipboard.writeText(publicKey.toString())}
                        >
                            Copy
                        </button>
                    </div>
                )}
                <WalletMultiButton />
            </div>
        </nav>
    );
};

export default NavBar;