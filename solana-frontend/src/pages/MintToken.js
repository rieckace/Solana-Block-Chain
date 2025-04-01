import TokenMinting from '../components/TokenMinting';
import '../styles/mintToken.css';

const MintToken = () => {
    return (
        <div className="mint-token-page">
            <h2 className="mint-token-title">Mint Tokens</h2>
            <TokenMinting />
        </div>
    );
};

export default MintToken;