import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to Solana Frontend</h1>
            <nav>
                <Link to="/create-token">Create Token</Link>
                <Link to="/mint-token">Mint Token</Link>
            </nav>
        </div>
    );
};

export default Home;