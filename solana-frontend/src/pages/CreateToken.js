import TokenCreation from '../components/TokenCreation';
import '../styles/createToken.css';

const CreateToken = () => {
    return (
        <div className="create-token-page">
            <h2 className="create-token-title">Create a New Token</h2>
            <TokenCreation />
        </div>
    );
};

export default CreateToken;