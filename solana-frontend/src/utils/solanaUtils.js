export function validatePublicKey(address) {
    try {
        const key = new PublicKey(address);
        return key; // Valid PublicKey
    } catch (error) {
        console.error('Invalid PublicKey:', error.message);
        return null; // Handle invalid cases
    }
}