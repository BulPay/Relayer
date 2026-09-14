import dotenv from 'dotenv';

dotenv.config();

export const config = {
  stellar: {
    network: process.env.STELLAR_NETWORK || 'testnet',
    horizonUrl: process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
    relayerSecretKey: process.env.STELLAR_RELAYER_SECRET_KEY,
    relayerPublicKey: process.env.STELLAR_RELAYER_PUBLIC_KEY,
  },
  api: {
    port: parseInt(process.env.PORT || '3001', 10),
    apiKey: process.env.API_KEY,
  },
  trustlessWork: {
    apiKey: process.env.TRUSTLESS_WORK_API_KEY,
  },
};

// Validate required environment variables
if (!config.stellar.relayerSecretKey || !config.stellar.relayerPublicKey) {
  throw new Error('STELLAR_RELAYER_SECRET_KEY and STELLAR_RELAYER_PUBLIC_KEY are required');
}

if (!config.api.apiKey) {
  throw new Error('API_KEY is required');
}
